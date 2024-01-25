import { getConnection } from "../../database/connection"
import appConfig from "../../config"

const ofima_db = appConfig.ofima_db
const table = 'MTMERCIA'

const CatalogueItemDao = {

    ListAll: async () => {
        const pool = await getConnection()
        const query = `SELECT CODIGO, DESCRIPCIO, CODTARIVA, UNIDADMED, CODRETE
        FROM ${ofima_db}.[dbo].${table}`
        const result = await pool
            .request()
            .query(query)
        
        if (result === undefined) throw('se obtuvo un valor "undefined" al hacer la consulta en la base de datos. Funcion: CatalogueItemDao.ListAll')
        return result.recordset
    },

    GetByCode: async (CODIGO: String) => {
        const pool = await getConnection()
        const query = `SELECT CODIGO, DESCRIPCIO, CODTARIVA, UNIDADMED, CODRETE
        FROM ${ofima_db}.[dbo].${table}
        WHERE CODIGO = '${CODIGO}'`
        const result = await pool
            .request()
            .query(query)
        
        if (result === undefined) throw('se obtuvo un valor "undefined" al hacer la consulta en la base de datos. Funcion: CatalogueItemDao.GetByCode')
        return result.recordset

    }
}

export default CatalogueItemDao