import OrderProductDao from "../dao/OrderProducts.dao"
import OrderGestor from "./Orders.model"
import ProductGestor, { Product } from "./Products.model"
import { InterventionRecord, InterventionRecordGestor } from "./InterventionRecord.model"
import { DateTime } from "luxon"
import UserGestor from "./Users.model"
import BulkProductOutGestor from "./BulkProductOuts.model"
import OrderStateGestor from "./OrderStates.model"

interface OrderProduct {
    Id: number,
    OrderDocument: string,  
    OrderNumber: number, 
    Product: Product,
    Amount: number,
    InterventionRecord: InterventionRecord
}

const OrderProductGestor = {

    ConstructFromDao(data: any) {
        
        const orderProduct: OrderProduct = {
            Id: data.Id,
            OrderDocument: data.OrderDocument,  
            OrderNumber: data.OrderNumber, 
            Product: ProductGestor.Construct(data.Code, data.Description, data.Price),
            Amount: data.Amount,
            InterventionRecord: InterventionRecordGestor.ConstructFromDao(data.CreationDate, data.CreatedBy, data.ModificationDate, data.ModifiedBy)
        }

        return orderProduct
    },

    async Create(OrderDocument: string, OrderNumber: number, Code: string, Amount: number, User: string) {
    
        const order = await OrderGestor.GetByDocumentAndNumber(OrderDocument, OrderNumber)
        if (!order.Open) {
            throw(`No se puede agregar un producto a la orden, porque la orden ${OrderDocument + OrderNumber} esta cerrada.`)
        }
        if (order.Annulled) {
            throw(`No se puede agregar un producto a la orden, porque la orden ${OrderDocument + OrderNumber} esta anulada.`)
        }
        if (await OrderStateGestor.ValidateFinalState(order.OrderState)) {
            throw(`La orden ${order.OrderDocument} ${order.OrderNumber} actualmente esta en estado FINALIZADO en la base de datos. No se puede alterar. No es posible la modificación o alteración de la orden.`)
        }
        if (Amount <= 0) {
            throw("No se puede agregar una cantidad menor o igual a cero")
        }
        if (await this.ExistsByOrderAndProductCode(OrderDocument, OrderNumber, Code) ){
            const oldProduct = await this.GetByOrderAndProductCode(OrderDocument, OrderNumber, Code)
            const newAmount = Number(oldProduct.Amount) + Number(Amount)
            this.EditById(oldProduct.Id, Code, newAmount, User)
            return
        }

        const today = DateTime.local()

        const orderProduct: OrderProduct = {
            Id: 0,
            OrderDocument: OrderDocument,  
            OrderNumber: OrderNumber, 
            Product: await ProductGestor.GetByCode(OrderDocument, Code),
            Amount: Amount,
            InterventionRecord: {
                CreationDate: today,
                CreatedBy: (await UserGestor.GetByUserCode(User)).UserCode,
                ModificationDate: null, 
                ModifiedBy: null, 
            }
        }

        const {InterventionRecord, Product, ...restOrderProduct} = orderProduct
        
        const insertData = { 
            ...Product,
            ...restOrderProduct,
            ...InterventionRecordGestor.AdaptToInsert(InterventionRecord)
        }

        await OrderProductDao.insert(insertData)
    },

    async ListByOrder(OrderDocument: string, OrderNumber: number) {
        const data = await OrderProductDao.listByOrder(OrderDocument, OrderNumber)
        if (data === undefined) throw('Error al obtener el objeto OrderProduct, se obtuvo un valor "undefined" al hacer la consulta en la base de datos. Funcion: orderProduct.ListByOrder')
        const orderProductsList = data.map((d) => this.ConstructFromDao(d))
        return orderProductsList 
    },

    async GetById(Id: number) {
        const data = await OrderProductDao.getById(Id)
        if (data === undefined) {
            throw('Error al obtener el objeto OrderProduct, se obtuvo un valor "undefined" al hacer la consulta en la base de datos. Funcion: producto.GetById')
        }
        if (data.length === 0) {
            throw(`Error al obtener el objeto OrderProduct, no existe un producto de orden con Id ${Id} en la base de datos.`)
        }
        if (data.length > 1) {
            throw(`Error al obtener el objeto OrderProduct, inconsistencia de datos: hay más de un producto de orden con Id ${Id} en la base de datos.`)
        }
        const orderProduct = this.ConstructFromDao(data[0])
        return orderProduct
    },

    async EditById(Id: number, Code: string, Amount: number, User: string) {
        const oldOrderProduct = await this.GetById(Id)
        const {OrderDocument, OrderNumber} = oldOrderProduct
        const order = await OrderGestor.GetByDocumentAndNumber(OrderDocument, OrderNumber)
        if (!order.Open) {
            throw(`No se puede modificar el producto de orden, porque la orden ${OrderDocument + OrderNumber} esta cerrada.`)
        }
        if (order.Annulled) {
            throw(`No se puede modificar el producto de orden, porque la orden ${OrderDocument + OrderNumber} esta anulada.`)
        }
        if (await OrderStateGestor.ValidateFinalState(order.OrderState)) {
            throw(`La orden ${order.OrderDocument} ${order.OrderNumber} actualmente esta en estado FINALIZADO en la base de datos. No se puede alterar. No es posible la modificación o alteración de la orden.`)
        }
        const totalAmountBulkProduct = await BulkProductOutGestor.GetTotalAmountByOrderProduct(Id)
        const totalAnnullation = await BulkProductOutGestor.GetTotalAmountAnnulationsByOrderProduct(Id)
        if (Amount < totalAmountBulkProduct - totalAnnullation ) {
            throw(`No se puede modificar la cantidad de la orden de producto a una cantidad menor al total de salida de producto a granel.`)
        }
        
        const today = DateTime.local()
        const product = await ProductGestor.GetByCode(OrderDocument, Code)

        const InterventionRecord: InterventionRecord = {
            CreationDate: oldOrderProduct.InterventionRecord.CreationDate, 
            CreatedBy: oldOrderProduct.InterventionRecord.CreatedBy, 
            ModificationDate: today, 
            ModifiedBy: User
        }
        
        const updateData = {
            Id: Id,
            ...product,
            Amount: Amount,
            ...InterventionRecordGestor.AdaptForUpdate(InterventionRecord)
        }
        
        await OrderProductDao.updateById(updateData)
        
    },

    async DeleteById(Id: number) {
        if (!await this.Exists(Id)) {
            throw(`El producto de orden ${Id} NO existe en la base de datos, no se puede eliminar.`)
        }
        const oldOrderProduct = await this.GetById(Id)
        const {OrderDocument, OrderNumber} = oldOrderProduct
        const order = await OrderGestor.GetByDocumentAndNumber(OrderDocument, OrderNumber)
        if (!order.Open) {
            throw(`No se puede eliminar el producto de orden, porque la orden ${OrderDocument + OrderNumber} esta cerrada.`)
        }
        if (order.Annulled) {
            throw(`No se puede eliminar el producto de orden, porque la orden ${OrderDocument + OrderNumber} esta anulada.`)
        }
        if (await OrderStateGestor.ValidateFinalState(order.OrderState)) {
            throw(`La orden ${order.OrderDocument} ${order.OrderNumber} actualmente esta en estado FINALIZADO en la base de datos. No se puede alterar. No es posible la modificación o alteración de la orden.`)
        }
        await OrderProductDao.deleteByCode(Id)
    },

    async Exists(Id: number) {
        const result = await OrderProductDao.getById(Id)
        if (result === undefined || result?.length < 1 ) {
            return false
        }
        return true
    },

    async ExistsByOrderAndProductCode(OrderDocument: string, OrderNumber: number, ProductCode: string) {
        const list = await this.ListByOrder(OrderDocument, OrderNumber)
        const exists = list.some((e) => {if (e.Product.Code.trimEnd() === ProductCode) {return true} else return })
        return exists
    },

    async GetByOrderAndProductCode(OrderDocument: string, OrderNumber: number, ProductCode: string) {
        const list = await this.ListByOrder(OrderDocument, OrderNumber)
        const product = list.find((e) => {if (e.Product.Code.trimEnd() === ProductCode) {return e} else return })
        if (product === undefined) throw(`No se pudo encontrar el producto con codigo ${ProductCode} y orden ${OrderDocument + OrderNumber}`)
        return product
    }
}
 

export default OrderProductGestor
export type {OrderProduct}