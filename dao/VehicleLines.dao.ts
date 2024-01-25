import { getConnection } from "../database/connection"
import appConfig from "../config"
const app_db = appConfig.app_db
const table = 'VehicleLines'

const VehicleLinesDao = {

    insert: async (ManufacterId: number, Description: string) => {
        const pool = await getConnection()
        const query = `INSERT INTO ${app_db}.[dbo].${table} (ManufacterId, Description) VALUES ('${ManufacterId}', '${Description}')`
        await pool
            ?.request()
            .query(query)
    },

    getByLineId: async (LineId: number) => {
        const pool = await getConnection()
        const query = `SELECT LineId, ManufacterId, Description FROM ${app_db}.[dbo].${table} WHERE LineId = '${LineId}'`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    },

    getByLineIdAndManufacterId: async (LineId: number, ManufacterId: number) => {
        const pool = await getConnection()
        const query = `SELECT LineId, ManufacterId, Description FROM ${app_db}.[dbo].${table} WHERE LineId = '${LineId}' AND ManufacterId = '${ManufacterId}'`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    },

    getByDescriptionAndManufacterId: async (ManufacterId: number, Description: string) => {
        const pool = await getConnection()
        const query = `SELECT LineId, ManufacterId, Description FROM ${app_db}.[dbo].${table} WHERE ManufacterId = '${ManufacterId}' AND Description = '${Description}'`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    },

    updateByLineId: async (LineId: number, ManufacterId: number, Description: string) => {
        const pool = await getConnection()
        const query = `UPDATE ${app_db}.[dbo].${table} SET ManufacterId = '${ManufacterId}', Description = '${Description}' WHERE LineId = '${LineId}'`
        await pool
            ?.request()
            .query(query)
    },

    deleteByLineId: async (LineId: number) => {
        const pool = await getConnection()
        const query = `DELETE FROM ${app_db}.[dbo].${table} WHERE LineId = '${LineId}'`
        await pool
            ?.request()
            .query(query)
    },

    listByDescription: async (Description: string) => {
        const pool = await getConnection()
        const query = `SELECT LineId, ManufacterId, Description FROM ${app_db}.[dbo].${table} WHERE Description LIKE '%${Description}%'`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    },

    listByManufacterId: async (ManufacterId: number) => {
        const pool = await getConnection()
        const query = `SELECT LineId, ManufacterId, Description FROM ${app_db}.[dbo].${table} WHERE ManufacterId = '${ManufacterId}'`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    }
}

export default VehicleLinesDao