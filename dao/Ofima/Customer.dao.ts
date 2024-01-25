import { getConnection } from "../../database/connection"
import appConfig from "../../config"

const ofima_db = appConfig.ofima_db
const table = 'MTPROCLI'

const CustomerDao = {

    listByName: async (searchText: string) => {
        const pool = await getConnection()
        const query = `SELECT NIT, NOMBRE, CIUDAD, DIRECCION, TIPOPER, CODRETE FROM ${ofima_db}.[dbo].${table}
        WHERE NOMBRE LIKE '%${searchText}%' OR NIT LIKE '%${searchText}%'`
        const result = await pool
            ?.request()
            .query(query)
        if (result === undefined) throw('se obtuvo un valor "undefined" al hacer la consulta en la base de datos. Funcion: CustomerDao.listByName')
        return result.recordset
    },

    GetByIdentification: async (Identification: string) => {
        const pool = await getConnection()
        const query = `SELECT NIT, NOMBRE, CIUDAD, DIRECCION, TIPOPER, CODRETE FROM ${ofima_db}.[dbo].${table}
        WHERE NIT = '${Identification}'`
        const result = await pool
            ?.request()
            .query(query)
        if (result === undefined) throw('se obtuvo un valor "undefined" al hacer la consulta en la base de datos. Funcion: CustomerDao.GetByIdentification')
        return result.recordset
    }
}

export default CustomerDao