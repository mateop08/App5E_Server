import AppFunctionsDao from "../dao/AppFunctions.dao"
import AppFunctionDao from "../dao/AppFunctions.dao"

interface AppFunction {
    Code: string,
    Description: string,
    Method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    Route: string,
    RequiresAuth: boolean
}

const AppFunctionGestor = {

    async Create(AppFunction: AppFunction) {
        const {Code, Description, Method, Route, RequiresAuth} = AppFunction
        if (await this.Exists(Code)) {
            throw(`La funcion de aplicacion ${Code} ya existe en la base de datos, no se puede volver a crear.`)
        }
        await AppFunctionDao.insert(Code,Description, Method, Route, RequiresAuth)
    },

    async ListAll() {
        const list = await AppFunctionDao.listByDescription('')
        return list
    },

    async ListByDescription(Description: string) {
        const list = await AppFunctionDao.listByDescription(Description)
        return list 
    },

    async GetByCode(Code: string) {
        const data = await AppFunctionDao.getByCode(Code)
        if (data === undefined) {
            throw('Error al obtener el objeto AppFunction, se obtuvo un valor "undefined" al hacer la consulta en la base de datos. Funcion: AppFunction.GetByCode')
        }
        const appFunction = data[0] as AppFunction
        return appFunction
    },

    async GetByMethodAndRoute(Method: string, Route: string) {
        const data = await AppFunctionsDao.getByMethodAndRoute(Method, Route)
        if (data === undefined) {
            throw('Error al obtener el objeto AppFunction, se obtuvo un valor "undefined" al hacer la consulta en la base de datos. Funcion: AppFunction.GetByMethodAndRoute')
        }
        if (data.length === 0) {
            throw(`Error al obtener el objeto AppFunction, no existe una función con metodo ${Method} y ruta ${Route} en la base de datos.`)
        }
        if (data.length > 1) {
            throw(`Error al obtener el objeto AppFunction, inconsistencia de datos: hay más de una función con metodo ${Method} y ruta ${Route} en la base de datos.`)
        }
        const appFunction = data[0] as AppFunction
        return appFunction
    },

    async EditByCode(AppFunction: AppFunction) {
        const {Code, Description, Method, Route, RequiresAuth} = AppFunction
        if (!await this.Exists(Code)) {
            throw(`La funcion de aplicacion ${Code} NO existe en la base de datos, no se puede modificar.`)
        }
        await AppFunctionDao.updateByCode(Code, Description, Method, Route, RequiresAuth)
    },

    async DeleteByCode(Code: string) {
        if (!await this.Exists(Code)) {
            throw(`La funcion de aplicacion ${Code} NO existe en la base de datos, no se puede eliminar.`)
        }
        await AppFunctionDao.deleteByCode(Code)
    },

    async Exists(Code: string) {
        const result = await AppFunctionDao.getByCode(Code)
        if (result === undefined || result?.length < 1 ) {
            return false
        }
        return true
    }
}
 

export default AppFunctionGestor
export type {AppFunction}