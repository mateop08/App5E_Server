import { getConnection } from "../database/connection"
import appConfig from "../config"
const app_db = appConfig.app_db
const table = 'Users'

const UsersDao = {

    insert: async (UserCode: string,  Password: string, Name: string) => {
        const pool = await getConnection()
        const query = `INSERT INTO ${app_db}.[dbo].${table} (UserCode, Password, Name) VALUES ('${UserCode}', '${Password}', '${Name}')`
        await pool
            ?.request()
            .query(query)
    },

    getByUserCode: async (UserCode: string) => {
        const pool = await getConnection()
        const query = `SELECT UserCode, Name FROM ${app_db}.[dbo].${table} WHERE UserCode = '${UserCode}'`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    },

    getByCredentials: async (UserCode: string, Password: string) => {
        const pool = await getConnection()
        const query = `SELECT UserCode, Name FROM ${app_db}.[dbo].${table} WHERE UserCode = '${UserCode}' AND Password = '${Password}'`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    },

    updateByUserCode: async (UserCode: string,  Password: string, Name: string) => {
        const pool = await getConnection()
        const query = `UPDATE ${app_db}.[dbo].${table} SET Name = '${Name}', Password = '${Password}' WHERE UserCode = '${UserCode}'`
        await pool
            ?.request()
            .query(query)
    },

    deleteByUserCode: async (User: string) => {
        const pool = await getConnection()
        const query = `DELETE FROM ${app_db}.[dbo].${table} WHERE UserCode = '${User}'`
        await pool
            ?.request()
            .query(query)
    },

    listByName: async (Name: string) => {
        const pool = await getConnection()
        const query = `SELECT UserCode, Name FROM ${app_db}.[dbo].${table} WHERE Name LIKE '%${Name}%'`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    }
}

export default UsersDao