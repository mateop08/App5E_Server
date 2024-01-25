import sql, { ConnectionPool, config } from 'mssql'
import appConfig from '../config'

const dbSettings: config = {
    user: appConfig.user,
    password: appConfig.password,
    server: appConfig.server,
    database: appConfig.app_db,
    options: {
        encrypt: true, //for azure
        trustServerCertificate: true, // change to true for local dev / self-signed certs
    }
}

export async function getConnection() {
    
    try {
        const pool: ConnectionPool = await sql.connect(dbSettings);
        return pool;
    } catch (error) {
        const message = 'Hubo un error al conectar a la base de datos ' + error
        throw(message)
    }
}

export {sql}