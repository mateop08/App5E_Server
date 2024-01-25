import appConfig from "../../config"
import { sql } from "../../database/connection"

const ofima_db = appConfig.ofima_db
const table = 'MVTRADE'

export interface MVTRADE_InsertData {
    BODEGA: string, CANTIDAD: number, CANTORIG: number, CANVENTA: number, CODCC: string, CODINT: number, CODRETE: string, 
    FECENT: string, FECHA: string, FECING: string, FECMOD: string, FHCOMPRA: string, HVALUNID: number, IVA: number, NOMBRE: string, 
    NRODCTO: number, NVALUNID: number, ORDENPRV: string, ORIGEN: string, PASSWORDIN: string, PORETE: number, PRODUCTO: string, 
    TARIVA: string, TIPODCTO: string, TIPOMVTO: string, TOPRETE: number, TOPRETICA: number, UNDBASE: string, UNDVENTA: string, 
    VALORUNIT: number, VALUNID: number, VENDEDOR: string, VLRVENTA: number, XNVALUNID: number, XVALUNID: number, ZVALORUNIT: number
}

const InvoiceLineDao = {

    Insert: async (inserData: MVTRADE_InsertData, request: sql.Request ) => {

        const {BODEGA, CANTIDAD, CANTORIG, CANVENTA, CODCC, CODINT, CODRETE, 
            FECENT, FECHA, FECING, FECMOD, FHCOMPRA, HVALUNID, IVA, NOMBRE, 
            NRODCTO, NVALUNID, ORDENPRV, ORIGEN, PASSWORDIN, PORETE, PRODUCTO, 
            TARIVA, TIPODCTO, TIPOMVTO, TOPRETE, TOPRETICA, UNDBASE, UNDVENTA, 
            VALORUNIT, VALUNID, VENDEDOR, VLRVENTA, XNVALUNID, XVALUNID, ZVALORUNIT} = inserData

        const query = `INSERT INTO ${ofima_db}.[dbo].${table}
            (BODEGA, CANTIDAD, CANTORIG, CANVENTA, CODCC, CODINT, CODRETE, 
            FECENT, FECHA, FECING, FECMOD, FHCOMPRA, HVALUNID, IVA, NOMBRE, 
            NRODCTO, NVALUNID, ORDENPRV, ORIGEN, PASSWORDIN, PORETE, PRODUCTO, 
            TARIVA, TIPODCTO, TIPOMVTO, TOPRETE, TOPRETICA, UNDBASE, UNDVENTA, 
            VALORUNIT, VALUNID, VENDEDOR, VLRVENTA, XNVALUNID, XVALUNID, ZVALORUNIT)
            VALUES
            ('${BODEGA}', '${CANTIDAD}', '${CANTORIG}', '${CANVENTA}', '${CODCC}', '${CODINT}', '${CODRETE}', 
            '${FECENT}', '${FECHA}', '${FECING}', '${FECMOD}', '${FHCOMPRA}', '${HVALUNID}', '${IVA}', '${NOMBRE}', 
            '${NRODCTO}', '${NVALUNID}', '${ORDENPRV}', '${ORIGEN}', '${PASSWORDIN}', '${PORETE}', '${PRODUCTO}', 
            '${TARIVA}', '${TIPODCTO}', '${TIPOMVTO}', '${TOPRETE}', '${TOPRETICA}', '${UNDBASE}', '${UNDVENTA}', 
            '${VALORUNIT}', '${VALUNID}', '${VENDEDOR}', '${VLRVENTA}', '${XNVALUNID}', '${XVALUNID}', '${ZVALORUNIT}')`
        //console.log(query)
        await request.query(query)
    }
}

export default InvoiceLineDao