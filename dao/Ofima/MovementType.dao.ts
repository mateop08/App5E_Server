import { getConnection } from "../../database/connection"
import appConfig from "../../config"

const ofima_db = appConfig.ofima_db
const table = 'TIPOMVTO'

const MovementTypeDao = {

    ListAll: async () => {
        const pool = await getConnection()
        const query = `SELECT TIPOMVTO, DESCRIPCIO, CODINT
        FROM ${ofima_db}.[dbo].${table}`
        const result = await pool
            .request()
            .query(query)
        
        if (result === undefined) throw('se obtuvo un valor "undefined" al hacer la consulta en la base de datos. Funcion: MovementTypeDao.ListAll')
        return result.recordset
    },

    GetByTipoMvto: async (TIPOMVTO: String) => {
        const pool = await getConnection()
        const query = `SELECT TIPOMVTO, DESCRIPCIO, CODINT
        FROM ${ofima_db}.[dbo].${table}
        WHERE TIPOMVTO = '${TIPOMVTO}'`
        const result = await pool
            .request()
            .query(query)
        
        if (result === undefined) throw('se obtuvo un valor "undefined" al hacer la consulta en la base de datos. Funcion: MovementTypeDao.GetByCode')
        return result.recordset

    }
}

export default MovementTypeDao