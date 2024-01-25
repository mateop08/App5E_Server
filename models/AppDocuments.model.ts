import AppDocumentDao from "../dao/AppDocuments.dao"

interface AppDocument {
    Code: string,
    Description: string,
    Consecutive: number,
    Store: string,
    PriceCode: string,
    InventoryType: string,
    ServicesLine: string
}

const AppDocumentGestor = {

    async Create(Annonation: AppDocument) {
        const {Code, Description, Consecutive, Store, PriceCode, InventoryType, ServicesLine} = Annonation
        if (await this.Exists(Code)) {
            throw(`El tipo de documento de aplicación ${Code} ya existe en la base de datos, no se puede volver a crear.`)
        }
        await AppDocumentDao.insert(Code, Description, Consecutive, Store, PriceCode, InventoryType, ServicesLine)
    },

    async ListAll() {
        const list = await AppDocumentDao.listByDescription('')
        return list
    },

    async ListByDescription(Description: string) {
        const list = await AppDocumentDao.listByDescription(Description)
        return list 
    },

    async GetByCode(Code: string) {
        if (!await this.Exists(Code)) {
            throw(`El tipo de documento de aplicación ${Code} NO existe en la base de datos, no se puede inicializar el objeto AppDocument.`)
        }
        const data = await AppDocumentDao.getByCode(Code)
        if (data === undefined || data.length !== 1) {
            throw('No es posible inicializar el objeto AppDocument para un dato undefined')
        } else {
            const appDocument = data[0] as AppDocument
            return appDocument
        }   
    },

    async EditByCode(appDocument: AppDocument) {
        const {Code, Description, Consecutive, Store, PriceCode, InventoryType, ServicesLine} = appDocument
        if (!await this.Exists(Code)) {
            throw(`El tipo de documento de aplicación ${Code} NO existe en la base de datos, no se puede modificar.`)
        }
        await AppDocumentDao.updateByCode(Code, Description, Consecutive, Store, PriceCode, InventoryType, ServicesLine)
    },

    async DeleteByCode(Code: string) {
        if (!await this.Exists(Code)) {
            throw(`El tipo de documento de aplicación ${Code} NO existe en la base de datos, no se puede eliminar.`)
        }
        await AppDocumentDao.deleteByCode(Code)
    },

    async Exists(Code: string) {
        const result = await AppDocumentDao.getByCode(Code)
        if (result === undefined || result?.length < 1 ) {
            return false
        }
        return true
    },

    async GetNewNumber(AppDocumentCode: string) {
        const appDocument = await this.GetByCode(AppDocumentCode)
        return appDocument.Consecutive + 1
    },

    async SetNewNumber(AppDocumentCode: string) {
        var appDocument = await this.GetByCode(AppDocumentCode)
        appDocument.Consecutive += 1
        await this.EditByCode(appDocument)
    }
}
 

export default AppDocumentGestor
export type {AppDocument}