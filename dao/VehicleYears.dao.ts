import { getConnection } from "../database/connection"
import appConfig from "../config"
const app_db = appConfig.app_db
const table = 'VehicleYears'

const VehicleYearsDao = {

    insert: async (LineId: number, Year: string) => {
        const pool = await getConnection()
        const query = `INSERT INTO ${app_db}.[dbo].${table} (LineId, Year) VALUES ('${LineId}', '${Year}')`
        await pool
            ?.request()
            .query(query)
    },

    getByYearId: async (YearId: number) => {
        const pool = await getConnection()
        const query = `SELECT YearId, LineId, Year FROM ${app_db}.[dbo].${table} WHERE YearId = '${YearId}'`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    },
    getByYearIdAndLineId: async (YearId: number, LineId: number) => {
        const pool = await getConnection()
        const query = `SELECT YearId, LineId, Year FROM ${app_db}.[dbo].${table} WHERE YearId = '${YearId}' AND LineId = '${LineId}'`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    },

    getByYearAndLineId: async (LineId: number, Year: string) => {
        const pool = await getConnection()
        const query = `SELECT YearId, LineId, Year FROM ${app_db}.[dbo].${table} WHERE LineId = '${LineId}' AND Year = '${Year}'`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    },

    updateByYearId: async (YearId: number, LineId: number, Year: string) => {
        const pool = await getConnection()
        const query = `UPDATE ${app_db}.[dbo].${table} SET LineId = '${LineId}', Year = '${Year}' WHERE YearId = '${YearId}'`
        await pool
            ?.request()
            .query(query)
    },

    deleteByYearId: async (YearId: number) => {
        const pool = await getConnection()
        const query = `DELETE FROM ${app_db}.[dbo].${table} WHERE YearId = '${YearId}'`
        await pool
            ?.request()
            .query(query)
    },

    listByYear: async (Year: string) => {
        const pool = await getConnection()
        const query = `SELECT YearId, LineId, Year FROM ${app_db}.[dbo].${table} WHERE Year LIKE '%${Year}%'`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    },

    listByLineId: async (LineId: number) => {
        const pool = await getConnection()
        const query = `SELECT YearId, LineId, Year FROM ${app_db}.[dbo].${table} WHERE LineId = '${LineId}'`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    }
}

export default VehicleYearsDao