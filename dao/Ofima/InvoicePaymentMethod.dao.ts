import appConfig from "../../config"
import { sql } from "../../database/connection"

const ofima_db = appConfig.ofima_db
const table = 'MVCUADRE'

export interface MVCUADRE_InsertData {
    BANCO: string, CODBANCO: string, CODPLAZA: string, COMENTARIO: string, CTACHEQUE: string, DCTO: number, FACTURA: number, 
    FECHACHQ: string, FECHAMVTO: string, FECING: string, FECMOD: string, MEDIOPAG: string, NIT: string, NROCHEQUE: string, 
    PAGODATAF: string, PASSWORDIN: string, TIPODCTO: string, TIPODCTOFA: string, VALOR: number
}

const InvoicePaymentMethodDao = {

    Insert: async (inserData: MVCUADRE_InsertData, request: sql.Request ) => {

        const {BANCO, CODBANCO, CODPLAZA, COMENTARIO, CTACHEQUE, DCTO, FACTURA, FECHACHQ, FECHAMVTO, 
            FECING, FECMOD, MEDIOPAG, NIT, NROCHEQUE, PAGODATAF, PASSWORDIN, TIPODCTO, TIPODCTOFA, VALOR} = inserData

        const query = `INSERT INTO ${ofima_db}.[dbo].${table}
            (BANCO, CODBANCO, CODPLAZA, COMENTARIO, CTACHEQUE, DCTO, FACTURA, FECHACHQ, FECHAMVTO, 
            FECING, FECMOD, MEDIOPAG, NIT, NROCHEQUE, PAGODATAF, PASSWORDIN, TIPODCTO, TIPODCTOFA, VALOR)
            VALUES
            ('${BANCO}', '${CODBANCO}', '${CODPLAZA}', '${COMENTARIO}', '${CTACHEQUE}', '${DCTO}', '${FACTURA}', '${FECHACHQ}', '${FECHAMVTO}', 
            '${FECING}', '${FECMOD}', '${MEDIOPAG}', '${NIT}', '${NROCHEQUE}', '${PAGODATAF}', '${PASSWORDIN}', '${TIPODCTO}', '${TIPODCTOFA}', '${VALOR}')`
        //console.log(query)
        await request.query(query)
    }
}

export default InvoicePaymentMethodDao