import GroupAppFunctionDao from "../dao/GroupAppFunctions.dao"
import GroupGestor from "./Groups.model"
import AppFunctionGestor from "./AppFunctions.model"

interface GroupAppFunction {
    AppFunctionCode: string,
    GroupCode: string
}

const GroupAppFunctionGestor = {

    async Create(GroupAppFunction: GroupAppFunction) {
        const {AppFunctionCode, GroupCode} = GroupAppFunction
        if (!await AppFunctionGestor.Exists(AppFunctionCode)) {
            throw(`La función ${AppFunctionCode} no existe en la base datos, no se puede asignar a un grupo.`)
        }
        if (!await GroupGestor.Exists(GroupCode)) {
            throw(`El grupo ${GroupCode} no existe en la base datos, no se puede asignar a una función.`)
        }
        if (await this.Exists(GroupAppFunction)) {
            throw(`La función ${AppFunctionCode} ya esta asginada al grupo ${GroupCode} en la base de datos, no se puede volver asignar.`)
        }
        await GroupAppFunctionDao.insert(AppFunctionCode,GroupCode)
    },

    async SetByAppFunctionListAndGroupCode (AppFunctionCodeList: [{AppFunctionCode: string}], GroupCode: string) {
        if (!await GroupGestor.Exists(GroupCode)) {
            throw(`El grupo ${GroupCode} no existe en la base datos, no se puede asignar el listado de funciones.`)
        }
        for (const f of AppFunctionCodeList) {
            if (!await AppFunctionGestor.Exists(f.AppFunctionCode)) {
                throw(`La función ${f.AppFunctionCode} no existe en la base datos, no se puede asignar a un grupo.`)
            }
        }
        await GroupAppFunctionDao.deleteAllByGroupCode(GroupCode)
        for (const f of AppFunctionCodeList) {
            await GroupAppFunctionDao.insert(f.AppFunctionCode, GroupCode)
        }
    },

    async ListFunctionsByGroupCode(GroupCode: string) {
        if (!await GroupGestor.Exists(GroupCode)) {
            throw(`El grupo ${GroupCode} no existe en la base datos, no es posible listar las funciones por codigo de grupo.`)
        }
        const list = await GroupAppFunctionDao.listByGroupCode(GroupCode) as GroupAppFunction[]
        const functionList = await Promise.all(list?.map(async (GroupAppFunction) => {
            var appFunction = await AppFunctionGestor.GetByCode(GroupAppFunction.AppFunctionCode)
            return appFunction
        }))
        return functionList
    },

    async ListGroupsByAppFunctionCode(AppFunctionCode: string) {
        if (!await AppFunctionGestor.Exists(AppFunctionCode)) {
            throw(`La funcion ${AppFunctionCode} no existe en la base datos, no es posible listar funciones por codigo de función.`)
        }
        const list = await GroupAppFunctionDao.listByAppFunctionCode(AppFunctionCode) as GroupAppFunction[]
        const groupsList = await Promise.all(list?.map(async (GroupAppFunction) => {
            return await GroupGestor.GetByCode(GroupAppFunction.GroupCode)
        }))
        return groupsList
    },

    async Delete(GroupAppFunction: GroupAppFunction) {
        const {AppFunctionCode, GroupCode} = GroupAppFunction
        if (!await AppFunctionGestor.Exists(AppFunctionCode)) {
            throw(`La funcion ${AppFunctionCode} no existe en la base datos, no se puede eliminar.`)
        }
        if (!await GroupGestor.Exists(GroupCode)) {
            throw(`El grupo ${GroupCode} no existe en la base datos, no se puede eliminar.`)
        }
        if (!await this.Exists(GroupAppFunction)) {
            throw(`La funcion ${AppFunctionCode} ya esta desasginada del grupo ${GroupCode} en la base de datos, no se puede eliminar.`)
        }
        await GroupAppFunctionDao.deleteByAppFunctionCodeAndGroupCode(AppFunctionCode, GroupCode)
    },

    async Exists(GroupAppFunction: GroupAppFunction) {
        const {AppFunctionCode, GroupCode} = GroupAppFunction
        const result = await GroupAppFunctionDao.getByAppFunctionCodeAndGroupCode(AppFunctionCode, GroupCode)
        if (result === undefined || result?.length < 1 ) {
            return false
        }
        return true
    }
}
 

export default GroupAppFunctionGestor
export type {GroupAppFunction}