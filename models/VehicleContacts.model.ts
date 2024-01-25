import VehicleContactDao from "../dao/VehicleContacts.dao"
import ContactGestor from "./Contacts.model"
import VehicleGestor from "./Vehicles.model"

interface VehicleContact {
    VehiclePlate: string,
    ContactId: string
}

const VehicleContactGestor = {

    async Create(VehicleContact: VehicleContact) {
        const {VehiclePlate, ContactId} = VehicleContact
        if (!await VehicleGestor.Exists(VehiclePlate)) {
            throw(`El vehiculo ${VehiclePlate} no existe en la base datos, no se puede asignar a un contacto.`)
        }
        if (!await ContactGestor.Exists(ContactId)) {
            throw(`El contacto ${ContactId} no existe en la base datos, no se puede asignar a una placa.`)
        }
        if (await this.Exists(VehicleContact)) {
            throw(`El contacto ${ContactId} ya esta asginado a la placa ${VehiclePlate} en la base de datos, no se puede volver asignar.`)
        }
        await VehicleContactDao.insert(VehiclePlate,ContactId)
    },

    async ListContactsByVehiclePlate(VehiclePlate: string) {
        if (!await VehicleGestor.Exists(VehiclePlate)) {
            throw(`El vehiculo ${VehiclePlate} no existe en la base datos.`)
        }
        const list = await VehicleContactDao.listByVehiclePlate(VehiclePlate) as VehicleContact[]
        const contactList = await Promise.all(list?.map(async (vehicleContact) => {
            var contact = await ContactGestor.GetByIdentification(vehicleContact.ContactId)
            return contact
        }))
        return contactList
    },

    async ListVehiclesByContactId(ContactId: string) {
        if (!await ContactGestor.Exists(ContactId)) {
            throw(`El contacto ${ContactId} no existe en la base datos.`)
        }
        const list = await VehicleContactDao.listByContactId(ContactId) as VehicleContact[]
        const VehicleList = await Promise.all(list?.map(async (vehicleContact) => {
            return await VehicleGestor.GetByPlate(vehicleContact.VehiclePlate)
        }))
        return VehicleList
    },

    async Delete(VehicleContact: VehicleContact) {
        const {VehiclePlate, ContactId} = VehicleContact
        if (!await this.Exists(VehicleContact)) {
            throw(`El contacto ${ContactId} NO esta asginado a la placa ${VehiclePlate}  en la base de datos, no se puede eliminar.`)
        }
        await VehicleContactDao.deleteByVehiclePlateAndContactId(VehiclePlate, ContactId)
    },

    async Exists(VehicleContact: VehicleContact) {
        const {VehiclePlate, ContactId} = VehicleContact
        const result = await VehicleContactDao.getByVehiclePlateAndContactId(VehiclePlate, ContactId)
        if (result === undefined || result?.length < 1 ) {
            return false
        }
        return true
    }
}
 

export default VehicleContactGestor
export type {VehicleContact}