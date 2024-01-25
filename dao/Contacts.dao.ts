import { getConnection } from "../database/connection"
import appConfig from "../config"
const app_db = appConfig.app_db
const table = 'Contacts'

const ContactsDao = {

    insert: async (Identification: string, FullName: string, ContactNumber:string, Email: string, Address: string) => {
        const pool = await getConnection()
        const query = `INSERT INTO ${app_db}.[dbo].${table} (Identification, FullName, ContactNumber, Email, Address) 
            VALUES ('${Identification}', '${FullName}', '${ContactNumber}', '${Email}', '${Address}')`
        await pool
            ?.request()
            .query(query)
    },

    getByIdentification: async (Identification: string) => {
        const pool = await getConnection()
        const query = `SELECT Identification, FullName, ContactNumber, Email, Address FROM ${app_db}.[dbo].${table} WHERE Identification = '${Identification}'`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    },

    updateByIdentification: async (Identification: string, FullName: string, ContactNumber:string, Email: string, Address: string) => {
        const pool = await getConnection()
        const query = `UPDATE ${app_db}.[dbo].${table} SET FullName = '${FullName}', ContactNumber = '${ContactNumber}'
            , Email = '${Email}', Address = '${Address}' WHERE Identification = '${Identification}'`
        await pool
            ?.request()
            .query(query)
    },

    deleteByIdentification: async (Identification: string) => {
        const pool = await getConnection()
        const query = `DELETE FROM ${app_db}.[dbo].${table} WHERE Identification = '${Identification}'`
        await pool
            ?.request()
            .query(query)
    },

    listByFullName: async (FullName: string) => {
        const pool = await getConnection()
        const query = `SELECT Identification, FullName, ContactNumber, Email, Address FROM ${app_db}.[dbo].${table} WHERE FullName LIKE '%${FullName}%'`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    }
}

export default ContactsDao