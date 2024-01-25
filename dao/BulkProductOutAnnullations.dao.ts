import { getConnection } from "../database/connection"
import appConfig from "../config"
const app_db = appConfig.app_db
const table = 'BulkProductOutAnnullations'

const BulkProductOutAnnullationsDao = {

    async insert (insertData: {
            OutId: number, ProductCode: string, Amount: number, RegistrationDate: string, RegisteredBy: string, AnnulledReason: string}) {

        const {OutId, ProductCode, Amount, RegistrationDate, RegisteredBy, AnnulledReason} = insertData
        
        const pool = await getConnection()
        const query = `INSERT INTO ${app_db}.[dbo].${table} 
            (OutId, ProductCode, Amount, RegistrationDate, RegisteredBy, AnnulledReason) 
            VALUES ('${OutId}', '${ProductCode}', '${Amount}', '${RegistrationDate}', '${RegisteredBy}', '${AnnulledReason}')`
        await pool
            ?.request()
            .query(query)
    },

    getByAnnulationId: async (AnnullationId: number) => {
        const pool = await getConnection()
        const query = `SELECT AnnullationId, OutId, ProductCode, Amount, RegistrationDate, RegisteredBy, AnnulledReason
            FROM ${app_db}.[dbo].${table} WHERE AnnullationId = '${AnnullationId}'`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    },

    listByOutId: async (OutId: number) => {
        const pool = await getConnection()
        const query = `SELECT AnnullationId, OutId, ProductCode, Amount, RegistrationDate, RegisteredBy, AnnulledReason
            FROM ${app_db}.[dbo].${table} WHERE OutId = '${OutId}'`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    }
}

export default BulkProductOutAnnullationsDao