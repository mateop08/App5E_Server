import { DateTime } from "luxon";
import { OrderProduct } from "../OrderProducts.model";
import { OrderService } from "../OrderServices.model";
import InvoiceLineDao, { MVTRADE_InsertData } from "../../dao/Ofima/InvoiceLine.dao";
import { sql } from "../../database/connection";
import { OfimaDocumentType } from "./OfimaDocumentType.model";
import CatalogueItemGestor, { CatalogueItemWithPrice } from "./CatalogueItem.model";
import { CostCenter } from "./CostCenter.model";

export interface InvoiceLine {
    OfimaDocumentType: OfimaDocumentType,
    InvoiceNumber: number,
    CatalogueItem: CatalogueItemWithPrice,
    ValueWithOutTax: number,
    Store: string,
    Amount: number,
    Date: DateTime,
    Seller: string,
    CostCenter: CostCenter,
    User: string
}

const InvoiceLineGestor = {

    adaptToInsert(invoiceLine: InvoiceLine) {

        const {Amount, Date, ValueWithOutTax, CatalogueItem, User, OfimaDocumentType, InvoiceNumber, 
            Seller, CostCenter} = invoiceLine
        const adaptDate = Date.toSQLDate()
        if (adaptDate === null) throw("Error no se pudo convertir la fecha a un string SQL.")

        const adaptObject: MVTRADE_InsertData = {
            BODEGA: invoiceLine.Store,
            CANTIDAD: Amount,
            CANTORIG: 0,
            CANVENTA: Amount,
            CODCC: CostCenter.Code,
            CODINT: OfimaDocumentType.MovementType.IntegrationCode,
            CODRETE: CatalogueItem.WithHoldingTax.Code,
            FECENT: adaptDate,
            FECHA: adaptDate,
            FECING: adaptDate,
            FECMOD: adaptDate,
            FHCOMPRA: adaptDate,
            HVALUNID: ValueWithOutTax,
            NVALUNID: ValueWithOutTax,
            VALORUNIT: ValueWithOutTax,
            VALUNID: ValueWithOutTax,
            XNVALUNID: ValueWithOutTax,
            XVALUNID: ValueWithOutTax,
            PRODUCTO: CatalogueItem.Code,
            NOMBRE: CatalogueItem.Description,
            ORIGEN: 'FAC',
            TIPODCTO: OfimaDocumentType.DocumentType,
            NRODCTO: InvoiceNumber,
            ORDENPRV: '0',
            PASSWORDIN: User,
            PORETE: CatalogueItem.WithHoldingTax.Percent,
            IVA: CatalogueItem.Tax.Percent,
            TARIVA: CatalogueItem.Tax.Code,
            TIPOMVTO: OfimaDocumentType.MovementType.Code,
            TOPRETE: CatalogueItem.WithHoldingTax.Top,
            TOPRETICA: 0,
            UNDBASE: CatalogueItem.Unit,
            UNDVENTA: CatalogueItem.Unit,
            VENDEDOR: Seller,
            VLRVENTA: CatalogueItem.Price,
            ZVALORUNIT: CatalogueItem.Price
        }
        return adaptObject
    },

    async Create(invoiceLine: InvoiceLine, request: sql.Request) {
        const insertData = this.adaptToInsert(invoiceLine)
        await InvoiceLineDao.Insert(insertData, request)
    },

    async TransformFromOrderProduct(orderProduct: OrderProduct, Store: string, OfimaDocumentType: OfimaDocumentType, InvoiceNumber: number, CostCenter: CostCenter, User: string) {
        const today = DateTime.local()
        const { Product, Amount } = orderProduct
        const catologueItem = await CatalogueItemGestor.GetFromProduct(Product)
        const {Price, Tax} = catologueItem
        const invoiceLine: InvoiceLine = {
            CatalogueItem: catologueItem,
            Amount: Amount,
            Date: today,
            Store: Store,
            User: User,
            Seller: '0',
            ValueWithOutTax: CatalogueItemGestor.CalculateValueWithOutTax(Price, Tax),
            OfimaDocumentType: OfimaDocumentType,
            InvoiceNumber: InvoiceNumber,
            CostCenter: CostCenter
        }
        return invoiceLine
    },

    async TransformFromOrderService(orderService: OrderService, Store: string, OfimaDocumentType: OfimaDocumentType, InvoiceNumber: number, CostCenter: CostCenter, User: string) {
        const today = DateTime.local()
        const { Service, Amount } = orderService
        const catologueItem = await CatalogueItemGestor.GetFromService(Service)
        const {Price, Tax} = catologueItem
        const invoiceLine: InvoiceLine = {
            CatalogueItem: catologueItem,
            Amount: Amount,
            Date: today,
            Store: Store,
            User: User,
            Seller: orderService.Technician.Code,
            ValueWithOutTax: CatalogueItemGestor.CalculateValueWithOutTax(Price, Tax),
            OfimaDocumentType: OfimaDocumentType,
            InvoiceNumber: InvoiceNumber,
            CostCenter: CostCenter
        }
        return invoiceLine
    },

    async TransformOrderProductList(orderProductList: OrderProduct[], Store: string, OfimaDocumentType: OfimaDocumentType, InvoiceNumber: number, CostCenter: CostCenter, User: string) {
        const invoiceLineList = await Promise.all(orderProductList.map(async (p) => await this.TransformFromOrderProduct(p ,Store, OfimaDocumentType, InvoiceNumber, CostCenter, User)))
        return invoiceLineList
    },

    async TransformOrderServiceList(orderServiceList: OrderService[], Store: string, OfimaDocumentType: OfimaDocumentType, InvoiceNumber: number, CostCenter: CostCenter, User: string) {
        const invoiceLineList = await Promise.all(orderServiceList.map(async (s) => await this.TransformFromOrderService(s ,Store, OfimaDocumentType, InvoiceNumber, CostCenter, User)))
        return invoiceLineList
    },

    GetTotalWithOutTaxes(invoiceLineList: InvoiceLine[]) {
        return invoiceLineList.reduce(
            (total, line) => {
                return total + (line.ValueWithOutTax * line.Amount)
            }, 0)
    },

    GetTotalWithTaxes(invoiceLineList: InvoiceLine[]) {
        return invoiceLineList.reduce(
            (total, line) => {
                return total + (line.CatalogueItem.Price * line.Amount)
            }, 0)
    },

    GetTaxTotal(invoiceLineList: InvoiceLine[]) {
        return invoiceLineList.reduce(
            (total, line) => {
                const {CatalogueItem: {Price, Tax}} = line
                return total + (CatalogueItemGestor.CalculateTax(Price, Tax) * line.Amount)
            }, 0)
    }
}

export default InvoiceLineGestor