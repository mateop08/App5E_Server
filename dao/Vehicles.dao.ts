import { getConnection } from "../database/connection"
import appConfig from "../config"
const app_db = appConfig.app_db
const table = 'Vehicles'

const VehiclesDao = {

    insert: async (Plate: string, PlateType: string, Description: string, ManufacterId: number, LineId: number, YearId: number, EngineId: number, FuelType: string) => {
        const pool = await getConnection()
        const query = `INSERT INTO ${app_db}.[dbo].${table} (Plate, PlateType, Description, ManufacterId, LineId, YearId, EngineId, FuelType) 
            VALUES ('${Plate}', '${PlateType}', '${Description}', '${ManufacterId}', '${LineId}', '${YearId}', '${EngineId}', '${FuelType}')`
        
        await pool
            ?.request()
            .query(query)
    },

    getByPlate: async (Plate: string) => {
        const pool = await getConnection()
        const query = `SELECT Plate, PlateType, Description, ManufacterId, LineId, YearId, EngineId, FuelType
            FROM ${app_db}.[dbo].${table} WHERE Plate = '${Plate}'`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    },

    updateByPlate: async (Plate: string, PlateType: string, Description: string, ManufacterId: number, LineId: number, YearId: number, EngineId: number, FuelType: string) => {
        const pool = await getConnection()
        const query = `UPDATE ${app_db}.[dbo].${table} SET 
            PlateType = '${PlateType}', Description = '${Description}',
            ManufacterId = '${ManufacterId}', LineId = '${LineId}', 
            YearId = '${YearId}', EngineId = '${EngineId}', FuelType = '${FuelType}'
            WHERE Plate = '${Plate}'`
        await pool
            ?.request()
            .query(query)
    },

    deleteByPlate: async (Plate: string) => {
        const pool = await getConnection()
        const query = `DELETE FROM ${app_db}.[dbo].${table} WHERE Plate = '${Plate}'`
        await pool
            ?.request()
            .query(query)
    },

    listByDescription: async (Description: string) => {
        const pool = await getConnection()
        const query = `SELECT Plate, PlateType, Description, ManufacterId, LineId, YearId, EngineId, FuelType
            FROM ${app_db}.[dbo].${table} WHERE Description LIKE '%${Description}%'`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    }
}

export default VehiclesDao