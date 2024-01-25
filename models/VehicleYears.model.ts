import VehicleYearDao from "../dao/VehicleYears.dao"
import VehicleLineGestor from "./VehicleLines.model"

interface VehicleYear {
    YearId: number,
    LineId: number,
    Year: string
}

const VehicleYearGestor = {

    async Create(VehicleYear: VehicleYear) {
        const {LineId, Year} = VehicleYear
        if (await this.ExistsByYearAndLineId(LineId, Year)) {
            throw(`El año de vehículo ${Year} ya existe en la base de datos, no se puede volver a crear.`)
        }

        if (!await VehicleLineGestor.ExistsByLineId(LineId)) {
            throw(`El año de vehiculo ${Year} no se puede crear, debido a que no existe la linea de vehículo referenciada (${LineId}).`)
        }

        await VehicleYearDao.insert(LineId, Year)
    },

    async ListAll() {
        const list = await VehicleYearDao.listByYear('')
        return list
    },

    async ListByYear(Year: string) {
        const list = await VehicleYearDao.listByYear(Year)
        return list 
    },

    async ListByLineId(LineId: number) {
        const list = await VehicleYearDao.listByLineId(LineId)
        return list 
    },

    async GetByYearId(YearId: number) {
        const data = await VehicleYearDao.getByYearId(YearId)
        const vehicleYear = data !== undefined ? data[0] as VehicleYear : undefined
        return vehicleYear
    },

    async EditByYearId(VehicleYear: VehicleYear) {
        const {YearId, LineId, Year} = VehicleYear
        if (!await this.ExistsByYearId(YearId)) {
            throw(`El año de vehículo ${YearId} NO existe en la base de datos, no se puede modificar.`)
        }

        if (!await VehicleLineGestor.ExistsByLineId(LineId)) {
            throw(`El año de vehiculo ${Year} no se puede modificar, debido a que no existe la linea de vehículo referenciada (${LineId}).`)
        }

        if (await this.ExistsByYearAndLineId(LineId, Year)) {
            const vehicleLine = await VehicleLineGestor.GetByLineId(LineId)
            throw(`El año de vehículo ${Year} ya existe para la linea de vehículo ${vehicleLine?.Description}, no se puede modificar.`)
        }
        await VehicleYearDao.updateByYearId(YearId, LineId, Year)
    },

    async DeleteByYearId(YearId: number) {
        if (!await this.ExistsByYearId(YearId)) {
            throw(`La linea de vehículo ${YearId} NO existe en la base de datos, no se puede eliminar.`)
        }
        await VehicleYearDao.deleteByYearId(YearId)
    },

    async ExistsByYearId(YearId: number) {
        const result = await VehicleYearDao.getByYearId(YearId)
        if (result === undefined || result?.length < 1 ) {
            return false
        }
        return true
    },

    async ExistsByYearIdAndLineId(YearId: number, LineId: number) {
        const result = await VehicleYearDao.getByYearIdAndLineId(YearId, LineId)
        if (result === undefined || result?.length < 1 ) {
            return false
        }
        return true
    },

    async ExistsByYearAndLineId(LineId: number, Year: string) {
        const result = await VehicleYearDao.getByYearAndLineId(LineId, Year)
        if (result === undefined || result?.length < 1 ) {
            return false
        }
        return true
    }
}
 

export default VehicleYearGestor
export type {VehicleYear}