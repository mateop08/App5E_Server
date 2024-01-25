import { getConnection } from "../../database/connection"
import appConfig from "../../config"

const ofima_db = appConfig.ofima_db
const table = 'MTTOPRTE'

const WithHoldingTaxDao = {

    ListAll: async () => {
        const pool = await getConnection()
        const query = `SELECT CODRETE, DESCRIPCIO, PRETE, TOPE
        FROM ${ofima_db}.[dbo].${table}`
        const result = await pool
            .request()
            .query(query)
        
        if (result === undefined) throw('se obtuvo un valor "undefined" al hacer la consulta en la base de datos. Funcion: WithHoldingTaxDao.ListAll')
        return result.recordset
    },

    GetByCode: async (CODRETE: String) => {
        const pool = await getConnection()
        const query = `SELECT CODRETE, DESCRIPCIO, PRETE, TOPE
        FROM ${ofima_db}.[dbo].${table}
        WHERE CODRETE = '${CODRETE}'`
        const result = await pool
            .request()
            .query(query)
        //console.log(query)
        
        if (result === undefined) throw('se obtuvo un valor "undefined" al hacer la consulta en la base de datos. Funcion: WithHoldingTaxDao.GetByCode')
        return result.recordset

    }
}

export default WithHoldingTaxDao