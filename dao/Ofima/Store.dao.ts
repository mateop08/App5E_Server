import { getConnection } from "../../database/connection"
import appConfig from "../../config"

const ofima_db = appConfig.ofima_db
const table = 'MTBODEGA'

const StoreDao = {

    ListAll: async () => {
        const pool = await getConnection()
        const query = `SELECT LOGIN, DESCRIPCIO FROM ${ofima_db}.[dbo].${table}`
        const result = await pool
            .request()
            .query(query)
        if(result === undefined) throw(`Error: se obtuvo un valor "undefined" al hacer la consulta en la base de datos. Funcion: StoreDao.ListAll`)
        return result.recordset
    }
}

export default StoreDao