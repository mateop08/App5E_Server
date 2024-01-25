import { getConnection } from "../database/connection"
import appConfig from "../config"
const app_db = appConfig.app_db
const table = 'OrderAnnotationDetails'

const OrderAnnotationDetailsDao = {

    insert: async (insertData: {AnnotationId: number, FileName: string, Note: string, CreationDate: string, CreatedBy: string, ModificationDate: string | null, ModifiedBy: string | null}) => {
        const {AnnotationId, Note, CreationDate, CreatedBy, ModificationDate, ModifiedBy, FileName} = insertData
        const pool = await getConnection()
        const query = `INSERT INTO ${app_db}.[dbo].${table} 
        (AnnotationId, CreationDate, CreatedBy, ModificationDate, ModifiedBy, FileName, Note) 
        VALUES ('${AnnotationId}','${CreationDate}', '${CreatedBy}', ${ModificationDate}, ${ModifiedBy}, '${FileName}', '${Note}')`
        await pool
            ?.request()
            .query(query)
    },

    getById: async (EvidenceId: number) => {
        const pool = await getConnection()
        const query = `SELECT EvidenceId, AnnotationId, CreationDate, CreatedBy, ModificationDate, ModifiedBy, FileName, Note
        FROM ${app_db}.[dbo].${table} 
        WHERE EvidenceId = '${EvidenceId}'`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    },

    updateById: async (updateData: {EvidenceId: number, AnnotationId: number,
        CreationDate: string, CreatedBy: string, ModificationDate: string, ModifiedBy: string, FileName: string, Note: string}) => {
        
        const {EvidenceId, AnnotationId,
            CreationDate, CreatedBy, ModificationDate, ModifiedBy, FileName, Note} = updateData
        const pool = await getConnection()
        const query = `UPDATE ${app_db}.[dbo].${table} 
        SET AnnotationId = '${AnnotationId}',
        CreationDate = '${CreationDate}',
        CreatedBy = '${CreatedBy}',
        ModificationDate = '${ModificationDate}',
        ModifiedBy = '${ModifiedBy}',
        FileName = '${FileName}',
        Note = '${Note}'
        WHERE EvidenceId = '${EvidenceId}'`

        await pool
            ?.request()
            .query(query)
    },

    deleteByCode: async (EvidenceId: number) => {
        const pool = await getConnection()
        const query = `DELETE FROM ${app_db}.[dbo].${table} WHERE EvidenceId = '${EvidenceId}'`
        await pool
            ?.request()
            .query(query)
    },

    listByAnnotationId: async (AnnotationId: number) => {
        const pool = await getConnection()
        const query = `SELECT EvidenceId, AnnotationId, CreationDate, CreatedBy, ModificationDate, ModifiedBy, FileName, Note
        FROM ${app_db}.[dbo].${table} 
        WHERE AnnotationId = '${AnnotationId}'`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    }
}

export default OrderAnnotationDetailsDao