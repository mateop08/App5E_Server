import OrderAnnotationsDao from "../dao/OrderAnnotations.dao"
import OrderGestor from "./Orders.model"
import AnnotationTypeGestor, { AnnotationType } from "./AnnotationTypes.model"
import TechnicianGestor, { Technician } from "./Technicians.model"
import { InterventionRecord, InterventionRecordGestor } from "./InterventionRecord.model"
import { DateTime } from "luxon"
import UserGestor from "./Users.model"
import OrderStateGestor from "./OrderStates.model"

interface OrderAnnotation {
    Id: number,
    OrderDocument: string,  
    OrderNumber: number, 
    AnnotationType: AnnotationType,
    Technician: Technician, 
    Note: string,
    InterventionRecord: InterventionRecord
}

const OrderAnnotationGestor = {

    async ConstructFromDao(data: any) {
        
        const orderAnnotation: OrderAnnotation = {
            Id: data.Id,
            OrderDocument: data.OrderDocument,  
            OrderNumber: data.OrderNumber,
            Technician: await TechnicianGestor.GetByCode(data.TechnicianCode),
            AnnotationType: await AnnotationTypeGestor.GetByCode(data.AnnotationCode),
            Note: data.Note,
            InterventionRecord: InterventionRecordGestor.ConstructFromDao(data.CreationDate, data.CreatedBy, data.ModificationDate, data.ModifiedBy)
        }

        return orderAnnotation
    },


    AdaptToTransfer(orderDocument: OrderAnnotation) {
        const { InterventionRecord, AnnotationType, ...Rest} = orderDocument
        const { CreationDate, ModificationDate, ...RestInteventionRecord } = InterventionRecord
        //console.log(CreationDate.toJSON())
        const transferObject = {
            InterventionRecord: {
                CreationDate: CreationDate.toJSON(),
                ModificationDate: (ModificationDate !== null) ? ModificationDate.toJSON() : null,
                ...RestInteventionRecord
            },
            AnnotationType: AnnotationType,
            ...Rest
        }
        //console.log(transferObject)
        return transferObject
    },

    async Create(OrderDocument: string, OrderNumber: number, AnnotationCode: string, TechnicianCode: string, Note: string, User: string) {
    
        const order = await OrderGestor.GetByDocumentAndNumber(OrderDocument, OrderNumber)
        if (!order.Open) {
            throw(`No se puede agregar un anotacion a la orden, porque la orden ${OrderDocument + OrderNumber} esta cerrada.`)
        }
        if (order.Annulled) {
            throw(`No se puede agregar un anotacion a la orden, porque la orden ${OrderDocument + OrderNumber} esta anulada.`)
        }
        if (await OrderStateGestor.ValidateFinalState(order.OrderState)) {
            throw(`La orden ${order.OrderDocument} ${order.OrderNumber} actualmente esta en estado FINALIZADO en la base de datos. No se puede alterar. No es posible la modificación o alteración de la orden.`)
        }

        const today = DateTime.local()
        const orderAnnotation: OrderAnnotation = {
            Id: 0,
            OrderDocument: OrderDocument,  
            OrderNumber: OrderNumber, 
            AnnotationType: await AnnotationTypeGestor.GetByCode(AnnotationCode),
            Technician: await TechnicianGestor.GetByCode(TechnicianCode),
            Note: Note,
            InterventionRecord: {
                CreationDate: today,
                CreatedBy: (await UserGestor.GetByUserCode(User)).UserCode,
                ModificationDate: null, 
                ModifiedBy: null, 
            }
        }

        const {InterventionRecord, AnnotationType, Technician,...rest} = orderAnnotation
        const inserData = {
            AnnotationCode: AnnotationType.Code,
            Description: AnnotationType.Description,
            TechnicianCode: Technician.Code,
            ...rest,
            ...InterventionRecordGestor.AdaptToInsert(InterventionRecord)
        }
        await OrderAnnotationsDao.insert(inserData)
    },

    async ListByOrder(OrderDocument: string, OrderNumber: number) {
        const data = await OrderAnnotationsDao.listByOrder(OrderDocument, OrderNumber)
        if (data === undefined) {
            throw('Error al obtener el objeto OrderAnnotation, se obtuvo un valor "undefined" al hacer la consulta en la base de datos. Funcion: OrderAnnotation.GetById')
        }
        const annotationList = await Promise.all(data.map(async (e) => await this.ConstructFromDao(e)))
        const transObject = annotationList.map((e) => this.AdaptToTransfer(e))
        return transObject 
    },

    async GetById(Id: number) {
        const data = await OrderAnnotationsDao.getById(Id)
        if (data === undefined) {
            throw('Error al obtener el objeto OrderAnnotation, se obtuvo un valor "undefined" al hacer la consulta en la base de datos. Funcion: anotacion.GetById')
        }
        if (data.length === 0) {
            throw(`Error al obtener el objeto OrderAnnotation, no existe un anotacion de orden con Id ${Id} en la base de datos.`)
        }
        if (data.length > 1) {
            throw(`Error al obtener el objeto OrderAnnotation, inconsistencia de datos: hay más de un anotacion de orden con Id ${Id} en la base de datos.`)
        }
        const orderAnnotation = this.ConstructFromDao(data[0])  
        return orderAnnotation
    },

    async EditById(Id: number, AnnotationCode: string, TechnicianCode: string, Note: string, User: string) {
        const oldOrderDocument = await this.GetById(Id)
        const {OrderDocument, OrderNumber} = oldOrderDocument
        const order = await OrderGestor.GetByDocumentAndNumber(OrderDocument, OrderNumber)
        if (!order.Open) {
            throw(`No se puede modificar el anotacion de orden, porque la orden ${OrderDocument + OrderNumber} esta cerrada.`)
        }
        if (order.Annulled) {
            throw(`No se puede modificar el anotacion de orden, porque la orden ${OrderDocument + OrderNumber} esta anulada.`)
        }
        if (await OrderStateGestor.ValidateFinalState(order.OrderState)) {
            throw(`La orden ${order.OrderDocument} ${order.OrderNumber} actualmente esta en estado FINALIZADO en la base de datos. No se puede alterar. No es posible la modificación o alteración de la orden.`)
        }
        const today = DateTime.local()

        const orderAnnotation: OrderAnnotation = {
            Id: Id,
            OrderDocument: OrderDocument,  
            OrderNumber: OrderNumber, 
            AnnotationType: await AnnotationTypeGestor.GetByCode(AnnotationCode),
            Technician: await TechnicianGestor.GetByCode(TechnicianCode),
            Note: Note,
            InterventionRecord: {
                CreationDate: oldOrderDocument.InterventionRecord.CreationDate,
                CreatedBy: oldOrderDocument.InterventionRecord.CreatedBy,
                ModificationDate: today, 
                ModifiedBy: User, 
            }
        }

        const {InterventionRecord, AnnotationType, Technician, ...rest} = orderAnnotation
        const updateData = {
            AnnotationCode: AnnotationType.Code,
            Description: AnnotationType.Description,
            TechnicianCode: Technician.Code,
            ...rest,
            ...InterventionRecordGestor.AdaptForUpdate(InterventionRecord)
        }
        
        await OrderAnnotationsDao.updateById(updateData)
        
    },

    async DeleteById(Id: number) {
        if (!await this.Exists(Id)) {
            throw(`El anotacion de orden ${Id} NO existe en la base de datos, no se puede eliminar.`)
        }
        const oldOrderDocument = await this.GetById(Id)
        const {OrderDocument, OrderNumber} = oldOrderDocument
        const order = await OrderGestor.GetByDocumentAndNumber(OrderDocument, OrderNumber)
        if (!order.Open) {
            throw(`No se puede eliminar el anotacion de orden, porque la orden ${OrderDocument + OrderNumber} esta cerrada.`)
        }
        if (order.Annulled) {
            throw(`No se puede eliminar el anotacion de orden, porque la orden ${OrderDocument + OrderNumber} esta anulada.`)
        }
        if (await OrderStateGestor.ValidateFinalState(order.OrderState)) {
            throw(`La orden ${order.OrderDocument} ${order.OrderNumber} actualmente esta en estado FINALIZADO en la base de datos. No se puede alterar. No es posible la modificación o alteración de la orden.`)
        }
        await OrderAnnotationsDao.deleteByCode(Id)
    },

    async Exists(Id: number) {
        const result = await OrderAnnotationsDao.getById(Id)
        if (result === undefined || result?.length < 1 ) {
            return false
        }
        return true
    }
}
 

export default OrderAnnotationGestor
export type {OrderAnnotation}