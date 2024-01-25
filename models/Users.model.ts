import UserDao from "../dao/Users.dao"

interface User {
    UserCode: string,
    Password: string,
    Name: string
}

const UserGestor = {

    async Create(User: User) {
        const {UserCode, Name, Password} = User
        if (await this.Exists(UserCode)) {
            throw(`El usuario ${UserCode} ya existe en la base de datos, no se puede volver a crear.`)
        }
        await UserDao.insert(UserCode, Password, Name)
    },

    async ListAll() {
        const list = await UserDao.listByName('')
        return list
    },

    async ListByName(Name: string) {
        const list = await UserDao.listByName(Name)
        return list 
    },

    async GetByUserCode(UserCode: string) {
        const data = await UserDao.getByUserCode(UserCode)
        if (data === undefined || data.length !== 1 ) {
            throw(`No fue posible inicializar el objeto User, no se encontro el usuario ${UserCode}`)
        } else {
            const user = data[0] as User
            return user
        }
    },

    async EditByUserCode(User: User) {
        const {UserCode, Password, Name} = User
        if (!await this.Exists(UserCode)) {
            throw(`El usuario ${UserCode} NO existe en la base de datos, no se puede modificar.`)
        }
        await UserDao.updateByUserCode(UserCode, Password, Name)
    },

    async DeleteByUserCode(UserCode: string) {
        if (!await this.Exists(UserCode)) {
            throw(`El usuario ${UserCode} NO existe en la base de datos, no se puede eliminar.`)
        }
        await UserDao.deleteByUserCode(UserCode)
    },

    async Exists(UserCode: string) {
        const result = await UserDao.getByUserCode(UserCode)
        if (result === undefined || result?.length < 1 ) {
            return false
        }
        return true
    },

    async ValidateCredentials(UserCode: string, Password: string) {
        const data = await UserDao.getByCredentials(UserCode, Password)
        if (data === undefined) {
            throw('Error al obtener el objeto User, se obtuvo un valor "undefined" al hacer la consulta en la base de datos. Funcion: Users.ValidateCredentials')
        }
        if (data.length > 1) {
            throw(`Error al obtener el objeto User, inconsistencia de datos: hay más de un usuario ${UserCode} con la misma contraseña.`)
        }
        
        if (data.length === 1) {
            return true
        } else {
            return false
        }
    }
}
 

export default UserGestor
export type {User}