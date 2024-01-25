import TaxGestor, { Tax } from "../../models/Ofima/Tax.model"
import CatalogueItemDao from "../../dao/Ofima/CatalogueItem.dao"
import WithHoldingTaxGestor, { WithHoldingTax } from "./WithHoldingTax.model"
import { Product } from "../Products.model"
import { Service } from "../Services.model"

export interface CatalogueItem {
    Code: string,
    Description: string,
    Tax: Tax,
    Unit: string,
    WithHoldingTax: WithHoldingTax
}

export interface CatalogueItemWithPrice extends CatalogueItem{
    Price: number
}

const CatalogueItemGestor = {

    async AdaptFromDao(data: any) {
        //console.log(data)
        const tax = await TaxGestor.GetByCode(data.CODTARIVA.trimEnd())
        const withHoldingTax = await WithHoldingTaxGestor.GetByCode(data.CODRETE.trimEnd())
        
        const catalogueItem: CatalogueItem = {
            Code: data.CODIGO.trimEnd(),
            Description: data.DESCRIPCIO.trimEnd(),
            Tax: tax,
            Unit: data.UNIDADMED.trimEnd(),
            WithHoldingTax: withHoldingTax
        }
        return catalogueItem
    },

    async ListAll() {
        const data = await CatalogueItemDao.ListAll()
        const catalogueItemList = await Promise.all(data.map(async(e) => await this.AdaptFromDao(e)))
        return catalogueItemList
    },

    async GetByCode(Code: string) {
        const data = await CatalogueItemDao.GetByCode(Code)
        const catalogueItem = await this.AdaptFromDao(data[0])
        return catalogueItem
    },

    AddPrice(CatalogueItem: CatalogueItem, Price: number) {
        const catalogueItemWithPrice: CatalogueItemWithPrice = {
            ...CatalogueItem,
            Price: Price
        }
        return catalogueItemWithPrice
    },

    async GetFromProduct(Product: Product) {
        const catalogueItem = await this.GetByCode(Product.Code)
        const catalogueItemWithPrice = this.AddPrice(catalogueItem, Product.Price)
        return catalogueItemWithPrice
    },

    async GetFromService(Service: Service) {
        const catalogueItem = await this.GetByCode(Service.Code)
        const catalogueItemWithPrice = this.AddPrice(catalogueItem, Service.Price)
        return catalogueItemWithPrice
    },

    CalculateValueWithOutTax(Price: number, Tax: Tax) {
        const value = Price / (1 + (Tax.Percent/100))
        return value
    },

    CalculateTax(Price: number, Tax: Tax) {
        const value = Price / (1 + (Tax.Percent/100)) * (Tax.Percent/100)
        return value
    }
}

export default CatalogueItemGestor