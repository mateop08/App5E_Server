import InvoiceHeaderGestor, { InvoiceHeader } from "./InvoiceHeader.model";
import InvoiceLineGestor, { InvoiceLine } from "./InvoiceLine.model";
import InvoicePaymentMehtodGestor, { InvoicePaymentMethod } from "./InvoicePaymentMethod.model";
import { sql, getConnection } from "../../database/connection";
import appConfig from "../../config"
import OfimaDocumentTypeGestor from "./OfimaDocumentType.model";
import CustomerGestor from "./Customer.model"
import { RegisterPaymentMethod } from "./InvoicePaymentMethod.model";
import CashRegisterGestor from "./CashRegister.model";
import CostCenterGestor from "./CostCenter.model";
import OrderGestor from "../Orders.model";
import OrderProductGestor from "../OrderProducts.model";
import OrderServiceGestor from "../OrderServices.model";
import StoreGestor from "./Store.model";
import UserGestor from "../Users.model";
import OrderStateGestor from "../OrderStates.model";

interface Invoice {
    InvoiceHeader: InvoiceHeader,
    InvoiceLines: InvoiceLine[],
    InvoicePaymentMethods: InvoicePaymentMethod[]
}

const InvoiceGestor = {

    Construct(InvoiceHeader: InvoiceHeader, InvoiceLines: InvoiceLine[], InvoicePaymentMethods: InvoicePaymentMethod[]) {
        const invoice: Invoice = {
            InvoiceHeader: InvoiceHeader,
            InvoiceLines: InvoiceLines,
            InvoicePaymentMethods: InvoicePaymentMethods
        }
        return invoice
    },

    async Make(invoice: Invoice) {
        
        const pool = await getConnection();
        const transaction = new sql.Transaction(pool);
        try {
            await transaction.begin();
            const request = new sql.Request(transaction);
            const {InvoiceHeader, InvoiceLines, InvoicePaymentMethods} = invoice
            await InvoiceHeaderGestor.Create(InvoiceHeader, request)
            for (const line of InvoiceLines) {
                await InvoiceLineGestor.Create(line, request)
            }
            
            for (const payment of InvoicePaymentMethods) {
                await InvoicePaymentMehtodGestor.Create(payment, request)
            }
            
            await this.AutomaticPayment(invoice, request)
            
            await transaction.commit();
        } catch (err: any) {
            const triggerError = err?.precedingErrors[0]
            if (triggerError !== undefined) {
                const messageError = triggerError.message
                throw(messageError)
            }
            try {
                await transaction.rollback();
            } catch (error) {}
            throw err;
        } finally {
            await pool.close();
        }
    },

    async AutomaticPayment(invoice: Invoice, request: sql.Request) {
        const {InvoiceHeader} = invoice
        const {OfimaDocumentType: {DocumentType, MasterDocument}, InvoiceNumber} = InvoiceHeader
        const procedure = `${appConfig.ofima_db}.[dbo].OF_SP_AbonoAutomaticoPV '${InvoiceNumber}','${DocumentType}','${0}','${MasterDocument}'`
        await request.query(procedure)
    },

    async Create(OrderDocument: string, OrderNumber: number, ConsecutiveCode: string, 
        CustomerId: string, Store: string, PaymentMethodsList: RegisterPaymentMethod[], 
        CashRegisterCode: string, CostCenterCode: string, Seller: string, User: string) {
        
        const userInstance = await UserGestor.GetByUserCode(User)
        const order = await OrderGestor.GetByDocumentAndNumber(OrderDocument, OrderNumber)
        OrderGestor.ValidateAccess(order)
        
        const ofimaDocumentType = await OfimaDocumentTypeGestor.GetByInvoiceConsecutiveCode(ConsecutiveCode)
        const customer = await CustomerGestor.GetByIdentification(CustomerId)
        const cashRegister = await CashRegisterGestor.GetByCode(CashRegisterCode)
        const costCenter = await CostCenterGestor.GetByCode(CostCenterCode)

        if (! await OrderStateGestor.ValidateFinalState(order.OrderState)) {
            throw(`No es posible facturar la orden ${order.OrderDocument} ${order.OrderNumber}, si la orden aún no esta finalizada.`)
        }
        const invoiceNumber = OfimaDocumentTypeGestor.GetNextConsecutive(ofimaDocumentType)

        if(!await StoreGestor.Exists(Store)) throw(`La bodega ${Store} no existe en la base de datos.`)

        const orderProductList = await OrderProductGestor.ListByOrder(OrderDocument, OrderNumber)
        const orderServicesList = await OrderServiceGestor.ListByOrder(OrderDocument, OrderNumber)
        const invoiceLineProduct = await InvoiceLineGestor.TransformOrderProductList(orderProductList, Store, ofimaDocumentType, invoiceNumber, costCenter, User)
        const invoiceLineService = await InvoiceLineGestor.TransformOrderServiceList(orderServicesList, Store, ofimaDocumentType, invoiceNumber, costCenter, User)
        const invoiceLineList = invoiceLineProduct.concat(invoiceLineService)
        
        const totalWithOutTaxes = InvoiceLineGestor.GetTotalWithOutTaxes(invoiceLineList)
        const taxTotal = InvoiceLineGestor.GetTaxTotal(invoiceLineList)
        const totalInvoice = InvoiceLineGestor.GetTotalWithTaxes(invoiceLineList)
        const totalPaid = InvoicePaymentMehtodGestor.GetTotalPaidFromList(PaymentMethodsList)
        if (totalPaid < totalInvoice) throw(`No es posible guardar la factura porque los medios de pagos no dan el total de la factura. Total medios de pago: ${totalPaid}, total factura ${totalInvoice}`)
        if (totalPaid > totalInvoice) {
            const ChangePayment = await InvoicePaymentMehtodGestor.GenerateChange(totalPaid-totalInvoice, userInstance.UserCode)
            PaymentMethodsList = PaymentMethodsList.concat(ChangePayment)
        }

        await InvoicePaymentMehtodGestor.ValidateCreditPortfolio(customer, PaymentMethodsList)
        const InstantPayment = !InvoicePaymentMehtodGestor.validateExistsCredit(PaymentMethodsList)
        const mainPayment = InvoicePaymentMehtodGestor.GetMainMethodFromList(PaymentMethodsList)
        const invoiceHeader = InvoiceHeaderGestor.Construct(order,ofimaDocumentType, invoiceNumber, customer, costCenter,cashRegister, InstantPayment, mainPayment.PaymentMethod, totalWithOutTaxes, taxTotal, User, Seller )
        
        const invoicePaymentMethodList = InvoicePaymentMehtodGestor.TransformFromPaymentMethodList(PaymentMethodsList, customer, ofimaDocumentType, invoiceNumber, User)
        
        const invoice = this.Construct(invoiceHeader, invoiceLineList, invoicePaymentMethodList)

        //Se genera la factura
        await this.Make(invoice)
        await OrderGestor.SetInvoice(order, userInstance.UserCode, ofimaDocumentType.DocumentType, invoiceNumber)
        await OrderGestor.Close(OrderDocument, OrderNumber)
        await OfimaDocumentTypeGestor.SetNextConsecutive(ofimaDocumentType)
        return `Se ha generado la factura ${ofimaDocumentType.DocumentType + invoiceNumber}`
    }
}

export default InvoiceGestor