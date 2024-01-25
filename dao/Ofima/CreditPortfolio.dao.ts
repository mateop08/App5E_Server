import { getConnection } from "../../database/connection"
import appConfig from "../../config"

const ofima_db = appConfig.ofima_db

const CreditPortfolioDao = {

    GetCreditBalance: async (CustomerId: string) => {
        const pool = await getConnection()
        const query = `SELECT SUM(Saldo) AS Saldo, Cliente FROM ${ofima_db}.[dbo].fnvOF_ReporteCartera (GETDATE(), GETDATE())
        WHERE Saldo < 0 AND Cliente = '${CustomerId}'
        GROUP BY Cliente`
        const result = await pool
            ?.request()
            .query(query)
        if (result === undefined) throw('se obtuvo un valor "undefined" al hacer la consulta en la base de datos. Funcion: CreditPortfolioDao.GetCreditBalance')
        return result.recordset
    }
}

export default CreditPortfolioDao