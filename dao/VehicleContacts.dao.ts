import { getConnection } from "../database/connection"
import appConfig from "../config"
const app_db = appConfig.app_db
const table = 'VehicleContacts'

const VehicleContactsDao = {

    insert: async (VehiclePlate: string, ContactId: string) => {
        const pool = await getConnection()
        const query = `INSERT INTO ${app_db}.[dbo].${table} (VehiclePlate, ContactId) 
            VALUES ('${VehiclePlate}', '${ContactId}')`
        await pool
            ?.request()
            .query(query)
    },

    getByVehiclePlateAndContactId: async (VehiclePlate: string, ContactId: string) => {
        const pool = await getConnection()
        const query = `SELECT VehiclePlate, ContactId
            FROM ${app_db}.[dbo].${table} WHERE VehiclePlate = '${VehiclePlate}' AND ContactId = ${ContactId}`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    },

    deleteByVehiclePlateAndContactId: async (VehiclePlate: string, ContactId: string) => {
        const pool = await getConnection()
        const query = `DELETE FROM ${app_db}.[dbo].${table} WHERE VehiclePlate = '${VehiclePlate}' AND ContactId = ${ContactId}`
        await pool
            ?.request()
            .query(query)
    },

    listByVehiclePlate: async (VehiclePlate: string) => {
        const pool = await getConnection()
        const query = `SELECT VehiclePlate, ContactId
            FROM ${app_db}.[dbo].${table} WHERE VehiclePlate = '${VehiclePlate}'`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    },

    listByContactId: async (ContactId: string) => {
        const pool = await getConnection()
        const query = `SELECT VehiclePlate, ContactId
            FROM ${app_db}.[dbo].${table} WHERE ContactId = '${ContactId}'`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    }
}

export default VehicleContactsDao