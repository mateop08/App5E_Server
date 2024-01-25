import { getConnection } from "../database/connection"
import appConfig from "../config"
const app_db = appConfig.app_db
const table = 'VehicleManufacters'

const VehicleManufactersDao = {

    insert: async (Description: string) => {
        const pool = await getConnection()
        const query = `INSERT INTO ${app_db}.[dbo].${table} (Description) VALUES ('${Description}')`
        await pool
            ?.request()
            .query(query)
    },

    getByManufacterId: async (ManufacterId: number) => {
        const pool = await getConnection()
        const query = `SELECT ManufacterId, Description FROM ${app_db}.[dbo].${table} WHERE ManufacterId = '${ManufacterId}'`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    },

    getByDescription: async (Description: string) => {
        const pool = await getConnection()
        const query = `SELECT ManufacterId, Description FROM ${app_db}.[dbo].${table} WHERE Description = '${Description}'`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    },

    updateByManufacterId: async (ManufacterId: number, Description: string) => {
        const pool = await getConnection()
        const query = `UPDATE ${app_db}.[dbo].${table} SET Description = '${Description}' WHERE ManufacterId = '${ManufacterId}'`
        await pool
            ?.request()
            .query(query)
    },

    deleteByManufacterId: async (ManufacterId: number) => {
        const pool = await getConnection()
        const query = `DELETE FROM ${app_db}.[dbo].${table} WHERE ManufacterId = '${ManufacterId}'`
        await pool
            ?.request()
            .query(query)
    },

    listByDescription: async (Description: string) => {
        const pool = await getConnection()
        const query = `SELECT ManufacterId, Description FROM ${app_db}.[dbo].${table} WHERE Description LIKE '%${Description}%'`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    }
}

export default VehicleManufactersDao