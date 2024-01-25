import BulkProductOutAnnullationsDao from "../dao/BulkProductOutAnnullations.dao"
import { DateTime } from "luxon"
import UserGestor from "./Users.model"
import BulkProductOpeningGestor from "./BulkProductOpenings.model"
import OrderProductGestor from "./OrderProducts.model"
import OrderGestor from "./Orders.model"
import BulkProductOutGestor from "./BulkProductOuts.model"
import ProductGestor from "./Products.model"
import OrderStateGestor from "./OrderStates.model"

interface BulkProductOutAnnullation {
    AnnullationId: number,
    OutId: number,
    ProductCode: string,
    Amount: number,
    RegistrationDate: DateTime,
    RegisteredBy: string,
    AnnulledReason: string
}

const BulkProductOutAnnullationGestor = {

    ConstructFromDao(data: any) {
        const bulkProductOutAnnullation: BulkProductOutAnnullation = {
            AnnullationId: data.AnnullationId,
            OutId: data.OutId,
            ProductCode: data.ProductCode,
            Amount: data.Amount,
            RegistrationDate: data.RegistrationDate,
            RegisteredBy: data.RegisteredBy,
            AnnulledReason: data.AnnulledReason
        }

        return bulkProductOutAnnullation
    },

    AdaptToTransfer(bulkProductOutAnnullation: BulkProductOutAnnullation) {
        const { RegistrationDate, ...rest} = bulkProductOutAnnullation

        const transferObject = {
            RegistrationDate: RegistrationDate.toJSON(),
            ...rest
        }
        return transferObject
    },

    AdaptToInsert(bulkProductOutAnnullation: BulkProductOutAnnullation) {
        const { RegistrationDate, ...rest} = bulkProductOutAnnullation
        const adaptRegistrationDate = RegistrationDate.toSQL()
        if (adaptRegistrationDate === null) throw ("Error al adaptar el campo RegistrationDate para insertar datos en la tabla BulkProductOutAnnullation.")
        const adaptObject = { RegistrationDate: adaptRegistrationDate, ...rest}
        return adaptObject
    },

    AdaptForUpdate(bulkProductOutAnnullation: BulkProductOutAnnullation) {
        const { OutId, ...rest} = bulkProductOutAnnullation
        if (OutId === null) throw("Error, no es posible actualizar los datos si el OutId es null.")

        const adaptObject = {
            OutId: OutId,
            ...rest
        }
        return adaptObject
    },

    async Create(ProductCode: string, Amount: number, OutId: number, AnnulledReason: string, User: string) {

        const product = ProductGestor.Construct(ProductCode, '', 0)
        if (!product.IsBulk) throw(`El producto ${ProductCode} no es un producto a granel, no se puede agregar a una anulación de salida de producto a granel.`)
        
        const bpOut = await BulkProductOutGestor.GetByOutId(OutId)
        const bpOpening = await BulkProductOpeningGestor.GetByOpeningId(bpOut.OpeningId)
        const {ForServiceOrder} = bpOut

        if (ProductCode !== bpOut.ProductCode) throw(`No se puede anular una salida de producto a granel, porque el producto registrado para la anulación ${ProductCode} es diferente al registrado en la salida de producto a granel`)
        if (!bpOpening.Active) throw(`No existe una apertura de producto a granel activa para el producto: ${ProductCode}`)
    
        if (ForServiceOrder) {
            const orderProduct = await OrderProductGestor.GetById(Number(bpOut.OrderProductId))
            const {OrderDocument, OrderNumber} = orderProduct
            const order = await OrderGestor.GetByDocumentAndNumber(OrderDocument, OrderNumber)
            if (order.Annulled) {
                throw(`No se puede anular una salida de producto a granel, porque la orden ${OrderDocument + OrderNumber} esta anulada.`)
            }
            if (!order.Open) {
                throw(`No se puede anular una salida de producto a granel, porque la orden ${OrderDocument + OrderNumber} esta cerrada.`)
            }
            if (await OrderStateGestor.ValidateFinalState(order.OrderState)) {
                throw(`La orden ${order.OrderDocument} ${order.OrderNumber} actualmente esta en estado FINALIZADO en la base de datos. No se puede alterar. No es posible la modificación o alteración de la orden.`)
            }
            
        }
        const sumAmountAnnullation = await this.TotalAmountAnnullationByOutId(OutId)
        if (sumAmountAnnullation + Amount > bpOut.Amount) {
            throw(`No se puede anular una salida de producto a granel con una cantidad mayor a la salida de producto a granel.`)
        }

        const today = DateTime.local()
        const bulkProductOutAnnullation: BulkProductOutAnnullation = {
            AnnullationId: 0,
            ProductCode: ProductCode,
            Amount: Amount,
            OutId: OutId,
            RegisteredBy: (await UserGestor.GetByUserCode(User)).UserCode,
            RegistrationDate: today,
            AnnulledReason: AnnulledReason
            
        }
        const inserData = this.AdaptToInsert(bulkProductOutAnnullation)
        await BulkProductOutAnnullationsDao.insert(inserData)
    },

    async TotalAmountAnnullationByOutId(OutId: number) {
        const annullationList = await this.ListByOutId(OutId)
        const sumAmountAnnullation: number = annullationList.reduce((sum: number, e) => {
            return sum + e.Amount
        }, 0)
        return sumAmountAnnullation
    },

    async ListByOutId(OutId: number) {
        const data = await BulkProductOutAnnullationsDao.listByOutId(OutId)
        if (!data) throw('Error al obtener el objeto BulkProductOutAnnullation, se obtuvo un valor "undefined" al hacer la consulta en la base de datos. Funcion: BulkProductOutAnnullation.ListByOutId')
        const list = data.map((e) => {return this.ConstructFromDao(e)})
        return list
        
    },

    async GetTransferListByOutId(OutId: number) {
        const list = await this.ListByOutId(OutId)
        const transferObject = list.map((e) => {return this.AdaptToTransfer(e)})
        return transferObject
    },

    async GetByAnullationId(AnnullationId: number) {
        const data = await BulkProductOutAnnullationsDao.getByAnnulationId(AnnullationId)
        if (data === undefined) {
            throw('Error al obtener el objeto BulkProductOutAnnullation, se obtuvo un valor "undefined" al hacer la consulta en la base de datos. Funcion: BulkProductOutAnnullation.GetByAnullationId')
        }
        if (data.length === 0) {
            throw(`Error al obtener el objeto BulkProductOutAnnullation, no existe una anulación de salida de producto a granel con Id ${AnnullationId} en la base de datos.`)
        }
        if (data.length > 1) {
            throw(`Error al obtener el objeto BulkProductOutAnnullation, inconsistencia de datos: hay más de una anulación de salida de producto a granel con Id ${AnnullationId} en la base de datos.`)
        }
        const adaptBulkProductOutAnnullation = this.ConstructFromDao(data[0])
        return adaptBulkProductOutAnnullation
    },

    async GetTransferByAnnullationId(AnnullationId: number) {
        const bulkProductOutAnnullation = await this.GetByAnullationId(AnnullationId)
        const transferObject = this.AdaptToTransfer(bulkProductOutAnnullation)
        return transferObject
    },

    async ExistsByOutId(OutId: number) {
        const result = await BulkProductOutAnnullationsDao.listByOutId(OutId)
        if (result === undefined || result?.length < 1 ) {
            return false
        }
        return true
    }
}
 

export default BulkProductOutAnnullationGestor
export type {BulkProductOutAnnullation}