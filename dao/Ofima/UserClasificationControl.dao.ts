import { getConnection } from "../../database/connection"
import appConfig from "../../config"

const ofima_db = appConfig.ofima_db
const controlOfima_db = appConfig.controlOfima_db
const table = 'MVCLASIFICACION'

const UserClasificationControlDao = {

    ListAll: async () => {
        const pool = await getConnection()
        const query = `SELECT CODCLASIFICA, VALORCLASIFICA, CODUSUARIO 
        FROM ${controlOfima_db}.[dbo].${table} 
        WHERE CODEMPRESA = '${ofima_db}'`
        const result = await pool
            ?.request()
            .query(query)
        
        if (result === undefined) throw('se obtuvo un valor "undefined" al hacer la consulta en la base de datos. Funcion: UserClasificationControlDao.ListAll')
        return result?.recordset
    }
}

export default UserClasificationControlDao