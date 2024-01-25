import UserAssignedGroupDao from "../dao/UserAssignedGroups.dao"
import GroupGestor from "./Groups.model"
import UserGestor from "./Users.model"

interface UserAssignedGroup {
    UserCode: string,
    GroupCode: string
}

const UserAssignedGroupGestor = {

    async Create(UserAssignedGroup: UserAssignedGroup) {
        const {UserCode, GroupCode} = UserAssignedGroup
        if (!await UserGestor.Exists(UserCode)) {
            throw(`El usuario ${UserCode} no existe en la base datos, no se puede asignar a un grupo.`)
        }
        if (!await GroupGestor.Exists(GroupCode)) {
            throw(`El grupo ${GroupCode} no existe en la base datos, no se puede asignar a un usuario.`)
        }
        if (await this.Exists(UserAssignedGroup)) {
            throw(`El usuario ${UserCode} ya esta asginado al grupo ${GroupCode} en la base de datos, no se puede volver asignar.`)
        }
        await UserAssignedGroupDao.insert(UserCode,GroupCode)
    },

    async CreateByGoupsListAndUserCode (GroupsList: [{GroupCode: string}], UserCode: string) {
        if (!await UserGestor.Exists(UserCode)) {
            throw(`El usuario ${UserCode} no existe en la base datos, no se puede asignar a un contacto.`)
        }
        for (const g of GroupsList) {
            if (!await GroupGestor.Exists(g.GroupCode)) {
                throw(`El grupo ${g.GroupCode} no existe en la base datos, no se puede asignar a un usuario.`)
            }
        }
        await UserAssignedGroupDao.deleteAllByUserCode(UserCode)
        for (const g of GroupsList) {
            await UserAssignedGroupDao.insert(UserCode, g.GroupCode)
        }
    },

    async ListUsersByGroupCode(GroupCode: string) {
        if (!await GroupGestor.Exists(GroupCode)) {
            throw(`El grupo ${GroupCode} no existe en la base datos.`)
        }
        const list = await UserAssignedGroupDao.listByGroupCode(GroupCode) as UserAssignedGroup[]
        const userList = await Promise.all(list?.map(async (UserAssignedGroup) => {
            var user = await UserGestor.GetByUserCode(UserAssignedGroup.UserCode)
            return user
        }))
        return userList
    },

    async ListGroupsByUserCode(UserCode: string) {
        if (!await UserGestor.Exists(UserCode)) {
            throw(`El usuario ${UserCode} no existe en la base datos.`)
        }
        const list = await UserAssignedGroupDao.listByUserCode(UserCode) as UserAssignedGroup[]
        if (list === undefined) {
            throw('Error al obtener el objeto UsserAssignedGoups, se obtuvo un valor undefined al hacer la consulta en la base de datos.')
        }
        const groupsList = await Promise.all(list?.map(async (UserAssignedGroup) => {
            return await GroupGestor.GetByCode(UserAssignedGroup.GroupCode)
        }))
        return groupsList
    },

    async Delete(UserAssignedGroup: UserAssignedGroup) {
        const {UserCode, GroupCode} = UserAssignedGroup
        if (!await UserGestor.Exists(UserCode)) {
            throw(`El usuario ${UserCode} no existe en la base datos, no se puede eliminar.`)
        }
        if (!await GroupGestor.Exists(GroupCode)) {
            throw(`El grupo ${GroupCode} no existe en la base datos, no se puede eliminar.`)
        }
        if (!await this.Exists(UserAssignedGroup)) {
            throw(`El usuario ${UserCode} ya esta desasginado al grupo ${GroupCode} en la base de datos, no se puede eliminar.`)
        }
        await UserAssignedGroupDao.deleteByUserCodeAndGroupCode(UserCode, GroupCode)
    },

    async Exists(UserAssignedGroup: UserAssignedGroup) {
        const {UserCode, GroupCode} = UserAssignedGroup
        const result = await UserAssignedGroupDao.getByUserCodeAndGroupCode(UserCode, GroupCode)
        if (result === undefined || result?.length < 1 ) {
            return false
        }
        return true
    }
}
 

export default UserAssignedGroupGestor
export type {UserAssignedGroup}