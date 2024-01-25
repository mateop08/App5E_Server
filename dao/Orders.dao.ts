import { getConnection } from "../database/connection"
import appConfig from "../config"
const app_db = appConfig.app_db
const table = 'Orders'

const OrdersDao = {

    insert: async (data: {Plate: string, Mileage: number, Quote: boolean, Diagnosis: boolean, Warranty: boolean, 
        Lubrication: boolean, Mechanics: boolean, Powertrain: boolean, CreationDate: string | null,
        ModificationDate: string | null, CreatedBy: string, ModifiedBy: string | null, 
        Open: boolean , VehicleDescription: string, ContactName: string, ContactNumber: string,
        PlateType: string, OrderDocument: string, ContactId: string, State: string, 
        OrderNumber: number, CardNumber: number, Annulled: boolean, ReceptionNote: string} ) => {
        const {Plate, Mileage, Quote, Diagnosis, Warranty, Lubrication, Mechanics, Powertrain, CreationDate,
            ModificationDate, CreatedBy, ModifiedBy, Open ,VehicleDescription, ContactName, ContactNumber,
            PlateType, OrderDocument, ContactId, State, OrderNumber, CardNumber, Annulled, ReceptionNote} = data
        
        
        const pool = await getConnection()
        const query = `INSERT INTO ${app_db}.[dbo].${table} 
            (Plate, Mileage, Quote, Diagnosis, Warranty, Lubrication, Mechanics, Powertrain,
            CreationDate, ModificationDate, CreatedBy, ModifiedBy, [Open], VehicleDescription,
            ContactName, ContactNumber, PlateType, OrderDocument, ContactId, State, OrderNumber, 
            CardNumber, Annulled, ReceptionNote)
            VALUES ('${Plate}','${Mileage}','${Quote}','${Diagnosis}','${Warranty}','${Lubrication}','${Mechanics}'
            ,'${Powertrain}','${CreationDate}',${ModificationDate},'${CreatedBy}',${ModifiedBy},'${Open}'
            ,'${VehicleDescription}','${ContactName}','${ContactNumber}','${PlateType}','${OrderDocument}'
            ,'${ContactId}','${State}','${OrderNumber}','${CardNumber}','${Annulled}','${ReceptionNote}')`
        //console.log(query)
        await pool
            ?.request()
            .query(query)
    },

    getByOrderDocumentAndOrderNumber: async (OrderDocument: string, OrderNumber: number) => {
        const pool = await getConnection()
        const query = `SELECT Plate, Mileage, Quote, Diagnosis, Warranty, Lubrication, Mechanics, Powertrain,
        CreationDate, ModificationDate, CreatedBy, ModifiedBy, [Open], VehicleDescription,
        ContactName, ContactNumber, PlateType, OrderDocument, ContactId, State, OrderNumber, 
        CardNumber, Annulled, AnnulledBy, AnnulledReason, ReceptionNote
        FROM ${app_db}.[dbo].${table} WHERE OrderDocument = '${OrderDocument}' AND OrderNumber = '${OrderNumber}'`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    },

    getOpenOrderByPlate: async(Plate: string) => {
        const pool = await getConnection()
        const query = `SELECT Plate, Mileage, Quote, Diagnosis, Warranty, Lubrication, Mechanics, Powertrain,
        CreationDate, ModificationDate, CreatedBy, ModifiedBy, [Open], VehicleDescription,
        ContactName, ContactNumber, PlateType, OrderDocument, ContactId, State, OrderNumber, 
        CardNumber, Annulled, ReceptionNote
        FROM ${app_db}.[dbo].${table} WHERE Plate = '${Plate}' AND [OPEN] = 'TRUE' `
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    },

    updateByOrderDocumentAndOrderNumber: async ({
            OrderDocument, OrderNumber, Plate, Mileage, Quote, Diagnosis, Warranty, Lubrication, 
            Mechanics, Powertrain, CreationDate,ModificationDate, CreatedBy, ModifiedBy, 
            Open,VehicleDescription, ContactName, ContactNumber,PlateType, ContactId, State, CardNumber, ReceptionNote}:
            {
            OrderDocument: string, 
            OrderNumber: number, 
            Plate: string, 
            Mileage: number, 
            Quote: boolean, 
            Diagnosis: boolean, 
            Warranty: boolean, 
            Lubrication: boolean, 
            Mechanics: boolean, 
            Powertrain: boolean, 
            CreationDate: string | null,
            ModificationDate: string | null, 
            CreatedBy: string | null, 
            ModifiedBy: string | null, 
            Open: boolean,
            VehicleDescription: string, 
            ContactName: string, 
            ContactNumber: string,
            PlateType: string, 
            ContactId: string, 
            State: string, 
            CardNumber: number,
            ReceptionNote: string}) => {

        const pool = await getConnection()
        const query = `UPDATE ${app_db}.[dbo].${table} SET 
        Plate = '${Plate}'
        ,Mileage = '${Mileage}'
        ,Quote = '${Quote}'
        ,Diagnosis = '${Diagnosis}'
        ,Warranty = '${Warranty}'
        ,Lubrication = '${Lubrication}'
        ,Mechanics = '${Mechanics}'
        ,Powertrain = '${Powertrain}'
        ,CreationDate = '${CreationDate}'
        ,ModificationDate = '${ModificationDate}'
        ,CreatedBy = '${CreatedBy}'
        ,ModifiedBy = '${ModifiedBy}'
        ,[Open] = '${Open}'
        ,VehicleDescription = '${VehicleDescription}'
        ,ContactName = '${ContactName}'
        ,ContactNumber = '${ContactNumber}'
        ,PlateType = '${PlateType}'
        ,ContactId = '${ContactId}'
        ,State = '${State}'
        ,CardNumber = '${CardNumber}'
        ,ReceptionNote = '${ReceptionNote}'
        WHERE OrderDocument = '${OrderDocument}' AND OrderNumber = '${OrderNumber}'`
        await pool
            ?.request()
            .query(query)
    },

    deleteByByOrderDocumentAndOrderNumber: async (OrderDocument: string, OrderNumber: number) => {
        const pool = await getConnection()
        const query = `DELETE FROM ${app_db}.[dbo].${table} WHERE OrderDocument = '${OrderDocument}' AND OrderNumber = '${OrderNumber}'`
        await pool
            ?.request()
            .query(query)
    },

    listOpenOrdersByOrderDocument: async (OrderDocument: string) => {
        const pool = await getConnection()
        const query = `SELECT Plate, Mileage, Quote, Diagnosis, Warranty, Lubrication, Mechanics, Powertrain,
        CreationDate, ModificationDate, CreatedBy, ModifiedBy, [Open], VehicleDescription,
        ContactName, ContactNumber, PlateType, OrderDocument, ContactId, State, OrderNumber, CardNumber, Annulled, ReceptionNote 
        FROM ${app_db}.[dbo].${table} WHERE [Open] = 'TRUE' AND OrderDocument = '${OrderDocument}'`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    },

    listByFilters: async (data: {OrderDocument: string, Plate: string, Lubrication: boolean, Mechanics: boolean, Powertrain: boolean,  
        Quote: boolean, Diagnosis: boolean, Warranty: boolean, Open: boolean | null, State: string | null,
        InitialDate: string | null, FinalDate: string | null}) => {
        
        const {OrderDocument, Plate, Lubrication, Mechanics, Powertrain,  
            Quote, Diagnosis, Warranty, Open, State,
            InitialDate, FinalDate} = data
        
        const pool = await getConnection()
        const query = `SELECT Plate, Mileage, Quote, Diagnosis, Warranty, Lubrication, Mechanics, Powertrain,
        CreationDate, ModificationDate, CreatedBy, ModifiedBy, [Open], VehicleDescription,
        ContactName, ContactNumber, PlateType, OrderDocument, ContactId, State, OrderNumber, CardNumber, Annulled, ReceptionNote
        FROM ${app_db}.[dbo].${table} WHERE 
        OrderDocument = '${OrderDocument}' AND
        Plate LIKE '%${Plate}%'
        ${Lubrication ? `AND Lubrication = 'TRUE'`  : ''}
        ${Mechanics ? `AND Mechanics = 'TRUE'`  : ''}
        ${Powertrain ? `AND Powertrain = 'TRUE'`  : ''}
        ${Quote ? `AND Quote = 'TRUE'`  : ''}
        ${Diagnosis ? `AND Diagnosis = 'TRUE'`  : ''}
        ${Warranty ? `AND Warranty = 'TRUE'`  : ''}
        ${State !== null ? `AND State = '${State}'`  : ''}
        ${Open !== null ? `AND [Open] = '${Open}'`  : ''}
        ${InitialDate !== null ? `AND CreationDate >= '${InitialDate}'`  : ''}
        ${FinalDate !== null ? `AND CreationDate <= '${FinalDate}'`  : ''}`

        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    },

    closeOrder: async (OrderDocument: string, OrderNumber: number) => {
        const pool = await getConnection()
        const query = `UPDATE ${app_db}.[dbo].${table} SET [OPEN] = 'FALSE' WHERE OrderDocument = '${OrderDocument}' AND OrderNumber = '${OrderNumber}'`
        await pool
            ?.request()
            .query(query)
    },

    annullOrder: async (OrderDocument: string, OrderNumber: number, User: String, AnnulledReason: string) => {
        const pool = await getConnection()
        const query = `UPDATE ${app_db}.[dbo].${table} SET 
        [Open] = 'FALSE',
        Annulled = 'TRUE',
        AnnulledBy = '${User}',
        AnnulledReason = '${AnnulledReason}'
        WHERE OrderDocument = '${OrderDocument}' AND OrderNumber = '${OrderNumber}'`
        await pool
            ?.request()
            .query(query)
    },

    setInvoiceData: async (OrderDocument: string, OrderNumber: number, User: String, InvoiceDocumentType: string,
            InvoiceDocumentNumber: number, InvoicingDate: string) => {
        const pool = await getConnection()
        const query = `UPDATE ${app_db}.[dbo].${table} SET 
        InvoiceDocumentType = '${InvoiceDocumentType}',
        InvoiceDocumentNumber = '${InvoiceDocumentNumber}',
        InvoicingDate = '${InvoicingDate}',
        InvoicedBy = '${User}'
        WHERE OrderDocument = '${OrderDocument}' AND OrderNumber = '${OrderNumber}'`
        await pool
            ?.request()
            .query(query)
    }
}

export default OrdersDao