import ProductDao from "../dao/Products.dao"
import AppDocumentGestor, { AppDocument } from "./AppDocuments.model"

interface Product {
    Code: string,
    Description: string,
    Price: number,
    IsBulk: boolean
}

interface ProductWithStock extends Product {
    Stock: number,
}

const ProductGestor = {

    ValidateIsBulkProduct(Code: string) {
        return (Code.includes('GRANEL'))
    },

    Construct(Code: string, Description: string, Price: number, Stock: number | undefined = undefined) {
        if (Stock === undefined) {
            const product: Product = {
                Code: Code,
                Description: Description,
                Price: Price,
                IsBulk: this.ValidateIsBulkProduct(Code)
            }
            return product
        } else {
            const productWithStock: ProductWithStock = {
                Code: Code,
                Description: Description,
                Price: Price,
                Stock: Stock,
                IsBulk: this.ValidateIsBulkProduct(Code)
            }
            return productWithStock
        }
    },

    ConstructFromDao(data: any) {
        return this.Construct(data.Code, data.Description, data.Price, data.Stock)
    },

    async ListByDescription(OrderDocument: string, Description: string) {
        const appDocument: AppDocument = await AppDocumentGestor.GetByCode(OrderDocument)
        const list = await ProductDao.list(Description, appDocument.Store, appDocument.PriceCode, appDocument.InventoryType) as ProductWithStock[]
        if (list === undefined) throw("Error al hacer la consulta en la base de datos Products.ListByDescription")
        const productList = list.map((e) => this.ConstructFromDao(e))
        return productList 
    },

    async ListAll(OrderDocument: string) {
        const list = await this.ListByDescription(OrderDocument, '')
        return list
    },

    async ListBulkProducts(OrderDocument: string) {
        const list = await this.ListAll(OrderDocument)
        const bulkList = list.filter((e) => {
            if (e.IsBulk) {
                return e
            } else {
                return
            }
        })
        const orderList = bulkList.sort((a,b) => a.Description.localeCompare(b.Description))
        return orderList
    },

    async GetByCode(OrderDocument: string, Code: string) {
        const appDocument: AppDocument = await AppDocumentGestor.GetByCode(OrderDocument)
        const data = await ProductDao.getByCode(Code, appDocument.Store, appDocument.PriceCode, appDocument.InventoryType)
        if (data === undefined) {
            throw('Error al obtener el objeto Products, se obtuvo un valor "undefined" al hacer la consulta en la base de datos. Funcion: Products.Exists')
        }
        if (data.length > 1) {
            throw(`Error al obtener el objeto Products, inconsistencia de datos: hay más de un producto ${Code} en la base de datos.`)
        }
        if (data.length === 0) {
            throw(`Error al obtener el objeto Products, no se encontro el producto ${Code} en la base de datos para el tipo de documento ${OrderDocument}.`)
        }
        const product = this.ConstructFromDao(data[0]) as ProductWithStock
        return product
    },

    async Exists(OrderDocument: string, Code: string) {
        const appDocument: AppDocument = await AppDocumentGestor.GetByCode(OrderDocument)
        const result = await ProductDao.getByCode(Code, appDocument.Store, appDocument.PriceCode, appDocument.InventoryType)
        if (result === undefined) {
            throw('Error al obtener el objeto Products, se obtuvo un valor "undefined" al hacer la consulta en la base de datos. Funcion: Products.Exists')
        }
        if (result.length > 1) {
            throw(`Error al obtener el objeto Products, inconsistencia de datos: hay más de un producto ${Code} en la base de datos.`)
        }
        if (result.length === 0) {
            return false
        }
        return true
    }
}
 

export default ProductGestor
export type {Product}