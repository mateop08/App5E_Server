import VehicleMembershipDao from "../dao/VehicleMemberships.dao"
import ContactGestor from "./Contacts.model"
import VehicleContactGestor from "./VehicleContacts.model"
import VehicleMembershipTypeGestor from "./VehicleMembershipTypes.model"
import VehicleGestor from "./Vehicles.model"
import crypto from 'crypto'

interface VehicleMembership {
    Plate: string,
    MembershipTypeCode: string,
    CardNumber: number,
    Active: boolean,
    ContactId: string,
    RegistrationDate: string
}

const VehicleMembershipGestor = {

    async Create(VehicleMembership: VehicleMembership) {
        const {Plate, MembershipTypeCode, ContactId} = VehicleMembership
        if (!await VehicleGestor.Exists(Plate)) {
            throw(`El vehiculo ${Plate} no existe en la base datos, no se puede crear la membresía.`)
        }
        if (!await VehicleMembershipTypeGestor.Exists(MembershipTypeCode)) {
            throw(`El tipo de membresía ${MembershipTypeCode} no existe en la base datos, no se puede crear la membresía.`)
        }
        if (!await ContactGestor.Exists(ContactId)) {
            throw(`El contacto ${ContactId} no existe en la base datos, no se puede crear la membresía.`)
        }
        if (!await VehicleContactGestor.Exists({VehiclePlate: Plate, ContactId: ContactId })) {
            throw(`El contacto ${ContactId} no esta asignado a la placa ${Plate}, no se puede crear la membresía.`)
        }
        if (await this.ExistsActiveMembership(Plate)) {
            throw(`El vehículo ${Plate} actualmente tiene una membresía ACTIVA, no se puede crear una nueva membresía.`)
        }
        
        const Active = true
        const CardNumber = await this.GenerateNumber()
        const today = new Date()
        const RegistrationDate = today.toISOString()
        
        await VehicleMembershipDao.insert(Plate, MembershipTypeCode, CardNumber, Active, ContactId, RegistrationDate)
        return CardNumber
    },

    async GeyByCardNumber(CardNumber: number) {
        const data = await VehicleMembershipDao.getByCardNumber(CardNumber)
        if (data === undefined) {
            throw('Error al obtener el objeto VehicleMembership, se obtuvo un valor "undefined" al hacer la consulta en la base de datos. Funcion: VehicleMembership.GeyByCardNumber')
        }
        if (data.length === 0) {
            throw(`Error al obtener el objeto VehicleMembership, no existe la membresía de vehículo ${CardNumber} en la base de datos.`)
        }
        if (data.length > 1) {
            throw(`Error al obtener el objeto VehicleMembership, inconsistencia de datos: hay más de una membresía de vehículo con número ${CardNumber} en la base de datos, solo puede existir un número unico de membresía.`)
        }
        const membership = data[0] as VehicleMembership
        return membership
    },

    async ListMembershipsByPlate(Plate: string) {
        const list = await VehicleMembershipDao.listByPlate(Plate) as VehicleMembership[]
        return list
    },

    async ListMembershipsByContactId(ContactId: string) {
        const list = await VehicleMembershipDao.listByContactId(ContactId) as VehicleMembership[]
        return list
    },

    async DeleteByCardNumber(CardNumber: number) {
        if (!await this.ExistsByCardNumber(CardNumber)) {
            throw(`La membresía ${CardNumber} NO existe en la base de datos, no se puede eliminar.`)
        }
        const vehicleMembership = await this.GeyByCardNumber(CardNumber)
        if (vehicleMembership.Active) {
            throw(`La membresía ${CardNumber} acutalmente se encuentra ACTIVA, no se puede eliminar.`)
        }
        await VehicleMembershipDao.deleteByCardNumber(CardNumber)
    },

    async ExistsByCardNumber(CardNumber: number) {
        const result = await VehicleMembershipDao.getByCardNumber(CardNumber)
        if (result === undefined || result?.length < 1 ) {
            return false
        }
        return true
    },

    async ExistsActiveMembership(Plate: string) {
        const result = await VehicleMembershipDao.getActiveMembershipByPlate(Plate)
        if (result !== undefined && result?.length > 1 ) {
            throw(`El vehículo ${Plate} tiene más de una membresía activa.`)
        }
        if (result === undefined || result?.length < 1 ) {
            return false
        }
        return true
    },

    async Activate(CardNumber: number) {
        if (!await this.ExistsByCardNumber(CardNumber)) {
            throw(`La membresía ${CardNumber} NO existe en la base de datos, no se puede activar.`)
        }
        const vehicleMembership = await this.GeyByCardNumber(CardNumber)
        const {Plate} = vehicleMembership
        if (vehicleMembership.Active) {
            throw(`La membresía ${CardNumber} acutalmente se encuentra ACTIVA, no se puede volver a ACTIVAR.`)
        }
        if (await this.ExistsActiveMembership(Plate)) {
            throw(`El vehículo ${vehicleMembership.Plate} actualmente tiene una membresía ACTIVA, no se puede activar la membresía ${CardNumber}.`)
        }
       await VehicleMembershipDao.activate(CardNumber)
    },

    async Deactivate(CardNumber: number) {
        if (!await this.ExistsByCardNumber(CardNumber)) {
            throw(`La membresía ${CardNumber} NO existe en la base de datos, no se puede desactivar.`)
        }
        const vehicleMembership = await this.GeyByCardNumber(CardNumber)
        if (!vehicleMembership.Active) {
            throw(`La membresía ${CardNumber} acutalmente se encuentra INACTIVA, no se puede volver a DESACTIVAR.`)
        }
        await VehicleMembershipDao.deactivate(CardNumber)
    },

    async GenerateNumber() {
        var CardNumber: number = 0
        var validNumber = false
        while (!validNumber) {
            CardNumber = crypto.randomInt(10**7, 10**8-1)
            if (!await this.ExistsByCardNumber(CardNumber)) {
                validNumber = true
            }
        }
        return CardNumber
    }
}
 

export default VehicleMembershipGestor
export type {VehicleMembership}