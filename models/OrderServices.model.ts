import OrderServiceDao from "../dao/OrderServices.dao"
import OrderGestor from "./Orders.model"
import ServiceGestor, { Service } from "./Services.model"
import TechnicianGestor, { Technician } from "./Technicians.model"
import { InterventionRecord, InterventionRecordGestor } from "./InterventionRecord.model"
import { DateTime } from "luxon"
import OrderStateGestor from "./OrderStates.model"

interface OrderService {
    Id: number
    OrderDocument: string,  
    OrderNumber: number, 
    Service: Service
    Amount: number,
    Technician: Technician
    Note: string,
    InterventionRecord: InterventionRecord
}

const OrderServiceGestor = {

    async ConstructFromDao(data: any) {
        
        const orderService: OrderService = {
            Id: data.Id,
            OrderDocument: data.OrderDocument,  
            OrderNumber: data.OrderNumber, 
            Service: ServiceGestor.Construct(data.Code, data.Description, data.Price),
            Technician: await TechnicianGestor.GetByCode(data.TechnicianCode),
            Amount: data.Amount,
            Note: data.Note,
            InterventionRecord: InterventionRecordGestor.ConstructFromDao(data.CreationDate, data.CreatedBy, data.ModificationDate, data.ModifiedBy)
        }

        return orderService
    },

    AdaptToTransfer(orderService: OrderService) {
        const { InterventionRecord, ...RestOrderService} = orderService
        //console.log(CreationDate.toJSON())
        
        const transferObject = {
            InterventionRecord: { ...InterventionRecordGestor.AdaptToTransfer(InterventionRecord) },
            ...RestOrderService
        }
        return transferObject
    },
    async Create(OrderDocument: string, OrderNumber: number, Code: string, Amount: number, TechnicianCode: string, Note: string, User: string) {
    
        const order = await OrderGestor.GetByDocumentAndNumber(OrderDocument, OrderNumber)
        if (!order.Open) {
            throw(`No se puede agregar un servicio a la orden, porque la orden ${OrderDocument + OrderNumber} esta cerrada.`)
        }
        if (order.Annulled) {
            throw(`No se puede agregar un servicio a la orden, porque la orden ${OrderDocument + OrderNumber} esta anulada.`)
        }
        if (await OrderStateGestor.ValidateFinalState(order.OrderState)) {
            throw(`La orden ${order.OrderDocument} ${order.OrderNumber} actualmente esta en estado FINALIZADO en la base de datos. No se puede alterar. No es posible la modificación o alteración de la orden.`)
        }
        if (Amount <= 0) {
            throw(`No es posible agregar el servicio ${Code} porque la cantidad definida es menor o igual a cero`)
        }
        const service = await ServiceGestor.GetByCode(OrderDocument, Code)
        const technician = await TechnicianGestor.GetByCode(TechnicianCode)
        const today = DateTime.local()

        const InterventionRecord: InterventionRecord = {
            CreationDate: today, 
            CreatedBy: User, 
            ModificationDate: null, 
            ModifiedBy: null
        }

        const insertData = {
            OrderDocument: OrderDocument,  
            OrderNumber: OrderNumber, 
            Code: service.Code, 
            Description: service.Description, 
            Price: service.Price, 
            Amount: Amount,
            TechnicianCode: technician.Code,
            Note: Note,
            ...InterventionRecordGestor.AdaptToInsert(InterventionRecord)
        }
        await OrderServiceDao.insert(insertData)
    },

    async ListByOrder(OrderDocument: string, OrderNumber: number) {
        const list = await OrderServiceDao.listByOrder(OrderDocument, OrderNumber) as OrderService[]
        const orderList = await Promise.all(list.map(async (e) => await this.ConstructFromDao(e)))
        return orderList
    },

    async ListTransferByOrder(OrderDocument: string, OrderNumber: number) {

        const orderList = await this.ListByOrder(OrderDocument, OrderNumber)
        const transferList = orderList.map((e) => this.AdaptToTransfer(e))
        return transferList 
    },

    async GetById(Id: number) {
        const data = await OrderServiceDao.getById(Id)
        if (data === undefined) {
            throw('Error al obtener el objeto OrderService, se obtuvo un valor "undefined" al hacer la consulta en la base de datos. Funcion: servicio.GetById')
        }
        if (data.length === 0) {
            throw(`Error al obtener el objeto OrderService, no existe un servicio de orden con Id ${Id} en la base de datos.`)
        }
        if (data.length > 1) {
            throw(`Error al obtener el objeto OrderService, inconsistencia de datos: hay más de un servicio de orden con Id ${Id} en la base de datos.`)
        }
        const OrderService = this.ConstructFromDao(data[0])
        return OrderService
    },

    async EditById(Id: number, Code: string, Amount: number,TechnicianCode: string, Note: string, User: string) {
        const oldOrderService = await this.GetById(Id)
        const {OrderDocument, OrderNumber} = oldOrderService
        const order = await OrderGestor.GetByDocumentAndNumber(OrderDocument, OrderNumber)

        if (!order.Open) {
            throw(`No se puede modificar el servicio de orden, porque la orden ${OrderDocument + OrderNumber} esta cerrada.`)
        }
        if (order.Annulled) {
            throw(`No se puede modificar el servicio de orden, porque la orden ${OrderDocument + OrderNumber} esta anulada.`)
        }
        if (await OrderStateGestor.ValidateFinalState(order.OrderState)) {
            throw(`La orden ${order.OrderDocument} ${order.OrderNumber} actualmente esta en estado FINALIZADO en la base de datos. No se puede alterar. No es posible la modificación o alteración de la orden.`)
        }

        const Service = await ServiceGestor.GetByCode(OrderDocument, Code)
        const technician = await TechnicianGestor.GetByCode(TechnicianCode)

        const today = DateTime.local()
        const InterventionRecord: InterventionRecord = {
            CreationDate: oldOrderService.InterventionRecord.CreationDate, 
            CreatedBy: oldOrderService.InterventionRecord.CreatedBy, 
            ModificationDate: today, 
            ModifiedBy: User
        }

        const updateData = {
            Id: Id,
            Code: Service.Code, 
            Description: Service.Description, 
            Price: Service.Price, 
            Amount: Amount,
            TechnicianCode: technician.Code,
            Note: Note,
            ...InterventionRecordGestor.AdaptForUpdate(InterventionRecord)
            
        }
        
        await OrderServiceDao.updateById(updateData)
        
    },

    async DeleteById(Id: number) {
        if (!await this.Exists(Id)) {
            throw(`El servicio de orden ${Id} NO existe en la base de datos, no se puede eliminar.`)
        }
        const oldOrderService = await this.GetById(Id)
        const {OrderDocument, OrderNumber} = oldOrderService
        const order = await OrderGestor.GetByDocumentAndNumber(OrderDocument, OrderNumber)
        if (!order.Open) {
            throw(`No se puede eliminar el servicio de orden, porque la orden ${OrderDocument + OrderNumber} esta cerrada.`)
        }
        if (order.Annulled) {
            throw(`No se puede eliminar el servicio de orden, porque la orden ${OrderDocument + OrderNumber} esta anulada.`)
        }
        if (await OrderStateGestor.ValidateFinalState(order.OrderState)) {
            throw(`La orden ${order.OrderDocument} ${order.OrderNumber} actualmente esta en estado FINALIZADO en la base de datos. No se puede alterar. No es posible la modificación o alteración de la orden.`)
        }
        await OrderServiceDao.deleteByCode(Id)
    },

    async Exists(Id: number) {
        const result = await OrderServiceDao.getById(Id)
        if (result === undefined || result?.length < 1 ) {
            return false
        }
        return true
    }
}
 

export default OrderServiceGestor
export type {OrderService}