import DocumentTypeDao from "../dao/DocumentTypes.dao"

interface DocumentType {
    Code: string,
    Description: string
}

const DocumentTypeGestor = {

    Construct(Code: string, Description: string) {
        const documentType: DocumentType = {
            Code: Code,
            Description: Description
        }
        return documentType
    },

    async Create(DocumentType: DocumentType) {
        const {Code, Description} = DocumentType
        if (await this.Exists(Code)) {
            throw(`El tipo de documento ${Code} ya existe en la base de datos, no se puede volver a crear.`)
        }
        await DocumentTypeDao.insert(Code,Description)
    },

    async ListAll() {
        const list = await DocumentTypeDao.listByDescription('')
        return list
    },

    async ListByDescription(Description: string) {
        const list = await DocumentTypeDao.listByDescription(Description)
        return list 
    },

    async GetByCode(Code: string) {
        const data = await DocumentTypeDao.getByCode(Code)
        if (data === undefined) {
            throw('Error al obtener el objeto DocumentType, se obtuvo un valor "undefined" al hacer la consulta en la base de datos. Funcion: DocumentType.GetByCode')
        }
        if (data.length > 1) {
            throw(`Error al obtener el objeto DocumentType, inconsistencia de datos: hay más de un documento ${Code} en la base de datos.`)
        }
        if (data.length === 0) {
            throw(`Error al obtener el objeto DocumentType, no se encontro el documento ${Code} en la base de datos.`)
        }
        const documentType = data[0] as DocumentType
        return documentType
    },

    async EditByCode(DocumentType: DocumentType) {
        const {Code, Description} = DocumentType
        if (!await this.Exists(Code)) {
            throw(`El tipo de documento ${Code} NO existe en la base de datos, no se puede modificar.`)
        }
        await DocumentTypeDao.updateByCode(Code, Description)
    },

    async DeleteByCode(Code: string) {
        if (!await this.Exists(Code)) {
            throw(`El tipo de documento ${Code} NO existe en la base de datos, no se puede eliminar.`)
        }
        await DocumentTypeDao.deleteByCode(Code)
    },

    async Exists(Code: string) {
        const result = await DocumentTypeDao.getByCode(Code)
        if (result === undefined || result?.length < 1 ) {
            return false
        }
        return true
    }
}
 

export default DocumentTypeGestor
export type {DocumentType}