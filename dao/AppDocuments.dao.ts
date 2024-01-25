import { getConnection } from "../database/connection"
import appConfig from "../config"
const app_db = appConfig.app_db
const table = 'AppDocuments'

const AppDocumentsDao = {

    insert: async (Code: string,  Description: string, Consecutive: number,  Store: string,  PriceCode: string, InventoryType: string, ServicesLine: string) => {
        const pool = await getConnection()
        const query = `INSERT INTO ${app_db}.[dbo].${table} (Code, Description, Consecutive, Store, PriceCode, InventoryType, ServicesLine) 
            VALUES ('${Code}', '${Description}', '${Consecutive}', '${Store}', '${PriceCode}', '${InventoryType}', '${ServicesLine}')`
        await pool
            ?.request()
            .query(query)
    },

    getByCode: async (Code: string) => {
        const pool = await getConnection()
        const query = `SELECT Code, Description, Consecutive, Store, PriceCode, InventoryType, ServicesLine FROM ${app_db}.[dbo].${table} WHERE Code = '${Code}'`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    },

    updateByCode: async (Code: string, Description: string, Consecutive: number,  Store: string,  PriceCode: string, InventoryType: string, ServicesLine: string) => {
        const pool = await getConnection()
        const query = `UPDATE ${app_db}.[dbo].${table} SET 
            Description = '${Description}', 
            Consecutive = '${Consecutive}',
            Store = '${Store}',
            PriceCode = '${PriceCode}',
            InventoryType = '${InventoryType}',
            ServicesLine = '${ServicesLine}'
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
        const query = `SELECT Code, Description, Consecutive, Store, PriceCode, InventoryType, ServicesLine FROM ${app_db}.[dbo].${table} WHERE Description LIKE '%${Description}%'`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    }
}

export default AppDocumentsDao