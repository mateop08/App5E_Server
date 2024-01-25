import { getConnection } from "../../database/connection"
import appConfig from "../../config"

const ofima_db = appConfig.ofima_db
const table = 'MTMEDPAG'

const PaymentMethodDao = {

    ListAll: async () => {
        const pool = await getConnection()
        const query = `SELECT MEDIOPAG, DESCRIPCIO, CONCEPTO, CODIGOCTA FROM ${ofima_db}.[dbo].${table}`
        const result = await pool
            ?.request()
            .query(query)
        if(result === undefined) throw(`Error: se obtuvo un valor "undefined" al hacer la consulta en la base de datos. Funcion: PaymentMethodDao.ListAll`)
        return result.recordset
    }
}

export default PaymentMethodDao