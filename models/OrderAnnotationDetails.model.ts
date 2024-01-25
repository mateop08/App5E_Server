import OrderAnnotationDetailDao from "../dao/OrderAnnotationDetails.dao"
import OrderGestor from "./Orders.model"
import { InterventionRecord, InterventionRecordGestor } from "./InterventionRecord.model"
import { DateTime } from "luxon"
import UserGestor from "./Users.model"
import OrderAnnotationGestor from "./OrderAnnotations.model"
import OrderStateGestor from "./OrderStates.model"

interface OrderAnnotationDetail {
    EvidenceId: number,
    AnnotationId: number,
    InterventionRecord: InterventionRecord,
    FileName: string,
    Note: string,
}

const OrderAnnotationDetailGestor = {

    ConstructFromDao(data: any) {
        
        const orderProduct: OrderAnnotationDetail = {
            EvidenceId: data.EvidenceId,
            AnnotationId: data.AnnotationId,
            InterventionRecord: InterventionRecordGestor.ConstructFromDao(data.CreationDate, data.CreatedBy, data.ModificationDate, data.ModifiedBy),
            FileName: data.FileName,
            Note: data.Note
        }

        return orderProduct
    },


    AdaptToTransfer(orderDocument: OrderAnnotationDetail) {
        const { InterventionRecord, ...Rest} = orderDocument
        const { CreationDate, ModificationDate, ...RestInteventionRecord } = InterventionRecord
        //console.log(CreationDate.toJSON())
        const transferObject = {
            InterventionRecord: {
                CreationDate: CreationDate.toJSON(),
                ModificationDate: (ModificationDate !== null) ? ModificationDate.toJSON() : null,
                ...RestInteventionRecord
            },
            ...Rest
        }
        return transferObject
    },

    async Create(AnnotationId: number, Note: string, FileName: string, User: string) {
        
        const orderAnnotation = await OrderAnnotationGestor.GetById(AnnotationId)
        const {OrderDocument, OrderNumber} = orderAnnotation
        const order = await OrderGestor.GetByDocumentAndNumber(OrderDocument, OrderNumber)

        if (!order.Open) {
            throw(`No se puede agregar una evidencia a la orden, porque la orden ${OrderDocument + OrderNumber} esta cerrada.`)
        }
        if (order.Annulled) {
            throw(`No se puede agregar un evidencia a la orden, porque la orden ${OrderDocument + OrderNumber} esta anulada.`)
        }
        if (await OrderStateGestor.ValidateFinalState(order.OrderState)) {
            throw(`La orden ${order.OrderDocument} ${order.OrderNumber} actualmente esta en estado FINALIZADO en la base de datos. No se puede alterar. No es posible la modificación o alteración de la orden.`)
        }

        const today = DateTime.local()
        const orderAnnotationDetail: OrderAnnotationDetail = {
            EvidenceId: 0,
            AnnotationId: AnnotationId,
            FileName: FileName,
            Note: Note,
            InterventionRecord: {
                CreationDate: today,
                CreatedBy: (await UserGestor.GetByUserCode(User)).UserCode,
                ModificationDate: null, 
                ModifiedBy: null, 
            }
        }

        const {InterventionRecord, ...rest} = orderAnnotationDetail
        const inserData = {
            ...rest,
            ...InterventionRecordGestor.AdaptToInsert(InterventionRecord)
        }
        await OrderAnnotationDetailDao.insert(inserData)
    },

    async ValidateAction(AnnotationId: number) {
        const orderAnnotation = await OrderAnnotationGestor.GetById(AnnotationId)
        const {OrderDocument, OrderNumber} = orderAnnotation
        const order = await OrderGestor.GetByDocumentAndNumber(OrderDocument, OrderNumber)

        if (!order.Open) {
            throw(`No se puede agregar una evidencia a la orden, porque la orden ${OrderDocument + OrderNumber} esta cerrada.`)
        }
        if (order.Annulled) {
            throw(`No se puede agregar un evidencia a la orden, porque la orden ${OrderDocument + OrderNumber} esta anulada.`)
        }
    },

    async ListByAnnotationId(AnnotationId: number) {
        const data = await OrderAnnotationDetailDao.listByAnnotationId(AnnotationId)
        if (data === undefined) {
            throw('Error al obtener el objeto OrderAnnotationDetail, se obtuvo un valor "undefined" al hacer la consulta en la base de datos. Funcion: OrderAnnotationDetail.ListByAnnotationId')
        }
        const orderAnnotationDetailList = data.map((e) => this.ConstructFromDao(e))
        const transferList = orderAnnotationDetailList.map((e) => this.AdaptToTransfer(e))
        return transferList 
    },

    async GetByEvidenceId(EvidenceId: number) {
        const data = await OrderAnnotationDetailDao.getById(EvidenceId)
        if (data === undefined) {
            throw('Error al obtener el objeto OrderAnnotationDetail, se obtuvo un valor "undefined" al hacer la consulta en la base de datos. Funcion: documento.GetByEvidenceId')
        }
        if (data.length === 0) {
            throw(`Error al obtener el objeto OrderAnnotationDetail, no existe un documento de orden con EvidenceId ${EvidenceId} en la base de datos.`)
        }
        if (data.length > 1) {
            throw(`Error al obtener el objeto OrderAnnotationDetail, inconsistencia de datos: hay más de un documento de orden con EvidenceId ${EvidenceId} en la base de datos.`)
        }
        const orderDocument = this.ConstructFromDao(data[0])
        return orderDocument
    },

    async EditByEvidenceId(EvidenceId: number, Note: string, FileName: string, User: string) {

        const oldOrderAnnotationDetail = await this.GetByEvidenceId(EvidenceId)
        const orderAnnotation = await OrderAnnotationGestor.GetById(oldOrderAnnotationDetail.AnnotationId)
        const {OrderDocument, OrderNumber} = orderAnnotation
        const order = await OrderGestor.GetByDocumentAndNumber(OrderDocument, OrderNumber)

        if (!order.Open) {
            throw(`No se puede agregar una evidencia a la orden, porque la orden ${OrderDocument + OrderNumber} esta cerrada.`)
        }
        if (order.Annulled) {
            throw(`No se puede agregar un evidencia a la orden, porque la orden ${OrderDocument + OrderNumber} esta anulada.`)
        }
        if (await OrderStateGestor.ValidateFinalState(order.OrderState)) {
            throw(`La orden ${order.OrderDocument} ${order.OrderNumber} actualmente esta en estado FINALIZADO en la base de datos. No se puede alterar. No es posible la modificación o alteración de la orden.`)
        }
        const today = DateTime.local()

        const orderDocument: OrderAnnotationDetail = {
            EvidenceId: EvidenceId,
            AnnotationId: oldOrderAnnotationDetail.AnnotationId,
            FileName: FileName,
            Note: Note,
            InterventionRecord: {
                CreationDate: oldOrderAnnotationDetail.InterventionRecord.CreationDate,
                CreatedBy: oldOrderAnnotationDetail.InterventionRecord.CreatedBy,
                ModificationDate: today, 
                ModifiedBy: User, 
            }
        }

        const {InterventionRecord, ...rest} = orderDocument
        const updateData = {
            ...rest,
            ...InterventionRecordGestor.AdaptForUpdate(InterventionRecord)
        }
        
        await OrderAnnotationDetailDao.updateById(updateData)
        
    },

    async DeleteByEvidenceId(EvidenceId: number) {
        if (!await this.Exists(EvidenceId)) {
            throw(`La evidencia ${EvidenceId} NO existe en la base de datos, no se puede eliminar.`)
        }
        const orderAnnotationDetail = await this.GetByEvidenceId(EvidenceId)
        const orderAnnotation = await OrderAnnotationGestor.GetById(orderAnnotationDetail.AnnotationId)
        const {OrderDocument, OrderNumber} = orderAnnotation
        const order = await OrderGestor.GetByDocumentAndNumber(OrderDocument, OrderNumber)

        if (!order.Open) {
            throw(`No se puede agregar una evidencia a la orden, porque la orden ${OrderDocument + OrderNumber} esta cerrada.`)
        }
        if (order.Annulled) {
            throw(`No se puede agregar un evidencia a la orden, porque la orden ${OrderDocument + OrderNumber} esta anulada.`)
        }
        if (await OrderStateGestor.ValidateFinalState(order.OrderState)) {
            throw(`La orden ${order.OrderDocument} ${order.OrderNumber} actualmente esta en estado FINALIZADO en la base de datos. No se puede alterar. No es posible la modificación o alteración de la orden.`)
        }
        await OrderAnnotationDetailDao.deleteByCode(EvidenceId)
    },

    async Exists(EvidenceId: number) {
        const result = await OrderAnnotationDetailDao.getById(EvidenceId)
        if (result === undefined || result?.length < 1 ) {
            return false
        }
        return true
    }
}
 

export default OrderAnnotationDetailGestor
export type {OrderAnnotationDetail}