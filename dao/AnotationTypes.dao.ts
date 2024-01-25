import { getConnection, sql } from "../database/connection"
import appConfig from "../config"
const app_db = appConfig.app_db

const AnnotationTypeDao = {

    insert: async (Code: string,  Description: string) => {
        const pool = await getConnection()
        const query = `INSERT INTO ${app_db}.[dbo].AnnotationTypes (Code, Description) VALUES ('${Code}', '${Description}')`
        await pool
            ?.request()
            .query(query)
    },

    getByCode: async (Code: string) => {
        const pool = await getConnection()
        const query = `SELECT Code, Description FROM ${app_db}.[dbo].[AnnotationTypes] WHERE Code = '${Code}'`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    },

    updateByCode: async (Code: string, Description: string) => {
        const pool = await getConnection()
        const query = `UPDATE ${app_db}.[dbo].[AnnotationTypes] SET Description = '${Description}' WHERE Code = '${Code}'`
        await pool
            ?.request()
            .input("Code",sql.Char(5),Code)
            .input("Description",sql.VarChar(100),Description)
            .query(query)
    },

    deleteByCode: async (Code: string) => {
        const pool = await getConnection()
        const query = `DELETE FROM ${app_db}.[dbo].[AnnotationTypes] WHERE Code = '${Code}'`
        await pool
            ?.request()
            .input("Code",sql.Char(5),Code)
            .query(query)
    },

    listByDescription: async (Description: string) => {
        const pool = await getConnection()
        const query = `SELECT Code, Description FROM ${app_db}.[dbo].[AnnotationTypes] WHERE Description LIKE '%${Description}%'`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    }
}

export default AnnotationTypeDao