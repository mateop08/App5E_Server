import { getConnection } from "../database/connection"
import appConfig from "../config"
const app_db = appConfig.app_db
const table = 'OrderAnnotations'

const OrderAnnotationsDao = {

    insert: async (insertData: {OrderDocument: string,  OrderNumber: number, AnnotationCode: string, Description: string, TechnicianCode: string, Note: string, CreationDate: string, CreatedBy: string, ModificationDate: string | null, ModifiedBy: string | null}) => {
        const {OrderDocument,  OrderNumber, AnnotationCode, Description, TechnicianCode, Note,
            CreationDate, CreatedBy, ModificationDate, ModifiedBy} = insertData
        const pool = await getConnection()
        const query = `INSERT INTO ${app_db}.[dbo].${table} 
        (OrderDocument,  OrderNumber, AnnotationCode, Description, TechnicianCode, Note, CreationDate, CreatedBy, ModificationDate, ModifiedBy) 
        VALUES ('${OrderDocument}', '${OrderNumber}', '${AnnotationCode}', '${Description}','${TechnicianCode}','${Note}',
        '${CreationDate}', '${CreatedBy}', ${ModificationDate}, ${ModifiedBy})`
        await pool
            ?.request()
            .query(query)
    },

    getById: async (Id: number) => {
        const pool = await getConnection()
        const query = `SELECT OrderDocument,  OrderNumber, 
        AnnotationCode, Description, TechnicianCode, Note, 
        CreationDate, CreatedBy, ModificationDate, ModifiedBy, Id
        FROM ${app_db}.[dbo].${table} 
        WHERE Id = '${Id}'`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    },

    updateById: async (updateData: {Id: number, AnnotationCode: string, Description: string, TechnicianCode: string, Note: string,
        CreationDate: string, CreatedBy: string, ModificationDate: string, ModifiedBy: string}) => {
        
        const {Id, AnnotationCode, Description, TechnicianCode, Note,
            CreationDate, CreatedBy, ModificationDate, ModifiedBy} = updateData
        const pool = await getConnection()
        const query = `UPDATE ${app_db}.[dbo].${table} 
        SET AnnotationCode = '${AnnotationCode}',
        Description = '${Description}',
        TechnicianCode = '${TechnicianCode}',
        Note = '${Note}',
        CreationDate = '${CreationDate}',
        CreatedBy = '${CreatedBy}',
        ModificationDate = '${ModificationDate}',
        ModifiedBy = '${ModifiedBy}'
        WHERE Id = '${Id}'`
        await pool
            ?.request()
            .query(query)
    },

    deleteByCode: async (Id: number) => {
        const pool = await getConnection()
        const query = `DELETE FROM ${app_db}.[dbo].${table} WHERE Id = '${Id}'`
        await pool
            ?.request()
            .query(query)
    },

    listByOrder: async (OrderDocument: string, OrderNumber: number) => {
        const pool = await getConnection()
        const query = `SELECT OrderDocument,  OrderNumber, 
        AnnotationCode, Description, TechnicianCode, Note,
        CreationDate, CreatedBy, ModificationDate, ModifiedBy, Id
        FROM ${app_db}.[dbo].${table} 
        WHERE OrderDocument = '${OrderDocument}' AND OrderNumber = '${OrderNumber}'`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    }
}

export default OrderAnnotationsDao