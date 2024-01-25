import VehicleManufacterDao from "../dao/VehicleManufacters.dao"

interface VehicleManufacter {
    ManufacterId: number,
    Description: string
}

const VehicleManufacterGestor = {

    async Create(Description: string) {
        if (await this.ExistsByDescription(Description)) {
            throw(`El fabricante de vehículo ${Description} ya existe en la base de datos, no se puede volver a crear.`)
        }
        await VehicleManufacterDao.insert(Description)
    },

    async ListAll() {
        const list = await VehicleManufacterDao.listByDescription('') as VehicleManufacter[]
        return list
    },

    async ListByDescription(Description: string) {
        const list = await VehicleManufacterDao.listByDescription(Description) as VehicleManufacter[]
        return list 
    },

    async GetByManufacterId(ManufacterId: number) {
        const data = await VehicleManufacterDao.getByManufacterId(ManufacterId)
        const vehicleManufacter = data !== undefined ? data[0] as VehicleManufacter : undefined
        return vehicleManufacter
    },

    async GetByDescription(Description: string) {
        const data = await VehicleManufacterDao.getByDescription(Description)
        const vehicleManufacter = data !== undefined ? data[0] as VehicleManufacter : undefined
        return vehicleManufacter
    },

    async EditByManufacterId(VehicleManufacter: VehicleManufacter) {
        const {ManufacterId, Description} = VehicleManufacter
        if (!await this.ExistsByManufacterId(ManufacterId)) {
            throw(`El fabricante de vehículo ${ManufacterId} NO existe en la base de datos, no se puede modificar.`)
        }
        if (await this.ExistsByDescription(Description)) {
            throw(`El fabricante de vehículo ${Description} ya existe en la base de datos, no se puede tener dos fabricantes con el mismo nombre.`)
        }
        await VehicleManufacterDao.updateByManufacterId(ManufacterId, Description)
    },

    async DeleteByManufacterId(ManufacterId: number) {
        if (!await this.ExistsByManufacterId(ManufacterId)) {
            throw(`El fabricante de vehículo ${ManufacterId} NO existe en la base de datos, no se puede modificar.`)
        }
        await VehicleManufacterDao.deleteByManufacterId(ManufacterId)
    },

    async ExistsByManufacterId(ManufacterId: number) {
        const result = await VehicleManufacterDao.getByManufacterId(ManufacterId)
        if (result === undefined || result?.length < 1 ) {
            return false
        }
        return true
    },

    async ExistsByDescription(Description: string) {
        const result = await VehicleManufacterDao.getByDescription(Description)
        if (result === undefined || result?.length < 1 ) {
            return false
        }
        return true
    }
}
 

export default VehicleManufacterGestor
export type {VehicleManufacter}