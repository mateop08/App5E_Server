import PaymentMethodGestor, { PaymentMethod } from "./PaymentMethod.model";
import { sql } from "../../database/connection";
import InvoicePaymentMethodDao, { MVCUADRE_InsertData } from "../../dao/Ofima/InvoicePaymentMethod.dao";
import { DateTime } from "luxon";
import { OfimaDocumentType } from "./OfimaDocumentType.model";
import { Customer } from "./Customer.model";
import VariablesGestor from "./Variables.model";
import CreditPortfolioGestor from "./CreditPortfolio.model";



export interface RegisterPaymentMethod {
    PaymentMethod: PaymentMethod,
    Value: number,
    Note: string,
}

export interface InvoicePaymentMethod extends RegisterPaymentMethod {
    OfimaDocumentType: OfimaDocumentType,
    Customer: Customer
    InvoiceNumber: number,
    CreationDate: DateTime,
    CreatedBy: string,
}

const InvoicePaymentMehtodGestor = {

    AdaptToInsert(invoicePaymentMethod: InvoicePaymentMethod) {
        const {PaymentMethod, CreationDate, OfimaDocumentType, CreatedBy, InvoiceNumber, Customer, Note, Value} = invoicePaymentMethod

        const otherDate = '1900-01-01'
        const adaptCreationDate = CreationDate.toSQLDate()
        if (adaptCreationDate === null) throw("Error no se pudo convertir la fecha a una fecha string SQL.")

        const adaptObject: MVCUADRE_InsertData = {
            BANCO: PaymentMethod.Account,
            CODBANCO: '0',
            CODPLAZA: '0',
            COMENTARIO: Note,
            CTACHEQUE: '0',
            DCTO: InvoiceNumber,
            FACTURA: InvoiceNumber,
            FECHACHQ: otherDate,
            FECHAMVTO: adaptCreationDate,
            FECING: adaptCreationDate,
            FECMOD: otherDate,
            MEDIOPAG: PaymentMethod.Code,
            NIT: Customer.Identification,
            NROCHEQUE: '0',
            PAGODATAF: '0',
            PASSWORDIN: CreatedBy,
            TIPODCTO: OfimaDocumentType.DocumentType,
            TIPODCTOFA: OfimaDocumentType.DocumentType,
            VALOR: Value
        }

        return adaptObject
    },

    async Create(invoicePaymentMethod: InvoicePaymentMethod, request: sql.Request) {
        const insertDate = this.AdaptToInsert(invoicePaymentMethod)
        await InvoicePaymentMethodDao.Insert(insertDate, request)
    },

    TransformFromPaymentMethodList(RegisterPaymentMethodList: RegisterPaymentMethod[], Customer: Customer,
        OfimaDocumentType: OfimaDocumentType, InvoiceNumber: number, User: string) {
        
        const today = DateTime.local()

        const InvoicePaymentMethodList = RegisterPaymentMethodList.map(
            (paymentMethod) => {
                const invoicePaymentMethod: InvoicePaymentMethod = {
                    ...paymentMethod,
                    OfimaDocumentType: OfimaDocumentType,
                    InvoiceNumber: InvoiceNumber,
                    Customer: Customer,
                    CreationDate: today,
                    CreatedBy: User
                }
                return invoicePaymentMethod
            }
        )

        return InvoicePaymentMethodList

    },

    validateExistsCredit(PaymentMethodList: RegisterPaymentMethod[]) {
        const exists = PaymentMethodList.some((register) => {
            const {PaymentMethod} = register
            if (PaymentMethod.Concept === '05') {
                return true
            } else {
                return false
            }
        })
        return exists
    },

    GetMainMethodFromList(PaymentMethodList: RegisterPaymentMethod[]) {
        let main = PaymentMethodList.find((register) => {
            const {PaymentMethod} = register
            if (PaymentMethod.Concept === '05') {
                return PaymentMethod
            } else {
                return
            }
        })

        if (main === undefined) {
            return PaymentMethodList[0]
        } else {
            return main
        }
    },

    GetTotalPaidFromList(PaymentMethodList: RegisterPaymentMethod[]) {
        return PaymentMethodList.reduce(
            (total, paymentMethod) => {
                return total + paymentMethod.Value
            },0)
    },

    async GenerateChange(ChangeValue: number, User: string) {
        const ChangeVariable = await VariablesGestor.GetByFieldAndUser('CPTOCAMBIO',User)
        const paymentMehtod = await PaymentMethodGestor.GetByCode(String(ChangeVariable.Value))
        const registerPayment: RegisterPaymentMethod = {
            PaymentMethod: paymentMehtod,
            Value: ChangeValue * -1,
            Note: 'Devuelta o Cambio'
        }

        return registerPayment
    },

    async ValidateCreditPortfolio(customer: Customer, PaymentMethodList: RegisterPaymentMethod[]) {
        const creditPortfolio = await CreditPortfolioGestor.GetByCustomer(customer)
        const PositiveCreditBalancePayment = PaymentMethodList.reduce(
            (total, p) => {
                if (p.PaymentMethod.Concept === '09') {
                    return total + p.Value
                } else {
                    return total
                }
            }, 0)
        if (Math.abs(creditPortfolio.CreditBalance) < PositiveCreditBalancePayment ) {
            throw(`No es posible guardar la factura, porque el saldo a favor del cliente ${customer.Identification} - ${customer.FullName}, es menor al registrado en la factura. 
            Saldo a favor en sistema: ${Math.abs(creditPortfolio.CreditBalance)}, saldo a favor registrado: ${PositiveCreditBalancePayment}`)
        }
    }
}

export default InvoicePaymentMehtodGestor