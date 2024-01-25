import { sql } from "../../database/connection"
import appConfig from "../../config"

const ofima_db = appConfig.ofima_db
const table = 'TRADE'

export interface TRADE_InsertData {
    ACTIVA: number, BRUTO: number, CAJAREG: string, CIUDADCLI: string, CODCC: string, CODIGOCTA: string, CODINT: number, 
    CODRETE: string, CODVEN: string, CONSFECHA: string, CONTADO: 0 | 1, CTRLCORIG: number, CTRTOPES: number, 
    DECIMALES: number, DIR: string, FACTORSUS: number, FECCAJA: string, FECHA: string, FECHA1: string, FECHA2: string, 
    FECHA3: string, FECHAING: string, FECHAMOD: string, FECHANIF: string, FECHAPANTE: string, FECING: string, FECMOD: string, 
    FHAUTORIZA: string, FISRL: string, FIVA: string, FLLAMADA: string, FRECAUDO: string, HORA: string,
    IVABRUTO: number, MEDIOPAG: string, MEFECHAT: string, NIT: string, NOTA: string, NRODCTO: number, ORDEN: string, ORIGEN: string, 
    PASSWORDIN: string, PGIVA: number, PRIORIDAD: number, REMISION: string, RESPRETE: number, TIPODCTO: string, 
    TIPOMVTO: string, TIPOPER: string, TIPOVTA: string, TOPE: number, TRANSPORTA: string, UNDTRIBU: number
}

const InvoiceHeaderDao = {

    Insert: async (inserData: TRADE_InsertData, request: sql.Request) => {

        const {ACTIVA, BRUTO, CAJAREG, CIUDADCLI, CODCC, CODIGOCTA, CODINT, CODRETE, CODVEN, CONSFECHA, CONTADO, 
            CTRLCORIG, CTRTOPES, DECIMALES, DIR, FACTORSUS, FECCAJA, FECHA, FECHA1, FECHA2, FECHA3, FECHAING, 
            FECHAMOD, FECHANIF, FECHAPANTE, FECING, FECMOD, FHAUTORIZA, FISRL, FIVA, FLLAMADA, FRECAUDO, HORA,
            IVABRUTO, MEDIOPAG, MEFECHAT, NIT, NOTA, NRODCTO, ORDEN, ORIGEN, PASSWORDIN, PGIVA, PRIORIDAD, 
            REMISION, RESPRETE, TIPODCTO, TIPOMVTO, TIPOPER, TIPOVTA, TOPE, TRANSPORTA, UNDTRIBU} = inserData

        const query = `INSERT INTO ${ofima_db}.[dbo].${table}
            (ACTIVA, BRUTO, CAJAREG, CIUDADCLI, CODCC, CODIGOCTA, CODINT, CODRETE, CODVEN, CONSFECHA, CONTADO, 
            CTRLCORIG, CTRTOPES, DECIMALES, DIR, FACTORSUS, FECCAJA, FECHA, FECHA1, FECHA2, FECHA3, FECHAING, 
            FECHAMOD, FECHANIF, FECHAPANTE, FECING, FECMOD, FHAUTORIZA, FISRL, FIVA, FLLAMADA, FRECAUDO, HORA,
            IVABRUTO, MEDIOPAG, MEFECHAT, NIT, NOTA, NRODCTO, ORDEN, ORIGEN, PASSWORDIN, PGIVA, PRIORIDAD, 
            REMISION, RESPRETE, TIPODCTO, TIPOMVTO, TIPOPER, TIPOVTA, TOPE, TRANSPORTA, UNDTRIBU)
            VALUES
            ('${ACTIVA}', '${BRUTO}', '${CAJAREG}', '${CIUDADCLI}', '${CODCC}', '${CODIGOCTA}', '${CODINT}', '${CODRETE}', 
            '${CODVEN}', '${CONSFECHA}', '${CONTADO}', '${CTRLCORIG}', '${CTRTOPES}', '${DECIMALES}', '${DIR}', 
            '${FACTORSUS}', '${FECCAJA}', '${FECHA}', '${FECHA1}', '${FECHA2}', '${FECHA3}', '${FECHAING}', '${FECHAMOD}', 
            '${FECHANIF}', '${FECHAPANTE}', '${FECING}', '${FECMOD}', '${FHAUTORIZA}', '${FISRL}', '${FIVA}', '${FLLAMADA}', 
            '${FRECAUDO}', '${HORA}', '${IVABRUTO}', '${MEDIOPAG}', '${MEFECHAT}', '${NIT}', '${NOTA}', '${NRODCTO}', '${ORDEN}', 
            '${ORIGEN}', '${PASSWORDIN}', '${PGIVA}', '${PRIORIDAD}', '${REMISION}', '${RESPRETE}', '${TIPODCTO}', 
            '${TIPOMVTO}', '${TIPOPER}', '${TIPOVTA}', '${TOPE}', '${TRANSPORTA}', '${UNDTRIBU}')`
        //console.log(query)
        await request.query(query)
    }
}

export default InvoiceHeaderDao