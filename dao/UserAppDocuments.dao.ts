import { getConnection } from "../database/connection"
import appConfig from "../config"
const app_db = appConfig.app_db
const table = 'UserAppDocuments'

const UserAppDocumentsDao = {

    insert: async (UserCode: string, DocumentCode: string) => {
        const pool = await getConnection()
        const query = `INSERT INTO ${app_db}.[dbo].${table} (UserCode, DocumentCode) 
            VALUES ('${UserCode}', '${DocumentCode}')`
        await pool
            ?.request()
            .query(query)
    },

    getByUserCodeAndDocumentCode: async (UserCode: string, DocumentCode: string) => {
        const pool = await getConnection()
        const query = `SELECT UserCode, DocumentCode
            FROM ${app_db}.[dbo].${table} WHERE UserCode = '${UserCode}' AND DocumentCode = '${DocumentCode}'`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    },

    deleteByUserCodeAndDocumentCode: async (UserCode: string, DocumentCode: string) => {
        const pool = await getConnection()
        const query = `DELETE FROM ${app_db}.[dbo].${table} WHERE UserCode = '${UserCode}' AND DocumentCode = '${DocumentCode}'`
        await pool
            ?.request()
            .query(query)
    },

    deleteAllByUserCode: async (UserCode: string) => {
        const pool = await getConnection()
        const query = `DELETE FROM ${app_db}.[dbo].${table} WHERE UserCode = '${UserCode}'`
        await pool
            ?.request()
            .query(query)
    },

    listByUserCode: async (UserCode: string) => {
        const pool = await getConnection()
        const query = `SELECT UserCode, DocumentCode
            FROM ${app_db}.[dbo].${table} WHERE UserCode = '${UserCode}'`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    },

    listByDocumentCode: async (DocumentCode: string) => {
        const pool = await getConnection()
        const query = `SELECT UserCode, DocumentCode
            FROM ${app_db}.[dbo].${table} WHERE DocumentCode = '${DocumentCode}'`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    }
}

export default UserAppDocumentsDao