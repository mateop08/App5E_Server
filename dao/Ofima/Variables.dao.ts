import { getConnection } from "../../database/connection"
import appConfig from "../../config"

const ofima_db = appConfig.ofima_db

const VariableDao = {

    Get: async (Field: string, User: string, ) => {
        const pool = await getConnection()
        const query = `SELECT VALOR = ${ofima_db}.[dbo].F_Extraer_Variable ('${Field}','${User}','CO'),
            CAMPO = '${Field}', USUARIO = '${User}'`
        const result = await pool
            .request()
            .query(query)
        if (result === undefined) throw('se obtuvo un valor "undefined" al hacer la consulta en la base de datos. Funcion: VariableDao.Get')
        return result.recordset
    }
}

export default VariableDao