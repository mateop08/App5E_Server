import { config } from 'dotenv'

config()

interface AppConfig {
    port: number,
    server: string,
    app_db: string,
    ofima_db: string,
    controlOfima_db: string,
    user: string,
    password: string,
    token_key: string
    route: string
}


const appConfig: AppConfig = {
    port: Number(process.env.PORT) || 3002,
    server: String(process.env.SERVER),
    app_db: String(process.env.APP5E_DATABASE),
    ofima_db: String(process.env.OFIMA_DATABASE),
    controlOfima_db: String(process.env.CONTROLOFIMA_DATABASE),
    user: String(process.env.USER),
    password: String(process.env.PASSWORD),
    token_key: String(process.env.TOKEN_KEY),
    route: String(process.env.TOKEN_KEY)
}
export default appConfig