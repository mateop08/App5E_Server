import TaxDao from "../../dao/Ofima/Tax.dao"

export interface Tax {
    Code: string,
    Description: string,
    Percent: number
}

const TaxGestor = {

    AdaptFromDao(data: any) {
        const tax: Tax = {
            Code: data.CODTARIVA.trimEnd(),
            Description: data.DESCRIPCIO.trimEnd(),
            Percent: Number(data.PORCIVA)
        }
        return tax
    },

    async ListAll() {
        const data = await TaxDao.ListAll()
        const taxList = data.map((e) => this.AdaptFromDao(e))
        return taxList
    },

    async GetByCode(Code: string) {
        const data = await TaxDao.GetByCode(Code)
        const tax = this.AdaptFromDao(data[0])
        return tax
    }
}

export default TaxGestor