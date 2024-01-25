import { getConnection } from "../database/connection"
import appConfig from "../config"
const app_db = appConfig.app_db
const table = 'GroupAppFunctions'

const GroupAppFunctionsDao = {

    insert: async (AppFunctionCode: string, GroupCode: string) => {
        const pool = await getConnection()
        const query = `INSERT INTO ${app_db}.[dbo].${table} (AppFunctionCode, GroupCode) 
            VALUES ('${AppFunctionCode}', '${GroupCode}')`
        await pool
            ?.request()
            .query(query)
    },

    getByAppFunctionCodeAndGroupCode: async (AppFunctionCode: string, GroupCode: string) => {
        const pool = await getConnection()
        const query = `SELECT AppFunctionCode, GroupCode
            FROM ${app_db}.[dbo].${table} WHERE AppFunctionCode = '${AppFunctionCode}' AND GroupCode = '${GroupCode}'`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    },

    deleteByAppFunctionCodeAndGroupCode: async (AppFunctionCode: string, GroupCode: string) => {
        const pool = await getConnection()
        const query = `DELETE FROM ${app_db}.[dbo].${table} WHERE AppFunctionCode = '${AppFunctionCode}' AND GroupCode = '${GroupCode}'`
        await pool
            ?.request()
            .query(query)
    },

    deleteAllByGroupCode: async (GroupCode: string) => {
        const pool = await getConnection()
        const query = `DELETE FROM ${app_db}.[dbo].${table} WHERE GroupCode = '${GroupCode}'`
        await pool
            ?.request()
            .query(query)
    },

    listByAppFunctionCode: async (AppFunctionCode: string) => {
        const pool = await getConnection()
        const query = `SELECT AppFunctionCode, GroupCode
            FROM ${app_db}.[dbo].${table} WHERE AppFunctionCode = '${AppFunctionCode}'`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    },

    listByGroupCode: async (GroupCode: string) => {
        const pool = await getConnection()
        const query = `SELECT AppFunctionCode, GroupCode
            FROM ${app_db}.[dbo].${table} WHERE GroupCode = '${GroupCode}'`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    }
}

export default GroupAppFunctionsDao