import OrderDao from "../dao/Orders.dao"
import AppDocumentGestor from "./AppDocuments.model"
import ContactGestor, { Contact } from "./Contacts.model"
import OrderStateGestor, { OrderState } from "./OrderStates.model"
import UserAppDocumentGestor, { UserAppDocument } from "./UserAppDocuments.model"
import UserGestor from "./Users.model"
import VehicleContactGestor, { VehicleContact } from "./VehicleContacts.model"
import VehicleMembershipGestor from "./VehicleMemberships.model"
import VehicleGestor, { Vehicle } from "./Vehicles.model"
import { InterventionRecord } from "./InterventionRecord.model"
import { DateTime } from "luxon"

interface Order {
    OrderDocument: string,
    OrderNumber: number, 
    CardNumber: number,
    Vehicle: Vehicle,
    Contact: Contact,
    Mileage: number,
    ReceptionIndicators: ReceptionIndicators,
    InterventionRecord: InterventionRecord,
    Open: boolean,
    OrderState: OrderState, 
    Annulled: boolean,
    AnnulledBy: string | null,
    AnnulledReason?: string | null,
    ReceptionNote: string
}

export interface ReceptionIndicators {
    Diagnosis: boolean,
    Lubrication: boolean,
    Mechanics: boolean,
    Powertrain: boolean,
    Warranty: boolean,
    Quote: boolean,
}

const OrderGestor = {

    async ConstructOrderFromDao(data: any) {
        
        const Contact = await ContactGestor.GetByIdentification(data.ContactId)
        Contact.FullName = data.ContactName
        Contact.ContactNumber = data.ContactNumber
        
        const Vehicle = await VehicleGestor.GetByPlate(data.Plate)
        Vehicle.Description = data.VehicleDescription

        const order: Order = {
            OrderDocument: data.OrderDocument,
            OrderNumber: data.OrderNumber, 
            Vehicle: Vehicle,
            Contact: Contact,
            Mileage: data.Mileage,
            ReceptionIndicators: {
                Quote: data.Quote, 
                Diagnosis: data.Diagnosis, 
                Warranty: data.Warranty,
                Lubrication: data.Lubrication, 
                Mechanics: data.Mechanics, 
                Powertrain: data.Powertrain,
            },
            InterventionRecord: {
                CreationDate: DateTime.fromJSDate(new Date(data.CreationDate)),
                ModificationDate: data.ModificationDate !== null ? DateTime.fromJSDate(new Date(data.ModificationDate)) : null,
                CreatedBy: data.CreatedBy,
                ModifiedBy: data.ModifiedBy !== null ? (await UserGestor.GetByUserCode(data.ModifiedBy)).UserCode : null,
            },
            Open: data.Open,
            OrderState: await OrderStateGestor.GetByCode(data.State),
            CardNumber: data.CardNumber,
            Annulled: data.Annulled,
            AnnulledBy: data.AnnulledBy,
            AnnulledReason: data.AnnulledReason,
            ReceptionNote: data.ReceptionNote
        }
        return order
    },

    AdaptToTransfer(Order: Order) {
        const { InterventionRecord, ...RestOrder} = Order
        const { CreationDate, ModificationDate, ...RestInteventionRecord } = InterventionRecord
        //console.log(CreationDate.toJSON())
        const transferObject = {
            InterventionRecord: {
                CreationDate: CreationDate.toJSON(),
                ModificationDate: (ModificationDate !== null) ? ModificationDate.toJSON() : null,
                ...RestInteventionRecord
            },
            ...RestOrder
        }
        return transferObject
    },

    async Create(data: {OrderDocument: string, User: string, Plate: string, ContactId: string, CardNumber: number,
        Mileage: number, Quote: boolean, Diagnosis: boolean, Warranty: boolean, Lubrication: boolean, 
        Mechanics: boolean, Powertrain: boolean, ReceptionNote: string}) {
            
        const {OrderDocument, User, Plate, ContactId, CardNumber, 
            Mileage, Quote, Diagnosis, Warranty, Lubrication, Mechanics, Powertrain, ReceptionNote} = data

        //Order state validation
        const defaultState = await OrderStateGestor.GetDefault()

        //Vehicle membership validation
        if (CardNumber !== 0 ) {
            const membership = await VehicleMembershipGestor.GeyByCardNumber(CardNumber)
            if (membership.Plate !== Plate){
                throw(`La membresía ${CardNumber}, no pertenece al vehículo ${Plate}, no se puede recepcionar el vehículo con esta membresía.`)
            }
            if (!membership.Active) {
                throw(`La membresía ${CardNumber}, se encuentra actualmente INACTIVA, no se puede recepcionar el vehículo con esta membresía.`)
            }
        }
        
        const today = DateTime.local()
        
        const order: Order = {
            OrderDocument: OrderDocument,
            OrderNumber: await AppDocumentGestor.GetNewNumber(OrderDocument),
            Vehicle: await VehicleGestor.GetByPlate(Plate),
            Contact: await ContactGestor.GetByIdentification(ContactId),
            CardNumber: CardNumber,
            Mileage: Mileage,
            ReceptionIndicators: {
                Quote: Quote, 
                Diagnosis: Diagnosis, 
                Warranty: Warranty, 
                Lubrication: Lubrication, 
                Mechanics: Mechanics, 
                Powertrain: Powertrain,
            },
            InterventionRecord: {
                CreationDate: today,
                CreatedBy: (await UserGestor.GetByUserCode(User)).UserCode,
                ModificationDate: null, 
                ModifiedBy: null, 
            },
            OrderState: defaultState,
            Open: true,
            Annulled: false,
            AnnulledBy: null,
            AnnulledReason: null,
            ReceptionNote: ReceptionNote
        }
        
        //UserAppDocuments
        const userAppDocument: UserAppDocument = {UserCode: User, DocumentCode: OrderDocument}
        if (!await UserAppDocumentGestor.Exists(userAppDocument)) {
            throw(`No se puede crear la orden, el usuario ${User} no tiene asignado el documento de aplicación ${OrderDocument}.`)
        }


        //Orders validation
        if (await this.Exists(order.OrderDocument, order.OrderNumber)) {
            throw(`La orden ${order.OrderDocument} ${order.OrderNumber} ya existe en la base de datos, no se puede volver a crear.`)
        }
        if (await this.ExistsOpenOrderByPlate(Plate)) {
            throw(`Existe una orden abierta para el vehículo ${Plate} en la base de datos, no se puede crear una nueva orden.`)
        }
        
        //Vehicle contact validation
        const vehicleContact: VehicleContact = {
            ContactId: ContactId,
            VehiclePlate: Plate
        }
        if (!await VehicleContactGestor.Exists(vehicleContact)) {
            throw(`No es posible crear una orden para el vehículo ${Plate}, debido a que el contacto ${ContactId} no esta asignado a la placa.`)
        }

        const { Vehicle, Contact, ReceptionIndicators, InterventionRecord, OrderState, ...restOrder} = order
        const { CreationDate, ModificationDate, ...RestInterventionRecord } = InterventionRecord
        
        const insertData = {
            Plate: Vehicle.Plate,
            VehicleDescription: Vehicle.Description,
            PlateType: Vehicle.PlateType,
            ContactId: Contact.Identification,
            ContactName: Contact.FullName,
            ContactNumber: Contact.ContactNumber,
            CreationDate: CreationDate.toSQL(),
            ModificationDate: ModificationDate === null ? null : ModificationDate?.toSQL(),
            State: OrderState.Code,
            ...ReceptionIndicators,
            ...restOrder,
            ...RestInterventionRecord
        }
        await OrderDao.insert(insertData)
        AppDocumentGestor.SetNewNumber(OrderDocument)
        
        return order.OrderDocument + ' ' + order.OrderNumber
    },

    async ListOpenOrdersByOrderDocument(OrderDocument: string) {
        if (!await AppDocumentGestor.Exists(OrderDocument)) {
            throw(`El documento de aplicación ${OrderDocument} no existe en la base de datos.`)
        }
        const list = await OrderDao.listOpenOrdersByOrderDocument(OrderDocument)
        if (list === undefined) throw("Error al ejecutar el query para obtener el listado de ordenes abiertas")
        const orderList: Order[] = await Promise.all(list.map( async (o) =>{
            return await this.ConstructOrderFromDao(o)
        }))
        const transferList = orderList.map((order) => this.AdaptToTransfer(order))
        return transferList
    },

    async ListByFilters(data: {OrderDocument: string, PlateSearch: string, Lubrication: boolean, Mechanics: boolean, Powertrain: boolean,  
        Quote: boolean, Diagnosis: boolean, Warranty: boolean, OpenSearch: boolean | null, StateSearch: string | null,
        InitialDate: string | null, FinalDate: string | null}) {
        
        const {PlateSearch, OpenSearch, StateSearch, InitialDate, FinalDate, ...restData} = data
        const dataDao = {
            Plate: PlateSearch,
            Open: OpenSearch,
            State: StateSearch,
            InitialDate: InitialDate !== null ? new Date(InitialDate).toISOString() : null,
            FinalDate: FinalDate !== null ? new Date(FinalDate).toISOString() : null,
            ...restData
        }
        const list = await OrderDao.listByFilters(dataDao)
        if (list === undefined) throw("Error al ejecutar el query para obtener el listado de ordenes abiertas")
        const orderList: Order[] = await Promise.all(list.map( async (o) =>{
            return await this.ConstructOrderFromDao(o)
        }))

        const transferList = orderList.map((order) => this.AdaptToTransfer(order))
        return transferList
    },

    async GetByDocumentAndNumber(OrderDocument: string, OrderNumber: number) {
        const result = await OrderDao.getByOrderDocumentAndOrderNumber(OrderDocument, OrderNumber)
        if (result === undefined) {
            throw('Error al obtener el objeto Order, se obtuvo un valor "undefined" al hacer la consulta en la base de datos. Funcion: Order.GetByDocumentAndNumber')
        }
        if (result.length === 0) {
            throw(`Error al obtener el objeto Order, no existe la orden ${OrderDocument} ${OrderNumber} en la base de datos.`)
        }
        if (result.length > 1) {
            throw(`Error al obtener el objeto Order, inconsistencia de datos: hay más de una ${OrderDocument} ${OrderNumber} en la base de datos, solo puede existir una orden.`)
        }
        
        const data = result[0]
        const order = this.ConstructOrderFromDao(data)
        return order
    },

    async EditByDocumentAndNumber(data: {OrderDocument: string, OrderNumber: number, User: string, Plate: string, ContactId: string, 
        CardNumber: number, Mileage: number, Quote: boolean, Diagnosis: boolean, Warranty: boolean, Lubrication: boolean, 
        Mechanics: boolean, Powertrain: boolean, State: string, ReceptionNote: string}) {
        
        const {OrderDocument, OrderNumber, User, Plate, ContactId, CardNumber, State,
            Mileage, Quote, Diagnosis, Warranty, Lubrication, Mechanics, Powertrain, ReceptionNote} = data

        //Order state validation
        const orderState = await OrderStateGestor.GetByCode(State)

        //Vehicle membership validation
        if (CardNumber !== 0 ) {
            //console.log(CardNumber)
            const membership = await VehicleMembershipGestor.GeyByCardNumber(CardNumber)
            if (membership.Plate !== Plate){
                throw(`La membresía ${CardNumber}, no pertenece al vehículo ${Plate}, no se puede modificar la orden con esta membresía.`)
            }
            if (!membership.Active) {
                throw(`La membresía ${CardNumber}, se encuentra actualmente INACTIVA, no se puede modificar la orden con esta membresía.`)
            }
        }

        const OldOrder = await this.GetByDocumentAndNumber(OrderDocument, OrderNumber)
        //Orders validation
        if (!await this.Exists(OrderDocument, OrderNumber)) {
            throw(`La orden ${OrderDocument} ${OrderNumber} NO existe en la base de datos, no se puede modificar.`)
        }
        if (!OldOrder.Open) {
            throw(`La orden ${OrderDocument} ${OrderNumber} esta cerrada, no se puede modificar.`)
        }
        if (OldOrder.Annulled) {
            throw(`La orden ${OrderDocument} ${OrderNumber} esta anulada, no se puede modificar.`)
        }
        if (await OrderStateGestor.ValidateFinalState(OldOrder.OrderState)) {
            throw(`La orden ${OldOrder.OrderDocument} ${OldOrder.OrderNumber} actualmente esta en estado FINALIZADO en la base de datos. No se puede alterar. No es posible la modificación o alteración de la orden.`)
        }

        const today = DateTime.local()
        const ChangedOrder: Order = {
            //Don't change
            OrderDocument: OldOrder.OrderDocument,
            OrderNumber: OldOrder.OrderNumber,
            Open: OldOrder.Open,
            Annulled: OldOrder.Annulled,
            InterventionRecord: {
                CreationDate: OldOrder.InterventionRecord.CreationDate,
                CreatedBy: OldOrder.InterventionRecord.CreatedBy,
                //change, new data
                ModifiedBy: (await UserGestor.GetByUserCode(User)).UserCode, 
                ModificationDate: today, 
            },
            Vehicle: await VehicleGestor.GetByPlate(Plate),
            Contact: await ContactGestor.GetByIdentification(ContactId),
            OrderState: orderState,
            CardNumber: CardNumber,
            Mileage: Mileage,
            ReceptionIndicators: {
                Quote: Quote, 
                Diagnosis: Diagnosis, 
                Warranty: Warranty, 
                Lubrication: Lubrication, 
                Mechanics: Mechanics, 
                Powertrain: Powertrain,
            },
            ReceptionNote: ReceptionNote,
            AnnulledBy: null
            
        }

        //UserAppDocuments
        const userAppDocument: UserAppDocument = {UserCode: User, DocumentCode: OrderDocument}
        if (!await UserAppDocumentGestor.Exists(userAppDocument)) {
            throw(`No se puede modificar la orden, el usuario ${User} no tiene asignado el documento de aplicación ${OrderDocument}.`)
        }

        //Vehicle contact validation
        const vehicleContact: VehicleContact = {
            ContactId: ContactId,
            VehiclePlate: Plate
        }
        if (!await VehicleContactGestor.Exists(vehicleContact)) {
            throw(`No es posible modificar la orden para el vehículo ${Plate}, debido a que el contacto ${ContactId} no esta asignado a la placa.`)
        } 

        const { Vehicle, Contact, ReceptionIndicators, InterventionRecord, OrderState, ...restOrder} = ChangedOrder
        const { CreationDate, ModificationDate, ...RestInterventionRecord } = InterventionRecord

        const updateData = {
            Plate: Vehicle.Plate,
            VehicleDescription: Vehicle.Description,
            PlateType: Vehicle.PlateType,
            ContactId: Contact.Identification,
            ContactName: Contact.FullName,
            ContactNumber: Contact.ContactNumber,
            CreationDate: CreationDate.toSQL(),
            ModificationDate: ModificationDate === null ? null : ModificationDate?.toSQL(),
            State: OrderState.Code,
            ...ReceptionIndicators,
            ...restOrder,
            ...RestInterventionRecord
        }

        await OrderDao.updateByOrderDocumentAndOrderNumber(updateData)
    },

    async DeleteDocumentAndNumber(OrderDocument: string, OrderNumber: number) {
        if (!await this.Exists(OrderDocument, OrderNumber)) {
            throw(`La orden ${OrderDocument}${OrderNumber} NO existe en la base de datos, no se puede eliminar.`)
        }
        await OrderDao.deleteByByOrderDocumentAndOrderNumber(OrderDocument, OrderNumber)
    },

    async Exists(OrderDocument: string, OrderNumber: number) {
        const result = await OrderDao.getByOrderDocumentAndOrderNumber(OrderDocument, OrderNumber)
        if (result === undefined || result?.length < 1 ) {
            return false
        }
        return true
    },

    async ExistsOpenOrderByPlate(Plate: string) {
        const result = await OrderDao.getOpenOrderByPlate(Plate)
        if (result === undefined || result?.length < 1 ) {
            return false
        }
        return true
    },

    async Close(OrderDocument: string, OrderNumber: number) {
        const order = await this.GetByDocumentAndNumber(OrderDocument, OrderNumber)
        
        if (!order.Open) {
            throw(`La orden ${OrderDocument} ${OrderNumber} actualmente esta cerrada en la base de datos, no se puede volver a cerrar.`)
        }
        if (order.Annulled) {
            throw(`La orden ${OrderDocument} ${OrderNumber} actualmente esta anulada en la base de datos, no se puede  cerrar.`)
        }
        await OrderDao.closeOrder(OrderDocument, OrderNumber)
    },

    async Annull(OrderDocument: string, OrderNumber: number, User: string, AnnulledReason: string) {
        const order = await this.GetByDocumentAndNumber(OrderDocument, OrderNumber)

        if (!order.Open) {
            throw(`La orden ${OrderDocument} ${OrderNumber} actualmente esta cerrada en la base de datos, no se puede anular.`)
        }
        if (order.Annulled) {
            throw(`La orden ${OrderDocument} ${OrderNumber} actualmente esta anulada en la base de datos, no se puede volver a anular.`)
        }
        if (await OrderStateGestor.ValidateFinalState(order.OrderState)) {
            throw(`La orden ${order.OrderDocument} ${order.OrderNumber} actualmente esta en estado FINALIZADO en la base de datos. No se puede alterar. No es posible la modificación o alteración de la orden.`)
        }

        //UserAppDocuments
        const userAppDocument: UserAppDocument = {UserCode: User, DocumentCode: OrderDocument}
        if (!await UserAppDocumentGestor.Exists(userAppDocument)) {
            throw(`No se puede anular la orden, el usuario ${User} no tiene asignado el documento de aplicación ${OrderDocument}.`)
        }

        const user = await UserGestor.GetByUserCode(User)
        await OrderDao.annullOrder(OrderDocument, OrderNumber, user.UserCode, AnnulledReason)

    },

    async SetInvoice(order: Order, User: string, InvoiceDocumentType: string, InvoiceDocumentNumber: number) {
        const {OrderDocument, OrderNumber} = order
        this.ValidateAccess(order)
        const today = DateTime.local()
        const AdaptDate = today.toSQL()
        if (!AdaptDate) throw("Error al convertir la fecha para agregar los datos de la factura a la orden.") 
        await OrderDao.setInvoiceData(OrderDocument, OrderNumber, User, InvoiceDocumentType, InvoiceDocumentNumber, AdaptDate)
    },

    ValidateAccess(order: Order) {
        const {OrderDocument, OrderNumber} = order
        if (!order.Open) {
            throw(`La orden ${OrderDocument} ${OrderNumber} actualmente esta cerrada en la base de datos. No es posible la modificación, alteración o facturación de la orden.`)
        }
        if (order.Annulled) {
            throw(`La orden ${OrderDocument} ${OrderNumber} actualmente esta anulada en la base de datos. No se puede alterar. No es posible la modificación, alteración o facturación de la orden.`)
        }
        
    }
}
 

export default OrderGestor
export type {Order}