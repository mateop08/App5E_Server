import ServiceDao from "../dao/Services.dao"
import AppDocumentGestor, { AppDocument } from "./AppDocuments.model"

interface Service {
    Code: string,
    Description: string,
    Price: number
}

const ServiceGestor = {

    Construct(Code: string, Description: string, Price: number) {
        const service: Service = {
            Code: Code,
            Description: Description,
            Price: Price
        }
        return service
    },

    async ListByDescription(OrderDocument: string, Description: string) {
        const appDocument: AppDocument = await AppDocumentGestor.GetByCode(OrderDocument)
        const list = await ServiceDao.list(Description, appDocument.PriceCode, appDocument.InventoryType, appDocument.ServicesLine) as Service[]
        return list 
    },

    async GetByCode(OrderDocument: string, Code: string) {
        const appDocument: AppDocument = await AppDocumentGestor.GetByCode(OrderDocument)
        const data = await ServiceDao.getByCode(Code, appDocument.PriceCode, appDocument.InventoryType, appDocument.ServicesLine)
        if (data === undefined) {
            throw('Error al obtener el objeto Service, se obtuvo un valor "undefined" al hacer la consulta en la base de datos. Funcion: Service.GetByCode')
        }
        if (data.length === 0) {
            throw(`Error al obtener el objeto Service, no existe un estado de orden con código ${Code} en la base de datos.`)
        }
        if (data.length > 1) {
            throw(`Error al obtener el objeto Service, inconsistencia de datos: hay más de un servicio con código ${Code} en la base de datos.`)
        }
        const Service = data[0] as Service
        return Service
    },

    async Exists(OrderDocument: string, Code: string) {
        const appDocument: AppDocument = await AppDocumentGestor.GetByCode(OrderDocument)
        const result = await ServiceDao.getByCode(Code, appDocument.PriceCode, appDocument.InventoryType, appDocument.ServicesLine)
        if (result === undefined) {
            throw('Error al obtener el objeto Services, se obtuvo un valor "undefined" al hacer la consulta en la base de datos. Funcion: Services.Exists')
        }
        if (result.length > 1) {
            throw(`Error al obtener el objeto Services, inconsistencia de datos: hay más de un Serviceo ${Code} en la base de datos.`)
        }
        if (result.length === 0) {
            return false
        }
        return true
    }
}
 

export default ServiceGestor
export type {Service}