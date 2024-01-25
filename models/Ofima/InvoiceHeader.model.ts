import { Customer } from "./Customer.model";
import { Order } from "../Orders.model";
import InvoiceHeaderDao, { TRADE_InsertData } from "../../dao/Ofima/InvoiceHeader.dao";
import { OfimaDocumentType } from "./OfimaDocumentType.model";
import { sql } from "../../database/connection";
import { DateTime } from "luxon";
import { CashRegister } from "./CashRegister.model";
import { CostCenter } from "./CostCenter.model";
import { PaymentMethod } from "./PaymentMethod.model";
import VariablesGestor from "./Variables.model";

export interface InvoiceHeader {
    
    OfimaDocumentType: OfimaDocumentType,
    InvoiceNumber: number,
    Customer: Customer,
    CostCenter: CostCenter
    CreationDate: DateTime,
    CashRegister: CashRegister,
    InstantPayment: boolean,
    VehiclePlate: string,
    Mileage: number,
    PaymentMethod: PaymentMethod,
    Seller: string,
    TotalWithOutTaxes: number,
    TaxTotal: number,
    User: string
}

const InvoiceHeaderGestor = {

    async adaptToInsert(invoiceHeader: InvoiceHeader) {
        const {Customer, OfimaDocumentType, CreationDate, CashRegister, CostCenter, InvoiceNumber,
            VehiclePlate, Mileage, PaymentMethod, Seller, User, TotalWithOutTaxes, TaxTotal} = invoiceHeader
        
        const otherDate = '1900-01-01'
        const adaptCreationDate = CreationDate.toSQLDate()
        const adaptHour = String(CreationDate.toFormat('hh:mm:ss'))
        if (adaptCreationDate === null) throw("Error no se pudo convertir la fecha a una fecha string SQL.")
        if (adaptHour === null) throw("Error no se pudo convertir la fecha a una hora string SQL.")
        
        const DECIMALES = Number((await VariablesGestor.GetByField('REDONPVTA')).Value)
        const PGIVA = Number((await VariablesGestor.GetByField('IVA')).Value)
        const FACTORSUS = 100 - PGIVA

        const adaptObject: TRADE_InsertData = {
            ACTIVA: 0,
            BRUTO: TotalWithOutTaxes,
            CAJAREG: CashRegister.Code,
            CIUDADCLI: Customer.City,
            CODCC: CostCenter.Code,
            CODIGOCTA: PaymentMethod.Account,
            CODINT: OfimaDocumentType.IntegrationCode,
            CODRETE: Customer.WithHoldingTax.Code,
            CODVEN: Seller,
            CONSFECHA: otherDate,
            CONTADO: invoiceHeader.InstantPayment ? 1 : 0,
            CTRLCORIG: 1,
            CTRTOPES: 1,
            DECIMALES: DECIMALES,
            DIR: Customer.Address,
            FACTORSUS: FACTORSUS,
            FECCAJA: otherDate,
            FECHA: adaptCreationDate,
            FECHA1: adaptCreationDate,
            FECHA2: adaptCreationDate,
            FECHA3: adaptCreationDate,
            FECHAING: otherDate,
            FECHAMOD: otherDate,
            FECHANIF: otherDate,
            FECHAPANTE: otherDate,
            FECING: adaptCreationDate,
            FECMOD: adaptCreationDate,
            FHAUTORIZA: otherDate,
            FISRL: otherDate,
            FIVA: otherDate,
            FLLAMADA: otherDate,
            FRECAUDO: otherDate,
            HORA: adaptHour,
            IVABRUTO: TaxTotal,
            MEDIOPAG: PaymentMethod.Code,
            MEFECHAT: otherDate,
            NIT: Customer.Identification,
            NOTA: VehiclePlate,
            NRODCTO: InvoiceNumber,
            ORDEN: '',
            ORIGEN: OfimaDocumentType.Origin,
            PASSWORDIN: User,
            PGIVA: PGIVA,
            PRIORIDAD: 0,
            REMISION: '',
            RESPRETE: 0,
            TIPODCTO: OfimaDocumentType.DocumentType,
            TIPOMVTO: OfimaDocumentType.MovementType.Code,
            TIPOPER: Customer.PersonType,
            TIPOVTA: String((await VariablesGestor.GetByField('TIPOVTAPV')).Value),
            TOPE: Customer.WithHoldingTax.Top,
            TRANSPORTA: String(Mileage),
            UNDTRIBU: Number((await VariablesGestor.GetByField('UNDTRIBU')).Value)
        }
        return adaptObject
    },

    async Create(invoiceHeader: InvoiceHeader, request: sql.Request) {
        const adaptObject = await this.adaptToInsert(invoiceHeader)
        await InvoiceHeaderDao.Insert(adaptObject, request)
    },

    Construct(order: Order, OfimaDocumentType: OfimaDocumentType, InvoiceNumber: number, 
            Customer: Customer, CostCenter: CostCenter, CashRegister: CashRegister, InstantPayment: boolean,
            PaymentMethod: PaymentMethod, TotalWithOutTaxes: number, TaxTotal: number, User: string, Seller: string) {

        const today = DateTime.local()
        const invoiceHeader: InvoiceHeader = {
            OfimaDocumentType: OfimaDocumentType,
            InvoiceNumber: InvoiceNumber,
            Customer: Customer,
            CostCenter: CostCenter,
            CreationDate: today,
            CashRegister: CashRegister,
            InstantPayment: InstantPayment,
            VehiclePlate: order.Vehicle.Plate,
            Mileage: order.Mileage,
            PaymentMethod: PaymentMethod,
            Seller: Seller,
            TotalWithOutTaxes: TotalWithOutTaxes,
            TaxTotal: TaxTotal,
            User: User
        }
        return invoiceHeader
        
    }
}

export default InvoiceHeaderGestor