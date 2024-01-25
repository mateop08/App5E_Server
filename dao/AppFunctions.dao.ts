import { getConnection } from "../database/connection"
import appConfig from "../config"
const app_db = appConfig.app_db
const table = 'AppFunctions'

const AppFunctionsDao = {

    insert: async (Code: string,  Description: string, Method: string, Route: string, RequiresAuth: boolean) => {
        const pool = await getConnection()
        const query = `INSERT INTO ${app_db}.[dbo].${table} (Code, Description, Method, Route, RequiresAuth) 
            VALUES ('${Code}', '${Description}', '${Method}', '${Route}', '${RequiresAuth}')`
        await pool
            ?.request()
            .query(query)
    },

    getByCode: async (Code: string) => {
        const pool = await getConnection()
        const query = `SELECT Code, Description, Method, Route, RequiresAuth FROM ${app_db}.[dbo].${table} WHERE Code = '${Code}'`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    },

    getByMethodAndRoute: async (Method: string, Route: string) => {
        const pool = await getConnection()
        const query = `SELECT Code, Description, Method, Route, RequiresAuth FROM ${app_db}.[dbo].${table} 
            WHERE Method = '${Method}' AND Route = '${Route}'`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    },

    updateByCode: async (Code: string, Description: string, Method: string, Route: string, RequiresAuth: boolean) => {
        const pool = await getConnection()
        const query = `UPDATE ${app_db}.[dbo].${table} SET 
            Description = '${Description}',
            Method = '${Method}',
            Route = '${Route}',
            RequiresAuth = '${RequiresAuth}'
            WHERE Code = '${Code}'`
        await pool
            ?.request()
            .query(query)
    },

    deleteByCode: async (Code: string) => {
        const pool = await getConnection()
        const query = `DELETE FROM ${app_db}.[dbo].${table} WHERE Code = '${Code}'`
        await pool
            ?.request()
            .query(query)
    },

    listByDescription: async (Description: string) => {
        const pool = await getConnection()
        const query = `SELECT Code, Description, Method, Route, RequiresAuth FROM ${app_db}.[dbo].${table} WHERE Description LIKE '%${Description}%'`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    }
}

export default AppFunctionsDao