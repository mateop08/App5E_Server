import { getConnection } from "../database/connection"
import appConfig from "../config"
const app_db = appConfig.app_db
const table = 'UserAssignedGroups'

const UserAssignedGroupsDao = {

    insert: async (UserCode: string, GroupCode: string) => {
        const pool = await getConnection()
        const query = `INSERT INTO ${app_db}.[dbo].${table} (UserCode, GroupCode) 
            VALUES ('${UserCode}', '${GroupCode}')`
        await pool
            ?.request()
            .query(query)
    },

    getByUserCodeAndGroupCode: async (UserCode: string, GroupCode: string) => {
        const pool = await getConnection()
        const query = `SELECT UserCode, GroupCode
            FROM ${app_db}.[dbo].${table} WHERE UserCode = '${UserCode}' AND GroupCode = '${GroupCode}'`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    },

    deleteByUserCodeAndGroupCode: async (UserCode: string, GroupCode: string) => {
        const pool = await getConnection()
        const query = `DELETE FROM ${app_db}.[dbo].${table} WHERE UserCode = '${UserCode}' AND GroupCode = '${GroupCode}'`
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
        const query = `SELECT UserCode, GroupCode
            FROM ${app_db}.[dbo].${table} WHERE UserCode = '${UserCode}'`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    },

    listByGroupCode: async (GroupCode: string) => {
        const pool = await getConnection()
        const query = `SELECT UserCode, GroupCode
            FROM ${app_db}.[dbo].${table} WHERE GroupCode = '${GroupCode}'`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    }
}

export default UserAssignedGroupsDao