import CustomerDao from "../../dao/Ofima/Customer.dao"
import WithHoldingTaxGestor, { WithHoldingTax } from "./WithHoldingTax.model"


export interface Customer {
    Identification: string,
    FullName: string,
    City: string,
    Address: string,
    PersonType: string,
    WithHoldingTax: WithHoldingTax
}

const CustomerGestor = {

    async AdaptFromDao(data: any) {

        const withHoldingTax = await WithHoldingTaxGestor.GetByCode(data.CODRETE)
        const customer: Customer = {
            Identification: data.NIT,
            FullName: data.NOMBRE,
            City: data.CIUDAD,
            Address: data.DIRECCION,
            PersonType: data.TIPOPER,
            WithHoldingTax: withHoldingTax
        }
       
        return customer
    },

    async Search(searchText: string) {
        const data = await CustomerDao.listByName(searchText)
        const customerList = await Promise.all(data.map(async(e) => await this.AdaptFromDao(e)))
        return customerList
    },

    async GetByIdentification(Identification: string) {
        const data = await CustomerDao.GetByIdentification(Identification)
        if (data.length === 0) throw(`El cliente con identificación ${Identification} no existe en la base de datos.`)
        const customer = await this.AdaptFromDao(data[0])
        return customer
    }
}

export default CustomerGestor