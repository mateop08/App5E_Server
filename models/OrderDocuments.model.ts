import OrderDocumentDao from "../dao/OrderDocuments.dao"
import OrderGestor from "./Orders.model"
import DocumentTypeGestor, { DocumentType } from "./DocumentTypes.model"
import { InterventionRecord, InterventionRecordGestor } from "./InterventionRecord.model"
import { DateTime } from "luxon"
import UserGestor from "./Users.model"
import OrderStateGestor from "./OrderStates.model"

interface OrderDocument {
    Id: number,
    OrderDocument: string,  
    OrderNumber: number, 
    DocumentType: DocumentType,
    InterventionRecord: InterventionRecord,
    FileName: string
}

const OrderDocumentGestor = {

    ConstructFromDao(data: any) {
        
        const orderProduct: OrderDocument = {
            Id: data.Id,
            OrderDocument: data.OrderDocument,  
            OrderNumber: data.OrderNumber, 
            DocumentType: DocumentTypeGestor.Construct(data.DocumentCode, data.Description),
            InterventionRecord: InterventionRecordGestor.ConstructFromDao(data.CreationDate, data.CreatedBy, data.ModificationDate, data.ModifiedBy),
            FileName: data.FileName
        }

        return orderProduct
    },


    AdaptToTransfer(orderDocument: OrderDocument) {
        const { InterventionRecord, DocumentType, ...Rest} = orderDocument
        const { CreationDate, ModificationDate, ...RestInteventionRecord } = InterventionRecord
        //console.log(CreationDate.toJSON())
        const transferObject = {
            InterventionRecord: {
                CreationDate: CreationDate.toJSON(),
                ModificationDate: (ModificationDate !== null) ? ModificationDate.toJSON() : null,
                ...RestInteventionRecord
            },
            DocumentCode: DocumentType.Code,
            Description: DocumentType.Description,
            ...Rest
        }
        return transferObject
    },

    async Create(OrderDocument: string, OrderNumber: number, DocumentCode: string, FileName: string, User: string) {
    
        const order = await OrderGestor.GetByDocumentAndNumber(OrderDocument, OrderNumber)
        if (!order.Open) {
            throw(`No se puede agregar un documento a la orden, porque la orden ${OrderDocument + OrderNumber} esta cerrada.`)
        }
        if (order.Annulled) {
            throw(`No se puede agregar un documento a la orden, porque la orden ${OrderDocument + OrderNumber} esta anulada.`)
        }
        if (await OrderStateGestor.ValidateFinalState(order.OrderState)) {
            throw(`La orden ${order.OrderDocument} ${order.OrderNumber} actualmente esta en estado FINALIZADO en la base de datos. No se puede alterar. No es posible la modificación o alteración de la orden.`)
        }
        const Document = await DocumentTypeGestor.GetByCode(DocumentCode)
        const today = DateTime.local()
        const orderDocument: OrderDocument = {
            Id: 0,
            OrderDocument: OrderDocument,  
            OrderNumber: OrderNumber, 
            DocumentType: DocumentTypeGestor.Construct(Document.Code, Document.Description),
            InterventionRecord: {
                CreationDate: today,
                CreatedBy: (await UserGestor.GetByUserCode(User)).UserCode,
                ModificationDate: null, 
                ModifiedBy: null, 
            },
            FileName: FileName
        }

        const {InterventionRecord, DocumentType, ...rest} = orderDocument
        const inserData = {
            DocumentCode: DocumentType.Code,
            Description: DocumentType.Description,
            ...rest,
            ...InterventionRecordGestor.AdaptToInsert(InterventionRecord)
        }
        await OrderDocumentDao.insert(inserData)
    },

    async ValidateAction(OrderDocument: string, OrderNumber: number) {
        const order = await OrderGestor.GetByDocumentAndNumber(OrderDocument, OrderNumber)
        if (!order.Open) {
            throw(`No se puede agregar un documento a la orden, porque la orden ${OrderDocument + OrderNumber} esta cerrada.`)
        }
        if (order.Annulled) {
            throw(`No se puede agregar un documento a la orden, porque la orden ${OrderDocument + OrderNumber} esta anulada.`)
        }
    },

    async ListByOrder(OrderDocument: string, OrderNumber: number) {
        const list = await OrderDocumentDao.listByOrder(OrderDocument, OrderNumber) as OrderDocument[]
        const documentList = list.map((e) => this.ConstructFromDao(e))
        const transferList = documentList.map((e) => this.AdaptToTransfer(e))
        return transferList 
    },

    async GetById(Id: number) {
        const data = await OrderDocumentDao.getById(Id)
        if (data === undefined) {
            throw('Error al obtener el objeto OrderDocument, se obtuvo un valor "undefined" al hacer la consulta en la base de datos. Funcion: documento.GetById')
        }
        if (data.length === 0) {
            throw(`Error al obtener el objeto OrderDocument, no existe un documento de orden con Id ${Id} en la base de datos.`)
        }
        if (data.length > 1) {
            throw(`Error al obtener el objeto OrderDocument, inconsistencia de datos: hay más de un documento de orden con Id ${Id} en la base de datos.`)
        }
        const orderDocument = this.ConstructFromDao(data[0])
        return orderDocument
    },

    async EditById(Id: number, DocumentCode: string, FileName: string, User: string) {
        const oldOrderDocument = await this.GetById(Id)
        const {OrderDocument, OrderNumber} = oldOrderDocument
        const order = await OrderGestor.GetByDocumentAndNumber(OrderDocument, OrderNumber)
        if (!order.Open) {
            throw(`No se puede modificar el documento de orden, porque la orden ${OrderDocument + OrderNumber} esta cerrada.`)
        }
        if (order.Annulled) {
            throw(`No se puede modificar el documento de orden, porque la orden ${OrderDocument + OrderNumber} esta anulada.`)
        }
        if (await OrderStateGestor.ValidateFinalState(order.OrderState)) {
            throw(`La orden ${order.OrderDocument} ${order.OrderNumber} actualmente esta en estado FINALIZADO en la base de datos. No se puede alterar. No es posible la modificación o alteración de la orden.`)
        }
        const Document = await DocumentTypeGestor.GetByCode(DocumentCode)
        
        const today = DateTime.local()

        const orderDocument: OrderDocument = {
            Id: Id,
            OrderDocument: OrderDocument,  
            OrderNumber: OrderNumber, 
            DocumentType: DocumentTypeGestor.Construct(Document.Code, Document.Description),
            InterventionRecord: {
                CreationDate: oldOrderDocument.InterventionRecord.CreationDate,
                CreatedBy: oldOrderDocument.InterventionRecord.CreatedBy,
                ModificationDate: today, 
                ModifiedBy: User, 
            },
            FileName: FileName
        }

        const {InterventionRecord, DocumentType, ...rest} = orderDocument
        const updateData = {
            DocumentCode: DocumentType.Code,
            Description: DocumentType.Description,
            ...rest,
            ...InterventionRecordGestor.AdaptForUpdate(InterventionRecord)
        }
        
        await OrderDocumentDao.updateById(updateData)
        
    },

    async DeleteById(Id: number) {
        if (!await this.Exists(Id)) {
            throw(`El documento de orden ${Id} NO existe en la base de datos, no se puede eliminar.`)
        }
        const oldOrderDocument = await this.GetById(Id)
        const {OrderDocument, OrderNumber} = oldOrderDocument
        const order = await OrderGestor.GetByDocumentAndNumber(OrderDocument, OrderNumber)
        if (!order.Open) {
            throw(`No se puede eliminar el documento de orden, porque la orden ${OrderDocument + OrderNumber} esta cerrada.`)
        }
        if (order.Annulled) {
            throw(`No se puede eliminar el documento de orden, porque la orden ${OrderDocument + OrderNumber} esta anulada.`)
        }
        if (await OrderStateGestor.ValidateFinalState(order.OrderState)) {
            throw(`La orden ${order.OrderDocument} ${order.OrderNumber} actualmente esta en estado FINALIZADO en la base de datos. No se puede alterar. No es posible la modificación o alteración de la orden.`)
        }
        await OrderDocumentDao.deleteByCode(Id)
    },

    async Exists(Id: number) {
        const result = await OrderDocumentDao.getById(Id)
        if (result === undefined || result?.length < 1 ) {
            return false
        }
        return true
    }
}
 

export default OrderDocumentGestor
export type {OrderDocument}