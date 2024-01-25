// `SELECT M.CODIGO as Codigo, M.DESCRIPCIO as Descripcion, P.PRECIO as Precio FROM [CI_SA].[dbo].[MTMERCIA] M INNER JOIN [CI_SA].[dbo].[MVPRECIO] P ON M.CODIGO = P.CODPRODUC WHERE M.ESPRODUCTO = '0' AND M.TIPOINV = '1' AND CODLINEA = 'ST' AND ((M.DESCRIPCIO LIKE '%${text}%') OR (M.CODIGO LIKE '%${text}%')) AND P.CODPRECIO = '${listaPrecio}' GROUP BY M.CODIGO, M.DESCRIPCIO, P.PRECIO`

import { getConnection } from "../database/connection"
import appConfig from "../config"
const ofima_db = appConfig.ofima_db

const ProductsDao = {
    getByCode: async (Code: string, PriceList: string, InventoryType: string, ServicesLine: string) => {
        const pool = await getConnection()
        const query = `SELECT M.CODIGO as Code, M.DESCRIPCIO as Description, P.PRECIO as Price 
        FROM ${ofima_db}.[dbo].[MTMERCIA] M 
        INNER JOIN ${ofima_db}.[dbo].[MVPRECIO] P ON M.CODIGO = P.CODPRODUC 
        WHERE M.ESPRODUCTO = '0' 
        AND M.TIPOINV = '${InventoryType}'
        AND CODLINEA = '${ServicesLine}'
        AND M.CODIGO = '${Code}'
        AND P.CODPRECIO = '${PriceList}' GROUP BY M.CODIGO, M.DESCRIPCIO, P.PRECIO`

        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    },

    list: async (Description: string, PriceList: string, InventoryType: string, ServicesLine: string) => {
        const pool = await getConnection()
        const query = `SELECT M.CODIGO as Code, M.DESCRIPCIO as Description, P.PRECIO as Price 
        FROM ${ofima_db}.[dbo].[MTMERCIA] M 
        INNER JOIN ${ofima_db}.[dbo].[MVPRECIO] P ON M.CODIGO = P.CODPRODUC 
        WHERE M.ESPRODUCTO = '0' 
        AND M.TIPOINV = '${InventoryType}'
        AND CODLINEA = '${ServicesLine}'
        AND ((M.DESCRIPCIO LIKE '%${Description}%') OR (M.CODIGO LIKE '%${Description}%')) 
        AND P.CODPRECIO = '${PriceList}' GROUP BY M.CODIGO, M.DESCRIPCIO, P.PRECIO`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    }
}

export default ProductsDao