import VehicleMembershipTypeDao from "../dao/VehicleMembershipTypes.dao"

interface VehicleMembershipType {
    Code: string,
    Description: string
}

const VehicleMembershipTypeGestor = {

    async Create(VehicleMembershipType: VehicleMembershipType) {
        const {Code, Description} = VehicleMembershipType
        if (await this.Exists(Code)) {
            throw(`El tipo de membresia de vehiculo ${Code} ya existe en la base de datos, no se puede volver a crear.`)
        }
        await VehicleMembershipTypeDao.insert(Code,Description)
    },

    async ListAll() {
        const list = await VehicleMembershipTypeDao.listByDescription('')
        return list
    },

    async ListByDescription(Description: string) {
        const list = await VehicleMembershipTypeDao.listByDescription(Description)
        return list 
    },

    async GetByCode(Code: string) {
        const membershipType = await VehicleMembershipTypeDao.getByCode(Code)
        return membershipType
    },

    async EditByCode(VehicleMembershipType: VehicleMembershipType) {
        const {Code, Description} = VehicleMembershipType
        if (!await this.Exists(Code)) {
            throw(`El tipo de membresia de vehiculo ${Code} NO existe en la base de datos, no se puede modificar.`)
        }
        await VehicleMembershipTypeDao.updateByCode(Code, Description)
    },

    async DeleteByCode(Code: string) {
        if (!await this.Exists(Code)) {
            throw(`El tipo de membresia de vehiculo ${Code} NO existe en la base de datos, no se puede eliminar.`)
        }
        await VehicleMembershipTypeDao.deleteByCode(Code)
    },

    async Exists(Code: string) {
        const result = await VehicleMembershipTypeDao.getByCode(Code)
        if (result === undefined || result?.length < 1 ) {
            return false
        }
        return true
    }
}
 

export default VehicleMembershipTypeGestor
export type {VehicleMembershipType}