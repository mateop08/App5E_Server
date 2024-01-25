import { getConnection } from "../database/connection"
import appConfig from "../config"
const app_db = appConfig.app_db
const table = 'VehicleMemberships'

const VehicleMembershipsDao = {

    insert: async (Plate: string, MembershipTypeCode: string, CardNumber: number, Active: boolean, ContactId: string, RegistrationDate: string) => {
        const pool = await getConnection()
        const query = `INSERT INTO ${app_db}.[dbo].${table} (Plate, MembershipTypeCode, CardNumber, Active, ContactId, RegistrationDate) 
            VALUES ('${Plate}', '${MembershipTypeCode}', '${CardNumber}', '${Active}', '${ContactId}', '${RegistrationDate}')`
        await pool
            ?.request()
            .query(query)
    },

    getByCardNumber: async (CardNumber: number) => {
        const pool = await getConnection()
        const query = `SELECT RTRIM(Plate) AS Plate, MembershipTypeCode, CardNumber, Active, ContactId, RegistrationDate
            FROM ${app_db}.[dbo].${table} WHERE CardNumber = '${CardNumber}'`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    },

    getActiveMembershipByPlate: async (Plate: string) => {
        const pool = await getConnection()
        const query = `SELECT Plate, MembershipTypeCode, CardNumber, Active, ContactId, RegistrationDate
            FROM ${app_db}.[dbo].${table} WHERE Plate = '${Plate}' AND ACTIVE = 'TRUE'`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    },

    deleteByCardNumber: async (CardNumber: number) => {
        const pool = await getConnection()
        const query = `DELETE FROM ${app_db}.[dbo].${table} WHERE CardNumber = '${CardNumber}'`
        await pool
            ?.request()
            .query(query)
    },

    listByPlate: async (VehiclePlate: string) => {
        const pool = await getConnection()
        const query = `SELECT Plate, MembershipTypeCode, CardNumber, Active, ContactId, RegistrationDate
            FROM ${app_db}.[dbo].${table} WHERE Plate = '${VehiclePlate}'`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    },

    listByContactId: async (ContactId: string) => {
        const pool = await getConnection()
        const query = `SELECT Plate, MembershipTypeCode, CardNumber, Active, ContactId, RegistrationDate
            FROM ${app_db}.[dbo].${table} WHERE ContactId = '${ContactId}'`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    },

    activate: async (CardNumber: number) => {
        const pool = await getConnection()
        const query = `UPDATE ${app_db}.[dbo].${table} SET Active = 'TRUE' WHERE CardNumber = '${CardNumber}'`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    },

    deactivate: async (CardNumber: number) => {
        const pool = await getConnection()
        const query = `UPDATE ${app_db}.[dbo].${table} SET Active = 'FALSE' WHERE CardNumber = '${CardNumber}'`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    },
}

export default VehicleMembershipsDao