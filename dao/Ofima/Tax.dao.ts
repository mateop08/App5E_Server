import { getConnection } from "../../database/connection"
import appConfig from "../../config"

const ofima_db = appConfig.ofima_db
const table = 'MTTARIVA'

const TaxDao = {

    ListAll: async () => {
        const pool = await getConnection()
        const query = `SELECT CODTARIVA, DESCRIPCIO, PORCIVA
        FROM ${ofima_db}.[dbo].${table}`
        const result = await pool
            .request()
            .query(query)
        
        if (result === undefined) throw('se obtuvo un valor "undefined" al hacer la consulta en la base de datos. Funcion: TaxDao.ListAll')
        return result.recordset
    },

    GetByCode: async (CODTARIVA: String) => {
        const pool = await getConnection()
        const query = `SELECT CODTARIVA, DESCRIPCIO, PORCIVA
        FROM ${ofima_db}.[dbo].${table}
        WHERE CODTARIVA = '${CODTARIVA}'`
        const result = await pool
            .request()
            .query(query)
        
        if (result === undefined) throw('se obtuvo un valor "undefined" al hacer la consulta en la base de datos. Funcion: TaxDao.GetByCode')
        return result.recordset

    }
}

export default TaxDao