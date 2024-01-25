import VehicleFuelTypeDao from "../dao/VehicleFuelTypes.dao"

interface VehicleFuelType {
    Code: string,
    Description: string
}

const VehicleFuelTypeGestor = {

    async Create(VehicleFuelType: VehicleFuelType) {
        const {Code, Description} = VehicleFuelType
        if (await this.Exists(Code)) {
            throw(`El tipo de placa de vehiculo ${Code} ya existe en la base de datos, no se puede volver a crear.`)
        }
        await VehicleFuelTypeDao.insert(Code,Description)
    },

    async ListAll() {
        const list = await VehicleFuelTypeDao.listByDescription('')
        return list
    },

    async ListByDescription(Description: string) {
        const list = await VehicleFuelTypeDao.listByDescription(Description)
        return list 
    },

    async GetByCode(Code: string) {
        const plateType = await VehicleFuelTypeDao.getByCode(Code)
        return plateType
    },

    async EditByCode(VehicleFuelType: VehicleFuelType) {
        const {Code, Description} = VehicleFuelType
        if (!await this.Exists(Code)) {
            throw(`El tipo de placa de vehiculo ${Code} NO existe en la base de datos, no se puede modificar.`)
        }
        await VehicleFuelTypeDao.updateByCode(Code, Description)
    },

    async DeleteByCode(Code: string) {
        if (!await this.Exists(Code)) {
            throw(`El tipo de placa de vehiculo ${Code} NO existe en la base de datos, no se puede eliminar.`)
        }
        await VehicleFuelTypeDao.deleteByCode(Code)
    },

    async Exists(Code: string) {
        const result = await VehicleFuelTypeDao.getByCode(Code)
        if (result === undefined || result?.length < 1 ) {
            return false
        }
        return true
    }
}
 

export default VehicleFuelTypeGestor
export type {VehicleFuelType}