import UserAppDocumentsDao from "../dao/UserAppDocuments.dao"
import UserAppDocumentDao from "../dao/UserAppDocuments.dao"
import AppDocumentGestor from "./AppDocuments.model"
import UserGestor from "./Users.model"

interface UserAppDocument {
    UserCode: string,
    DocumentCode: string
}

const UserAppDocumentGestor = {

    async Create(userAppDocument: UserAppDocument) {
        const {UserCode, DocumentCode} = userAppDocument
        if (!await UserGestor.Exists(UserCode)) {
            throw(`El usuario ${UserCode} no existe en la base datos, no se puede asignar a un contacto.`)
        }
        if (!await AppDocumentGestor.Exists(DocumentCode)) {
            throw(`El documento de aplicación ${DocumentCode} no existe en la base datos, no se puede asignar a una placa.`)
        }
        if (await this.Exists(userAppDocument)) {
            throw(`El documento de aplicación ${DocumentCode} ya esta asginado al usuario ${UserCode} en la base de datos, no se puede volver asignar.`)
        }
        await UserAppDocumentDao.insert(UserCode,DocumentCode)
    },

    async CreateByAppDocumentsListAndUserCode (AppDocumentsList: [{AppDocumentCode: string}], UserCode: string) {
        if (!await UserGestor.Exists(UserCode)) {
            throw(`El usuario ${UserCode} no existe en la base datos, no se puede asignar a un contacto.`)
        }
        for (const d of AppDocumentsList) {
            if (!await AppDocumentGestor.Exists(d.AppDocumentCode)) {
                throw(`El documento de aplicación ${d.AppDocumentCode} no existe en la base datos, no se puede asignar a un usuario.`)
            }
        }
        await UserAppDocumentDao.deleteAllByUserCode(UserCode)
        for (const d of AppDocumentsList) {
            await UserAppDocumentsDao.insert(UserCode, d.AppDocumentCode)
        }
    },

    async ListUsersByDocumentCode(DocumentCode: string) {
        if (!await AppDocumentGestor.Exists(DocumentCode)) {
            throw(`El documento de aplicación ${DocumentCode} no existe en la base datos.`)
        }
        const list = await UserAppDocumentDao.listByDocumentCode(DocumentCode) as UserAppDocument[]
        const userList = await Promise.all(list?.map(async (userAppDocument) => {
            var user = await UserGestor.GetByUserCode(userAppDocument.UserCode)
            return user
        }))
        return userList
    },

    async ListDocumentsByUserCode(UserCode: string) {
        if (!await UserGestor.Exists(UserCode)) {
            throw(`El usuario ${UserCode} no existe en la base datos.`)
        }
        const list = await UserAppDocumentDao.listByUserCode(UserCode) as UserAppDocument[]
        const appDocumentsList = await Promise.all(list?.map(async (userAppDocument) => {
            return await AppDocumentGestor.GetByCode(userAppDocument.DocumentCode)
        }))
        return appDocumentsList
    },

    async Delete(UserAppDocument: UserAppDocument) {
        const {UserCode, DocumentCode} = UserAppDocument
        if (!await this.Exists(UserAppDocument)) {
            throw(`El documento de aplicación ${DocumentCode} NO esta asginado al usuario ${UserCode}  en la base de datos, no se puede eliminar.`)
        }
        await UserAppDocumentDao.deleteByUserCodeAndDocumentCode(UserCode, DocumentCode)
    },

    async Exists(UserAppDocument: UserAppDocument) {
        const {UserCode, DocumentCode} = UserAppDocument
        const result = await UserAppDocumentDao.getByUserCodeAndDocumentCode(UserCode, DocumentCode)
        if (result === undefined || result?.length < 1 ) {
            return false
        }
        return true
    }
}
 

export default UserAppDocumentGestor
export type {UserAppDocument}