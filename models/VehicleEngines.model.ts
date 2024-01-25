import VehicleEngineDao from "../dao/VehicleEngines.dao"
import VehicleYearGestor from "./VehicleYears.model"

interface VehicleEngine {
    EngineId: number,
    YearId: number,
    Description: string
}

const VehicleEngineGestor = {

    async Create(VehicleEngine: VehicleEngine) {
        const {YearId, Description} = VehicleEngine
        if (await this.Exists(YearId, Description)) {
            throw(`El motor de vehiculo ${Description} ya existe en la base de datos, no se puede volver a crear.`)
        }

        if (!await VehicleYearGestor.ExistsByYearId(YearId)) {
            throw(`El motor de vehiculo ${Description} no se puede crear, debido a que no existe el año de vehiculo referenciado (${YearId}).`)
        }

        await VehicleEngineDao.insert(YearId, Description)
    },

    async ListAll() {
        const list = await VehicleEngineDao.listByDescription('')
        return list
    },

    async ListByDescription(Description: string) {
        const list = await VehicleEngineDao.listByDescription(Description)
        return list 
    },

    async ListByYearId(YearId: number) {
        const list = await VehicleEngineDao.listByYearId(YearId)
        return list 
    },

    async GetByEngineId(EngineId: number) {
        const data = await VehicleEngineDao.getByEngineId(EngineId)
        const VehicleEngine = data !== undefined ? data[0] as VehicleEngine : undefined
        return VehicleEngine
    },

    async EditByEngineId(VehicleEngine: VehicleEngine) {
        const {EngineId, YearId, Description} = VehicleEngine
        if (!await this.ExistsByEngineId(EngineId)) {
            throw(`El motor de vehiculo ${EngineId} NO existe en la base de datos, no se puede modificar.`)
        }

        if (!await VehicleYearGestor.ExistsByYearId(YearId)) {
            throw(`El motor de vehiculo ${Description} no se puede modificar, debido a que no existe el año de vehiculo referenciada (${YearId}).`)
        }

        if (await this.Exists(YearId, Description)) {
            const vehicleYear = await VehicleYearGestor.GetByYearId(YearId)
            throw(`El motor de vehiculo ${Description} ya existe para el año de vehiculo ${vehicleYear?.Year}, no se puede modificar.`)
        }
        await VehicleEngineDao.updateByEngineId(EngineId, YearId, Description)
    },

    async DeleteByEngineId(EngineId: number) {
        if (!await this.ExistsByEngineId(EngineId)) {
            throw(`El motor de vehiculo ${EngineId} NO existe en la base de datos, no se puede eliminar.`)
        }
        await VehicleEngineDao.deleteByEngineId(EngineId)
    },

    async ExistsByEngineId(EngineId: number) {
        const result = await VehicleEngineDao.getByEngineId(EngineId)
        if (result === undefined || result?.length < 1 ) {
            return false
        }
        return true
    },
    
    async ExistsByEngineIdAndYearId(EngineId: number, YearId: number) {
        const result = await VehicleEngineDao.getByEngineIdAndYearId(EngineId, YearId)
        if (result === undefined || result?.length < 1 ) {
            return false
        }
        return true
    },

    async Exists(YearId: number, Description: string) {
        const result = await VehicleEngineDao.getByDescriptionAndYearId(YearId, Description)
        if (result === undefined || result?.length < 1 ) {
            return false
        }
        return true
    }
}
 

export default VehicleEngineGestor
export type {VehicleEngine}