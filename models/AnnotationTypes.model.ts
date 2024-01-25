import AnnotationTypeDao from "../dao/AnotationTypes.dao"

interface AnnotationType {
    Code: string,
    Description: string
}

const AnnotationTypeGestor = {

    Construct(Code: string, Description: string) {
        const annotationType: AnnotationType = {
            Code: Code,
            Description: Description
        }
        return annotationType
    },

    async Create(Annonation: AnnotationType) {
        const {Code, Description} = Annonation
        if (await this.Exists(Code)) {
            throw(`El tipo de anotación ${Code} ya existe en la base de datos, no se puede volver a crear.`)
        }
        await AnnotationTypeDao.insert(Code,Description)
    },

    async ListAll() {
        const list = await AnnotationTypeDao.listByDescription('') as AnnotationType[]
        return list
    },

    async ListByDescription(Description: string) {
        const list = await AnnotationTypeDao.listByDescription(Description) as AnnotationType[]
        return list 
    },

    async GetByCode(Code: string) {
        const data = await AnnotationTypeDao.getByCode(Code)
        if (data === undefined) {
            throw('Error al obtener el objeto AnnotationTypes, se obtuvo un valor "undefined" al hacer la consulta en la base de datos. Funcion: AnnotationTypes.GetByCode')
        }
        if (data.length > 1) {
            throw(`Error al obtener el objeto AnnotationTypes, inconsistencia de datos: hay más de un producto ${Code} en la base de datos.`)
        }
        if (data.length === 0) {
            throw(`Error al obtener el objeto AnnotationTypes, no se encontro el producto ${Code} en la base de datos.`)
        }
        const annotationType = data[0] as AnnotationType
        return annotationType
    },

    async EditByCode(Annonation: AnnotationType) {
        const {Code, Description} = Annonation
        if (!await this.Exists(Code)) {
            throw(`El tipo de anotación ${Code} NO existe en la base de datos, no se puede modificar.`)
        }
        await AnnotationTypeDao.updateByCode(Code, Description)
    },

    async DeleteByCode(Code: string) {
        if (!await this.Exists(Code)) {
            throw(`El tipo de anotación ${Code} NO existe en la base de datos, no se puede eliminar.`)
        }
        await AnnotationTypeDao.deleteByCode(Code)
    },

    async Exists(Code: string) {
        const result = await AnnotationTypeDao.getByCode(Code)
        if (result === undefined || result?.length < 1 ) {
            return false
        }
        return true
    }
}
 

export default AnnotationTypeGestor
export type {AnnotationType}