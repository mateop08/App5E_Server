import { getConnection } from "../database/connection"
import appConfig from "../config"
const ofima_db = appConfig.ofima_db

const ProductsDao = {
    getByCode: async (Code: string, Store: string, PriceList: string, InventoryType: string) => {
        const pool = await getConnection()
        const query = `SELECT S.CODIGO as Code, M.DESCRIPCIO as Description, ISNULL (SUM(S.ICANTIDAD) - SUM(S.OCANTIDAD),0) AS Stock, P.PRECIO as Price 
        FROM ${ofima_db}.[dbo].[SALDOINV] S 
        INNER JOIN ${ofima_db}.[dbo].[MTMERCIA] M ON S.CODIGO = M.CODIGO 
        INNER JOIN ${ofima_db}.[dbo].[MVPRECIO] P ON P.CODPRODUC = S.CODIGO 
        WHERE M.ESPRODUCTO = '1' 
        AND M.TIPOINV = '${InventoryType}'
        AND S.BODEGA = '${Store}'
        AND M.CODIGO = '${Code}'
        AND P. UNIDAD = M.UNIDADMED
        AND P.CODPRECIO = '${PriceList}' GROUP BY S.CODIGO, M.DESCRIPCIO, P.PRECIO`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    },

    list: async (Description: string, Store: string, PriceList: string, InventoryType: string) => {
        const pool = await getConnection()
        const query = `SELECT S.CODIGO as Code, M.DESCRIPCIO as Description, ISNULL (SUM(S.ICANTIDAD) - SUM(S.OCANTIDAD),0) AS Stock, P.PRECIO as Price 
        FROM ${ofima_db}.[dbo].[SALDOINV] S 
        INNER JOIN ${ofima_db}.[dbo].[MTMERCIA] M ON S.CODIGO = M.CODIGO 
        INNER JOIN ${ofima_db}.[dbo].[MVPRECIO] P ON P.CODPRODUC = S.CODIGO 
        WHERE M.ESPRODUCTO = '1' 
        AND M.TIPOINV = '${InventoryType}'
        AND S.BODEGA = '${Store}'
        AND ((M.DESCRIPCIO LIKE '%${Description}%') OR (M.CODIGO LIKE '%${Description}%'))
        AND P. UNIDAD = M.UNIDADMED
        AND P.CODPRECIO = '${PriceList}' GROUP BY S.CODIGO, M.DESCRIPCIO, P.PRECIO`
        const result = await pool
            ?.request()
            .query(query)
        return result?.recordset
    }
}

export default ProductsDao