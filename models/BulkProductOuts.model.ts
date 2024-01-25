import BulkProductOutsDao from "../dao/BulkProductOuts.dao"
import { DateTime } from "luxon"
import UserGestor from "./Users.model"
import BulkProductOpeningGestor from "./BulkProductOpenings.model"
import OrderProductGestor from "./OrderProducts.model"
import OrderGestor from "./Orders.model"
import BulkProductOutAnnullationGestor from "./BulkProductOutAnnullations.model"
import ProductGestor from "./Products.model"
import OrderStateGestor from "./OrderStates.model"
interface BulkProductOut {
    OutId: number,
    OpeningId: number,
    ProductCode: string,  
    WithDigitalDispenser: boolean,
    InitialNumber: number | null,
    FinalNumber: number | null,
    Amount: number,
    ForServiceOrder: boolean,
    OrderProductId: number | null,
    RegistrationDate: DateTime,
    RegisteredBy: string,
    HasAnnullation: boolean
}

const BulkProductOutGestor = {

    async ConstructFromDao(data: any) {
        const bulkProductOut: BulkProductOut = {
            OutId: data.OutId,
            OpeningId: data.OpeningId,
            ProductCode: data.ProductCode,
            WithDigitalDispenser: data.WithDigitalDispenser,
            InitialNumber: data.InitialNumber,
            FinalNumber: data.FinalNumber,
            Amount: data.Amount,
            ForServiceOrder: data.ForServiceOrder,
            OrderProductId: data.OrderProductId,
            RegistrationDate: data.RegistrationDate,
            RegisteredBy: data.RegisteredBy,
            HasAnnullation: await BulkProductOutAnnullationGestor.ExistsByOutId(data.OutId)
        }

        return bulkProductOut
    },

    AdaptToTransfer(bulkProductOut: BulkProductOut) {
        const { RegistrationDate, ...rest} = bulkProductOut

        const transferObject = {
            RegistrationDate: RegistrationDate.toJSON(),
            ...rest
        }
        return transferObject
    },

    AdaptToInsert(bulkProductOut: BulkProductOut) {
        const { RegistrationDate, ...rest} = bulkProductOut
        const adaptRegistrationDate = RegistrationDate.toSQL()
        if (adaptRegistrationDate === null) throw ("Error al adaptar el campo RegistrationDate para insertar datos en la tabla BulkProductOut.")
        const adaptObject = { RegistrationDate: adaptRegistrationDate, ...rest}
        return adaptObject
    },

    AdaptForUpdate(bulkProductOut: BulkProductOut) {
        const { OutId, ...rest} = bulkProductOut
        if (OutId === null) throw("Error, no es posible actualizar los datos si el OutId es null.")

        const adaptObject = {
            OutId: OutId,
            ...rest
        }
        return adaptObject

    },

    async Create(createDate: {ProductCode: string, InitialNumber: number, FinalNumber: number, Amount: number, 
            WithDigitalDispenser: boolean, ForServiceOrder: boolean, OrderProductId: number, User: string}) {

        const { ProductCode, InitialNumber, FinalNumber, Amount, WithDigitalDispenser, 
            ForServiceOrder, OrderProductId, User } = createDate

        const product = ProductGestor.Construct(ProductCode, '', 0)

        if (!product.IsBulk) throw(`El producto ${ProductCode} no es un producto a granel, no se puede agregar una salida de producto a granel.`)

        const bpOpening = await BulkProductOpeningGestor.GetActive(ProductCode)
        if (!bpOpening.Active) throw(`No existe una apertura de producto a granel activa para el producto: ${ProductCode}`)
        
        if (ForServiceOrder) {
            if (OrderProductId === null) throw("Error para agregar una salida de producto a granel para una orden, el OrderProductId NO debe ser de tipo NULL.")
            
            const orderProduct = await OrderProductGestor.GetById(OrderProductId)
            const {OrderDocument, OrderNumber} = orderProduct
            const order = await OrderGestor.GetByDocumentAndNumber(OrderDocument, OrderNumber)
            if (order.Annulled) {
                throw(`No se puede agregar una salida de producto a granel, porque la orden ${OrderDocument + OrderNumber} esta anulada.`)
            }
            if (!order.Open) {
                throw(`No se puede agregar una salida de producto a granel, porque la orden ${OrderDocument + OrderNumber} esta cerrada.`)
            }
            if (await OrderStateGestor.ValidateFinalState(order.OrderState)) {
                throw(`La orden ${order.OrderDocument} ${order.OrderNumber} actualmente esta en estado FINALIZADO en la base de datos. No se puede alterar. No es posible la modificación o alteración de la orden.`)
            }
            if (orderProduct.Product.Code.trimEnd() !== ProductCode) throw("No se puede agregar una salida de producto a granel, el código de producto de orden es diferente  al registrado en la salida de aceite a granel.")
        } else {
            if (OrderProductId !== null) throw("Error para agregar una salida de producto a granel que no es para una orden, el OrderProductId debe ser de tipo NULL.")
        }

        if (!WithDigitalDispenser) {
            if (InitialNumber !== null) throw("Error para agregar una salida de producto a granel sin dispensador digital el número inicial debe ser de tipo NULL.")
            if (FinalNumber !== null) throw("Error para agregar una salida de producto a granel sin dispensador digital el número final debe ser de tipo NULL.")
            
        }
        if (WithDigitalDispenser) {
            if (InitialNumber === null) throw("Error para agregar una salida de producto a granel CON dispensador digital el número inicial NO debe ser de tipo NULL.")
            if (FinalNumber === null) throw("Error para agregar una salida de producto a granel CON dispensador digital el número final NO debe ser de tipo NULL.")
            
        }



        const today = DateTime.local()
        const bulkProductOut: BulkProductOut = {
            ProductCode: ProductCode,
            OutId: 0,
            OpeningId: bpOpening.OpeningId,
            Amount: Amount,
            InitialNumber: InitialNumber,
            FinalNumber: FinalNumber,
            ForServiceOrder: ForServiceOrder,
            WithDigitalDispenser: WithDigitalDispenser,
            OrderProductId: OrderProductId,
            RegisteredBy: (await UserGestor.GetByUserCode(User)).UserCode,
            RegistrationDate: today,
            HasAnnullation: false
            
        }
        const inserData = this.AdaptToInsert(bulkProductOut)
        await BulkProductOutsDao.insert(inserData)
    },

    async GetTotalAmountByOrderProduct(OrderProductId: number) {
        const list = await this.ListByOrderProduct(OrderProductId)
        const sumAmount = list.reduce((sum, e) => {
            return sum + e.Amount
        }, 0)
        return sumAmount
    },

    async GetTotalAmountAnnulationsByOrderProduct(OrderProductId: number) {
        const listOut = await this.ListByOrderProduct(OrderProductId)
        const sumAnnullationByOut = await Promise.all(listOut.map(async (e) => {
            const sumAnullation =  await BulkProductOutAnnullationGestor.TotalAmountAnnullationByOutId(e.OutId)
            return sumAnullation
        }))
        const total = sumAnnullationByOut.reduce((sum, num) => sum + num, 0)
        return total
    },

    async ListByOrderProduct(OrderProductId: number) {
        const data = await BulkProductOutsDao.listByOrderProductId(OrderProductId)
        if (!data) throw('Error al obtener el objeto BulkProductOut, se obtuvo un valor "undefined" al hacer la consulta en la base de datos. Funcion: BulkProductOut.ListByOrderProduct')
        const list = await Promise.all(data.map(async (e) => {return await this.ConstructFromDao(e)}))
        return list
    },

    async GetListByOrderProduct(OrderProductId: number) {
        const list = await this.ListByOrderProduct(OrderProductId)
        const transferObject =  list.map((e) => {this.AdaptToTransfer(e)})
        return transferObject
    },

    async ListByOpeningId(OpeningId: number) {
        const data = await BulkProductOutsDao.listByOpeningId(OpeningId)
        if (!data) throw('Error al obtener el objeto BulkProductOut, se obtuvo un valor "undefined" al hacer la consulta en la base de datos. Funcion: BulkProductOut.ListByOpeningId')
        const list = await Promise.all(data.map(async (e) => {return await this.ConstructFromDao(e)}))
        const transferObject =  list.map((e) => {this.AdaptToTransfer(e)})
        return transferObject
    },

    async GetByOutId(OutId: number) {
        const data = await BulkProductOutsDao.getById(OutId)
        if (data === undefined) {
            throw('Error al obtener el objeto BulkProductOut, se obtuvo un valor "undefined" al hacer la consulta en la base de datos. Funcion: BulkProductOut.GetByCode')
        }
        if (data.length === 0) {
            throw(`Error al obtener el objeto BulkProductOut, no existe una salida de producto a granel con Id ${OutId} en la base de datos.`)
        }
        if (data.length > 1) {
            throw(`Error al obtener el objeto BulkProductOut, inconsistencia de datos: hay más de una salida de producto a granel con Id ${OutId} en la base de datos.`)
        }
        const group = data[0] as BulkProductOut
        return group
    },

    async Exists(OutId: number) {
        const result = await BulkProductOutsDao.getById(OutId)
        if (result === undefined || result?.length < 1 ) {
            return false
        }
        return true
    }
}
 

export default BulkProductOutGestor
export type {BulkProductOut}