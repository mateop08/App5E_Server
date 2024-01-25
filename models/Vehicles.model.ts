import VehicleDao from "../dao/Vehicles.dao"
import VehicleEngineGestor from "./VehicleEngines.model"
import VehicleLineGestor from "./VehicleLines.model"
import VehicleManufacterGestor from "./VehicleManufacters.model"
import VehiclePlateTypeGestor from "./VehiclePlateTypes.model"
import VehicleYearGestor from "./VehicleYears.model"

interface Vehicle {
    Plate: string, 
    PlateType: string, 
    Description: string, 
    ManufacterId: number, 
    LineId: number, 
    YearId: number, 
    EngineId: number,
    FuelType: string
}

const VehicleGestor = {

    async Create(Vehicle: Vehicle) {
        const {Plate, PlateType, ManufacterId, LineId, YearId, EngineId, FuelType} = Vehicle
        await this.ValidateVehicle(Vehicle)
        if (await this.Exists(Plate)) {
            throw(`El vehículo ${Plate} ya existe en la base de datos, no se puede volver a crear.`)
        }
        const Description = await this.GetDescription(Vehicle)
        await VehicleDao.insert(Plate, PlateType, Description, ManufacterId, LineId, YearId, EngineId, FuelType)
    },

    async ListAll() {
        const list = await VehicleDao.listByDescription('')
        return list
    },

    async ListByDescription(Description: string) {
        const list = await VehicleDao.listByDescription(Description)
        return list 
    },

    async GetByPlate(Plate: string) {
        if (!await this.Exists(Plate)) {
            throw(`El vehículo ${Plate} NO existe en la base de datos, no se puede inicializar el objeto Vehicle.`)
        }
        const data = await VehicleDao.getByPlate(Plate)
        if (data !== undefined && data.length === 1) {
            const vehicle = data[0] as Vehicle
            return vehicle
        } else {
            throw('No fue posible inicializar el objeto Vehicle')
        }
        
    },

    async EditByPlate(Vehicle: Vehicle) {
        const {Plate, PlateType, ManufacterId, LineId, YearId, EngineId, FuelType} = Vehicle
        this.ValidateVehicle(Vehicle)
        if (!await this.Exists(Plate)) {
            throw(`El vehículo ${Plate} NO existe en la base de datos, no se puede modificar.`)
        }
        const Description = await this.GetDescription(Vehicle)
        await VehicleDao.updateByPlate(Plate, PlateType, Description, ManufacterId, LineId, YearId, EngineId, FuelType)
    },

    async DeleteByCode(Plate: string) {
        if (!await this.Exists(Plate)) {
            throw(`El vehículo ${Plate} NO existe en la base de datos, no se puede eliminar.`)
        }
        await VehicleDao.deleteByPlate(Plate)
    },

    async Exists(Plate: string) {
        const result = await VehicleDao.getByPlate(Plate)
        if (result === undefined || result?.length < 1 ) {
            return false
        }
        return true
    },

    async ValidateVehicle(vehicle: Vehicle){
        
        if (!await VehicleManufacterGestor.ExistsByManufacterId(vehicle.ManufacterId)) {
            throw(`La marca de vehículo ${vehicle.ManufacterId} referenciada NO existe en la base de datos, no se puede crear el vehículo.`)
        }
        if (!await VehicleLineGestor.ExistsByLineId(vehicle.LineId)) {
            throw(`La linea de vehículo ${vehicle.LineId} referenciada NO existe en la base de datos, no se puede crear el vehículo.`)
        }
        if (!await VehicleLineGestor.ExistsByLineIdAndManufacterId(vehicle.LineId, vehicle.ManufacterId)) {
            throw(`La linea de vehículo ${vehicle.LineId} no guarda relación con el fabricante de vehículo ${vehicle.ManufacterId} en la base de datos, no se puede crear el vehículo.`)
        }
        if (!await VehicleYearGestor.ExistsByYearId(vehicle.YearId)) {
            throw(`El año de vehículo ${vehicle.YearId} referenciado NO existe en la base de datos, no se puede crear el vehículo.`)
        }
        if (!await VehicleYearGestor.ExistsByYearIdAndLineId(vehicle.YearId, vehicle.LineId)){
            throw(`El año de vehículo ${vehicle.YearId} no guarda relación con la línea de vehículo ${vehicle.LineId} en la base de datos, no se puede crear el vehículo.`)
        }
        if (!await VehicleEngineGestor.ExistsByEngineId(vehicle.EngineId)) {
            throw(`El motor de vehículo ${vehicle.EngineId} referenciado no existe en la base de datos, no se puede crear el vehículo.`)
        }
        if (!await VehicleEngineGestor.ExistsByEngineIdAndYearId(vehicle.EngineId, vehicle.YearId)) {
            throw(`El motor de vehículo ${vehicle.EngineId} no guarda relación el año de vehículo ${vehicle.YearId} en la base de datos, no se puede crear el vehículo.`)
        }
        if (!await VehiclePlateTypeGestor.Exists(vehicle.PlateType)) {
            throw(`El tipo de placa de vehículo ${vehicle.PlateType} no existe en la base de datos, no se puede crear el vehículo.`)
        }
    },

    async GetDescription(Vehicle: Vehicle) {
        const manufacter = await VehicleManufacterGestor.GetByManufacterId(Vehicle.ManufacterId)
        const line = await VehicleLineGestor.GetByLineId(Vehicle.LineId)
        const year = await VehicleYearGestor.GetByYearId(Vehicle.YearId)
        const engine = await VehicleEngineGestor.GetByEngineId(Vehicle.EngineId)
        const description = `${manufacter?.Description} ${line?.Description} ${year?.Year} ${engine?.Description}`
        return description
    }
}
 

export default VehicleGestor
export type {Vehicle}