import WithHoldingTaxDao from "../../dao/Ofima/WithHoldingTax.dao"

export interface WithHoldingTax {
    Code: string,
    Description: string,
    Percent: number,
    Top: number,
}

const WithHoldingTaxGestor = {

    AdaptFromDao(data: any) {
        const withHoldingTax: WithHoldingTax = {
            Code: data.CODRETE.trimEnd(),
            Description: data.DESCRIPCIO.trimEnd(),
            Percent: data.PRETE,
            Top: data.TOPE
        }
        return withHoldingTax
    },

    async ListAll() {
        const data = await WithHoldingTaxDao.ListAll()
        const withHoldingTaxList = data.map((e) => this.AdaptFromDao(e))
        return withHoldingTaxList
    },

    async GetByCode(Code: string) {
        
        const data = await WithHoldingTaxDao.GetByCode(Code)
        const withHoldingTax = this.AdaptFromDao(data[0])
        return withHoldingTax
    }
}

export default WithHoldingTaxGestor