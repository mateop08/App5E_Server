import VehicleLineDao from "../dao/VehicleLines.dao"
import VehicleManufacterGestor from "./VehicleManufacters.model"

interface VehicleLine {
    LineId: number,
    ManufacterId: number,
    Description: string
}

const VehicleLineGestor = {

    async Create(VehicleLine: VehicleLine) {
        const {ManufacterId, Description} = VehicleLine
        if (await this.ExistsByDescriptionAndManufacterId(ManufacterId, Description)) {
            throw(`La linea de vehículo ${Description} ya existe en la base de datos, no se puede volver a crear.`)
        }

        if (!await VehicleManufacterGestor.ExistsByManufacterId(ManufacterId)) {
            throw(`La linea de vehiculo ${Description} no se puede crear, debido a que no existe la marca de vehículo referenciada (${ManufacterId}).`)
        }

        await VehicleLineDao.insert(ManufacterId, Description)
    },

    async ListAll() {
        const list = await VehicleLineDao.listByDescription('')
        return list
    },

    async ListByDescription(Description: string) {
        const list = await VehicleLineDao.listByDescription(Description)
        return list 
    },

    async ListByManufacterId(ManufacterId: number) {
        const list = await VehicleLineDao.listByManufacterId(ManufacterId)
        return list 
    },

    async GetByLineId(LineId: number) {
        const data = await VehicleLineDao.getByLineId(LineId)
        const vehicleLine = data !== undefined ? data[0] as VehicleLine : undefined
        return vehicleLine
    },

    async EditByLineId(VehicleLine: VehicleLine) {
        const {LineId, ManufacterId, Description} = VehicleLine
        if (!await this.ExistsByLineId(LineId)) {
            throw(`La linea de vehículo ${LineId} NO existe en la base de datos, no se puede modificar.`)
        }

        if (!await VehicleManufacterGestor.ExistsByManufacterId(ManufacterId)) {
            throw(`La linea de vehiculo ${Description} no se puede modificar, debido a que no existe la marca de vehículo referenciada (${ManufacterId}).`)
        }

        if (await this.ExistsByDescriptionAndManufacterId(ManufacterId, Description)) {
            const vehicleManufacter = VehicleManufacterGestor.GetByManufacterId(ManufacterId)
            throw(`La linea de vehículo ${Description} ya existe para el fabricante de vehículo ${vehicleManufacter}, no se puede modificar.`)
        }
        await VehicleLineDao.updateByLineId(LineId, ManufacterId, Description)
    },

    async DeleteByLineId(LineId: number) {
        if (!await this.ExistsByLineId(LineId)) {
            throw(`La linea de vehículo ${LineId} NO existe en la base de datos, no se puede eliminar.`)
        }
        await VehicleLineDao.deleteByLineId(LineId)
    },

    async ExistsByLineId(LineId: number) {
        const result = await VehicleLineDao.getByLineId(LineId)
        if (result === undefined || result?.length < 1 ) {
            return false
        }
        return true
    },

    async ExistsByLineIdAndManufacterId(LineId: number, ManufacterId: number) {
        const result = await VehicleLineDao.getByLineIdAndManufacterId(LineId, ManufacterId)
        if (result === undefined || result?.length < 1 ) {
            return false
        }
        return true
    },

    async ExistsByDescriptionAndManufacterId(ManufacterId: number, Description: string) {
        const result = await VehicleLineDao.getByDescriptionAndManufacterId(ManufacterId, Description)
        if (result === undefined || result?.length < 1 ) {
            return false
        }
        return true
    }
}
 

export default VehicleLineGestor
export type {VehicleLine}