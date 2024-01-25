import { getConnection } from "../../database/connection"
import appConfig from "../../config"

const ofima_db = appConfig.ofima_db
const table = 'CONSECUT'

const OfimaDocumentTypeDao = {

    ListAll: async () => {
        const pool = await getConnection()
        const query = `SELECT C.CODIGOCONS, C.TIPODCTO, C.ORIGEN, T.DCTOMAE, C.CONSECUT, C.CODINT, C.TIPOMVTO, C.DESCRIPCIO
        FROM ${ofima_db}.[dbo].${table} C
        INNER JOIN ${ofima_db}.[dbo].TIPODCTO T ON T.TIPODCTO = C.TIPODCTO AND T.ORIGEN = C.ORIGEN`
        
        const result = await pool
            .request()
            .query(query)
        if (result === undefined) throw('se obtuvo un valor "undefined" al hacer la consulta en la base de datos. Funcion: OfimaDocumentTypeDao.ListByUser')
        return result.recordset
    },

    UpdateConsecut: async (ConsecutiveCode: string, newConsecutive: number) => {
        const pool = await getConnection()
        const query = `UPDATE ${ofima_db}.[dbo].${table}
        SET CONSECUT = '${newConsecutive}'
        WHERE CODIGOCONS = '${ConsecutiveCode}'`
        await pool
            ?.request()
            .query(query)
    }
}

export default OfimaDocumentTypeDao