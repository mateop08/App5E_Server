import CreditPortfolioDao from "../../dao/Ofima/CreditPortfolio.dao"
import { Customer } from "./Customer.model"

export interface CreditPortfolio {
    CustomerId: string,
    CreditBalance: number
}

const CreditPortfolioGestor = {

    AdaptFromDao(data: any) {
        
        const creditPortfolio: CreditPortfolio = {
            CustomerId: data.Cliente,
            CreditBalance: data.Saldo
        }
       
        return creditPortfolio
    },

    GetEmptyBalance(CustomerId: string) {
        const creditPortfolio: CreditPortfolio = {
            CustomerId: CustomerId,
            CreditBalance: 0
        }
        return creditPortfolio
    },

    async GetByCustomer(Customer: Customer) {
        const {Identification} = Customer
        const data = await CreditPortfolioDao.GetCreditBalance(Identification)
        let creditPortfolio: CreditPortfolio
        if (data.length === 0) {
            creditPortfolio = this.GetEmptyBalance(Identification)
        } else {
            creditPortfolio = this.AdaptFromDao(data[0])
        }
        return creditPortfolio
    }
}

export default CreditPortfolioGestor