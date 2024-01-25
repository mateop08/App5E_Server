import GroupDao from "../dao/Groups.dao"

interface Group {
    Code: string,
    Description: string
}

const GroupGestor = {

    async Create(Group: Group) {
        const {Code, Description} = Group
        if (await this.Exists(Code)) {
            throw(`El grupo ${Code} ya existe en la base de datos, no se puede volver a crear.`)
        }
        await GroupDao.insert(Code,Description)
    },

    async ListAll() {
        const list = await GroupDao.listByDescription('')
        return list
    },

    async ListByDescription(Description: string) {
        const list = await GroupDao.listByDescription(Description)
        return list 
    },

    async GetByCode(Code: string) {
        const data = await GroupDao.getByCode(Code)
        if (data === undefined) {
            throw('Error al obtener el objeto Group, se obtuvo un valor "undefined" al hacer la consulta en la base de datos. Funcion: Group.GetByCode')
        }
        if (data.length === 0) {
            throw(`Error al obtener el objeto Group, no existe un grupo con código ${Code} en la base de datos.`)
        }
        if (data.length > 1) {
            throw(`Error al obtener el objeto Group, inconsistencia de datos: hay más de un grupo con ${Code} en la base de datos.`)
        }
        const group = data[0] as Group
        return group
    },

    async EditByCode(Group: Group) {
        const {Code, Description} = Group
        if (!await this.Exists(Code)) {
            throw(`El grupo ${Code} NO existe en la base de datos, no se puede modificar.`)
        }
        await GroupDao.updateByCode(Code, Description)
    },

    async DeleteByCode(Code: string) {
        if (!await this.Exists(Code)) {
            throw(`El grupo ${Code} NO existe en la base de datos, no se puede eliminar.`)
        }
        await GroupDao.deleteByCode(Code)
    },

    async Exists(Code: string) {
        const result = await GroupDao.getByCode(Code)
        if (result === undefined || result?.length < 1 ) {
            return false
        }
        return true
    }
}
 

export default GroupGestor
export type {Group}