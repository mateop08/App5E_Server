import VehiclePlateTypeDao from "../dao/VehiclePlateTypes.dao"

interface VehiclePlateType {
    Code: string,
    Description: string
}

const VehiclePlateTypeGestor = {

    async Create(VehiclePlateType: VehiclePlateType) {
        const {Code, Description} = VehiclePlateType
        if (await this.Exists(Code)) {
            throw(`El tipo de placa de vehiculo ${Code} ya existe en la base de datos, no se puede volver a crear.`)
        }
        await VehiclePlateTypeDao.insert(Code,Description)
    },

    async ListAll() {
        const list = await VehiclePlateTypeDao.listByDescription('')
        return list
    },

    async ListByDescription(Description: string) {
        const list = await VehiclePlateTypeDao.listByDescription(Description)
        return list 
    },

    async GetByCode(Code: string) {
        const plateType = await VehiclePlateTypeDao.getByCode(Code)
        return plateType
    },

    async EditByCode(VehiclePlateType: VehiclePlateType) {
        const {Code, Description} = VehiclePlateType
        if (!await this.Exists(Code)) {
            throw(`El tipo de placa de vehiculo ${Code} NO existe en la base de datos, no se puede modificar.`)
        }
        await VehiclePlateTypeDao.updateByCode(Code, Description)
    },

    async DeleteByCode(Code: string) {
        if (!await this.Exists(Code)) {
            throw(`El tipo de placa de vehiculo ${Code} NO existe en la base de datos, no se puede eliminar.`)
        }
        await VehiclePlateTypeDao.deleteByCode(Code)
    },

    async Exists(Code: string) {
        const result = await VehiclePlateTypeDao.getByCode(Code)
        if (result === undefined || result?.length < 1 ) {
            return false
        }
        return true
    }
}
 

export default VehiclePlateTypeGestor
export type {VehiclePlateType}