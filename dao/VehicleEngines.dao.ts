import { getConnection } from "../database/connection"
import appConfig from "../config"
const app_db = appConfig.app_db
const table = 'VehicleEngines'

const VehicleEnginesDao = {

    insert: async (YearId: number, Description: string) => {
        const pool = await getConnection()
        const query = `INSERT INTO ${app_db}.[dbo].${table} (YearId, Description) VALUES ('${YearId}', '${Description}')`
        await pool
            ?.request()
            .query(query)
    },

    getByEngineId: async (EngineId: number) => {
        const pool = await getConnection()
        const query = `SELECT EngineId, YearId, Description FROM ${app_db}.[dbo].${table} WHERE EngineId = '${EngineId}'`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    },
    
    getByEngineIdAndYearId: async (EngineId: number, YearId: number) => {
        const pool = await getConnection()
        const query = `SELECT EngineId, YearId, Description FROM ${app_db}.[dbo].${table} WHERE EngineId = '${EngineId}' AND YearId = ${YearId}`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    },

    getByDescriptionAndYearId: async (YearId: number, Description: string) => {
        const pool = await getConnection()
        const query = `SELECT EngineId, YearId, Description FROM ${app_db}.[dbo].${table} WHERE YearId = '${YearId}' AND Description = '${Description}'`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    },

    updateByEngineId: async (EngineId: number, YearId: number, Description: string) => {
        const pool = await getConnection()
        const query = `UPDATE ${app_db}.[dbo].${table} SET YearId = '${YearId}', Description = '${Description}' WHERE EngineId = '${EngineId}'`
        await pool
            ?.request()
            .query(query)
    },

    deleteByEngineId: async (EngineId: number) => {
        const pool = await getConnection()
        const query = `DELETE FROM ${app_db}.[dbo].${table} WHERE EngineId = '${EngineId}'`
        await pool
            ?.request()
            .query(query)
    },

    listByDescription: async (Description: string) => {
        const pool = await getConnection()
        const query = `SELECT EngineId, YearId, Description FROM ${app_db}.[dbo].${table} WHERE Description LIKE '%${Description}%'`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    },

    listByYearId: async (YearId: number) => {
        const pool = await getConnection()
        const query = `SELECT EngineId, YearId, Description FROM ${app_db}.[dbo].${table} WHERE YearId = '${YearId}'`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    }
}

export default VehicleEnginesDao