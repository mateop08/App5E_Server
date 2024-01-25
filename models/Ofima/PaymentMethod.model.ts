import PaymentMethodDao from "../../dao/Ofima/PaymentMethod.dao"
import UserClasificationControlGestor from "./UserClasificationControl.model"

export interface PaymentMethod {
    Code: string,
    Description: string,
    Account: string,
    Concept: string,
}

export const PaymentMethodGestor = {

    AdaptFromDao(data: any) {
        const paymentMethod: PaymentMethod = {
            Code: data.MEDIOPAG.trimEnd(),
            Description: data.DESCRIPCIO.trimEnd(),
            Account: data.CODIGOCTA.trimEnd(),
            Concept: data.CONCEPTO.trimEnd()
        }
        return paymentMethod
    },

    async ListAll() {
        const data = await PaymentMethodDao.ListAll()
        const paymentMethodList = data.map((e) => this.AdaptFromDao(e))
        return paymentMethodList
    },

    async ListByUser(User: string) {
        const paymentMethodList = await this.ListAll()
        const controlList = await UserClasificationControlGestor.FilterByUserAndClasficationCode(User, 'MTMEDPAG')
        const paymentMethodListByUser = paymentMethodList.filter((p) => {
            const paymentMethod = controlList.find((control) => {
                if(control.AuthValue === p.Code) {
                    return p
                } else {
                    return
                }
            })
            return paymentMethod
        })
        return paymentMethodListByUser
    },

    async GetByCode(Code: string) {
        const list = await this.ListAll()
        const payment = list.find((p) => {
            if (p.Code === Code) {
                return p
            } else {
                return
            }
        })
        if (payment === undefined) throw(`No se pudo encontrar el código de medio de pago ${Code}`)
        return payment
    }
}

export default PaymentMethodGestor