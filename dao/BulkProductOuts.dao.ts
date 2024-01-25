import { getConnection } from "../database/connection"
import appConfig from "../config"
const app_db = appConfig.app_db
const table = 'BulkProductOuts'

const BulkProductOutsDao = {

    adaptPossibleNullsForInsert (data: any) {
        if (data === null) return data
        else return `'${data}'`
    },

    async insert (insertData: {
            OpeningId: number, ProductCode: string,  WithDigitalDispenser: boolean, InitialNumber: number | null, 
            FinalNumber: number | null, Amount: number, RegistrationDate: string, RegisteredBy: string, ForServiceOrder: boolean, OrderProductId: number | null}) {
        const {OpeningId, ProductCode, WithDigitalDispenser, InitialNumber, FinalNumber, 
                Amount, RegistrationDate, RegisteredBy, ForServiceOrder, OrderProductId} = insertData
        
        const AdaptInitialNumber = this.adaptPossibleNullsForInsert(InitialNumber)
        const AdaptFinalNumber = this.adaptPossibleNullsForInsert(FinalNumber)
        const AdaptOrderProductId = this.adaptPossibleNullsForInsert(OrderProductId)
            
        const pool = await getConnection()
        const query = `INSERT INTO ${app_db}.[dbo].${table} 
            (OpeningId, ProductCode, WithDigitalDispenser, InitialNumber, FinalNumber, Amount, RegistrationDate, RegisteredBy, ForServiceOrder, OrderProductId) 
            VALUES ('${OpeningId}', '${ProductCode}', '${WithDigitalDispenser}', ${AdaptInitialNumber}, 
            ${AdaptFinalNumber}, '${Amount}', '${RegistrationDate}', '${RegisteredBy}', '${ForServiceOrder}', ${AdaptOrderProductId})`
        
        await pool
            ?.request()
            .query(query)
    },

    getById: async (OutId: number) => {
        const pool = await getConnection()
        const query = `SELECT OutId, OpeningId, ProductCode, WithDigitalDispenser, InitialNumber, FinalNumber, 
        Amount, RegistrationDate, RegisteredBy, ForServiceOrder, OrderProductId
            FROM ${app_db}.[dbo].${table} WHERE OutId = '${OutId}'`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    },

    listByOpeningId: async (OpeningId: number) => {
        const pool = await getConnection()
        const query = `SELECT OutId, OpeningId, ProductCode, WithDigitalDispenser, InitialNumber, FinalNumber, 
        Amount, RegistrationDate, RegisteredBy, ForServiceOrder, OrderProductId
            FROM ${app_db}.[dbo].${table} WHERE OpeningId = '${OpeningId}'`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    },

    listByOrderProductId: async (OrderProductId: number) => {
        const pool = await getConnection()
        const query = `SELECT OutId, OpeningId, ProductCode, WithDigitalDispenser, InitialNumber, FinalNumber, 
        Amount, RegistrationDate, RegisteredBy, ForServiceOrder, OrderProductId
            FROM ${app_db}.[dbo].${table} WHERE OrderProductId = '${OrderProductId}'`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    }
}

export default BulkProductOutsDao