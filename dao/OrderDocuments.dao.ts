import { getConnection } from "../database/connection"
import appConfig from "../config"
const app_db = appConfig.app_db
const table = 'OrderDocuments'

const OrderDocumentsDao = {

    insert: async (insertData: {OrderDocument: string,  OrderNumber: number, DocumentCode: string, Description: string, CreationDate: string, CreatedBy: string, ModificationDate: string | null, ModifiedBy: string | null, FileName: string}) => {
        const {OrderDocument,  OrderNumber, DocumentCode, Description,
            CreationDate, CreatedBy, ModificationDate, ModifiedBy, FileName} = insertData
        const pool = await getConnection()
        const query = `INSERT INTO ${app_db}.[dbo].${table} 
        (OrderDocument,  OrderNumber, DocumentCode, Description, CreationDate, CreatedBy, ModificationDate, ModifiedBy, FileName) 
        VALUES ('${OrderDocument}', '${OrderNumber}', '${DocumentCode}', '${Description}',
        '${CreationDate}', '${CreatedBy}', ${ModificationDate}, ${ModifiedBy}, '${FileName}')`
        await pool
            ?.request()
            .query(query)
    },

    getById: async (Id: number) => {
        const pool = await getConnection()
        const query = `SELECT OrderDocument,  OrderNumber, 
        DocumentCode, Description, 
        CreationDate, CreatedBy, ModificationDate, ModifiedBy, Id
        FROM ${app_db}.[dbo].${table} 
        WHERE Id = '${Id}'`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    },

    updateById: async (updateData: {Id: number, DocumentCode: string, Description: string,
        CreationDate: string, CreatedBy: string, ModificationDate: string, ModifiedBy: string, FileName: string}) => {
        
        const {Id, DocumentCode, Description, 
            CreationDate, CreatedBy, ModificationDate, ModifiedBy, FileName} = updateData
        const pool = await getConnection()
        const query = `UPDATE ${app_db}.[dbo].${table} 
        SET DocumentCode = '${DocumentCode}',
        Description = '${Description}',
        CreationDate = '${CreationDate}',
        CreatedBy = '${CreatedBy}',
        ModificationDate = '${ModificationDate}',
        ModifiedBy = '${ModifiedBy}',
        FileName = '${FileName}'
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
        DocumentCode, Description,
        CreationDate, CreatedBy, ModificationDate, ModifiedBy, Id, FileName
        FROM ${app_db}.[dbo].${table} 
        WHERE OrderDocument = '${OrderDocument}' AND OrderNumber = '${OrderNumber}'`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    }
}

export default OrderDocumentsDao