import { getConnection } from "../database/connection"
import appConfig from "../config"
const app_db = appConfig.app_db
const table = 'BulkProductOpenings'

const BulkProductOpeningsDao = {

    adaptPossibleNullsForInsert (data: any) {
        if (data === null) return data
        else return `'${data}'`
    },

    async insert  (insertData: {
            ProductCode: string,  Active: boolean, OpenDate: string, 
            OpenedBy: string, CloseDate: string | null, ClosedBy: string | null, 
            LeftOverAmount: number} ) {
        const {ProductCode, Active, OpenDate, OpenedBy, CloseDate, ClosedBy, LeftOverAmount} = insertData

        const adaptCloseDate = this.adaptPossibleNullsForInsert(CloseDate)
        const adaptClosedBy = this.adaptPossibleNullsForInsert(ClosedBy)

        const pool = await getConnection()
        const query = `INSERT INTO ${app_db}.[dbo].${table} 
            (ProductCode, Active, OpenDate, OpenedBy, CloseDate, ClosedBy, LeftOverAmount) 
            VALUES ('${ProductCode}', '${Active}', '${OpenDate}', '${OpenedBy}', 
            ${adaptCloseDate}, ${adaptClosedBy}, '${LeftOverAmount}')`
        await pool
            ?.request()
            .query(query)
    },

    getById: async (OpeningId: number) => {
        const pool = await getConnection()
        const query = `SELECT OpeningId, ProductCode, Active, OpenDate, OpenedBy, CloseDate, ClosedBy, LeftOverAmount 
            FROM ${app_db}.[dbo].${table} WHERE OpeningId = '${OpeningId}'`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    },

    updateByOpeningId: async (updateData: {
        OpeningId: number, ProductCode: string,  Active: boolean, OpenDate: string, 
        OpenedBy: string, CloseDate: string | null, ClosedBy: string | null, 
        LeftOverAmount: number}) => {

        const {OpeningId, ProductCode, Active, OpenDate, OpenedBy, CloseDate, ClosedBy, LeftOverAmount} = updateData
        
        const pool = await getConnection()
        const query = `UPDATE ${app_db}.[dbo].${table} 
        SET ProductCode = '${ProductCode}',
        Active = '${Active}',
        OpenDate = '${OpenDate}',
        OpenedBy = '${OpenedBy}',
        CloseDate = '${CloseDate}',
        ClosedBy = '${ClosedBy}',
        LeftOverAmount = '${LeftOverAmount}'
        WHERE OpeningId = '${OpeningId}'`
        await pool
            ?.request()
            .query(query)
    },

    listActives: async () => {
        const pool = await getConnection()
        const query = `SELECT OpeningId, ProductCode, Active, OpenDate, OpenedBy, CloseDate, ClosedBy, LeftOverAmount 
            FROM ${app_db}.[dbo].${table} WHERE Active = 'TRUE'`
        
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    },

    listAll: async () => {
        const pool = await getConnection()
        const query = `SELECT OpeningId, ProductCode, Active, OpenDate, OpenedBy, CloseDate, ClosedBy, LeftOverAmount 
            FROM ${app_db}.[dbo].${table}`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    }
}

export default BulkProductOpeningsDao