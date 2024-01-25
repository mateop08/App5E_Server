import TechnicianDao from "../dao/Technicians.dao"

interface Technician {
    Code: string,
    Description: string
}

const TechnicianGestor = {

    Construct(Code: string, Description: string) {
        const technician: Technician = {
            Code: Code,
            Description: Description
        }
        return technician
    },

    async Create(Technician: Technician) {
        const {Code, Description} = Technician
        if (await this.Exists(Code)) {
            throw(`El tecnico ${Code} ya existe en la base de datos, no se puede volver a crear.`)
        }
        await TechnicianDao.insert(Code,Description)
    },

    async ListAll() {
        const list = await TechnicianDao.listByDescription('')
        return list
    },

    async ListByDescription(Description: string) {
        const list = await TechnicianDao.listByDescription(Description)
        return list 
    },

    async GetByCode(Code: string) {
        const data = await TechnicianDao.getByCode(Code)
        if (data === undefined) {
            throw('Error al obtener el objeto Technician, se obtuvo un valor "undefined" al hacer la consulta en la base de datos. Funcion: Technician.GetByCode')
        }
        if (data.length === 0) {
            throw(`Error al obtener el objeto Technician, no existe un tecnico con código ${Code} en la base de datos.`)
        }
        if (data.length > 1) {
            throw(`Error al obtener el objeto Technician, inconsistencia de datos: hay más de un tecnico con código ${Code} en la base de datos.`)
        }
        const technician = data[0] as Technician
        return technician
    },

    async EditByCode(Technician: Technician) {
        const {Code, Description} = Technician
        if (!await this.Exists(Code)) {
            throw(`El tecnico ${Code} NO existe en la base de datos, no se puede modificar.`)
        }
        await TechnicianDao.updateByCode(Code, Description)
    },

    async DeleteByCode(Code: string) {
        if (!await this.Exists(Code)) {
            throw(`El tecnico ${Code} NO existe en la base de datos, no se puede eliminar.`)
        }
        await TechnicianDao.deleteByCode(Code)
    },

    async Exists(Code: string) {
        const result = await TechnicianDao.getByCode(Code)
        if (result === undefined || result?.length < 1 ) {
            return false
        }
        return true
    }
}
 

export default TechnicianGestor
export type {Technician}