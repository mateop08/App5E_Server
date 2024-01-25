import CashRegisterDao from "../../dao/Ofima/CashRegister.dao"
import UserClasificationControlGestor from "./UserClasificationControl.model"

export interface CashRegister {
    Code: string,
    Description: string
}

const CashRegisterGestor = {

    AdaptFromDao(data: any) {
        const cashRegister: CashRegister = {
            Code: data.CODIGO.trimEnd(),
            Description: data.NOMBRE.trimEnd()
        }
        return cashRegister
    },

    async ListAll() {
        const data = await CashRegisterDao.ListAll()
        const cashRegisterList = data.map((e) => this.AdaptFromDao(e))
        return cashRegisterList
    },

    async ListByUser(User: string) {
        const cashRegisterList = await this.ListAll()
        const controlList = await UserClasificationControlGestor.FilterByUserAndClasficationCode(User, 'MTCAJAREG')
        const cashRegisterListByUser = cashRegisterList.filter((c) => {
            const cashRegister = controlList.find((control) => {
                if(control.AuthValue === c.Code) {
                    return c
                } else {
                    return
                }
            })
            return cashRegister
        })
        return cashRegisterListByUser
    },

    async GetByCode(Code: string) {
        const cashRegisterList = await this.ListAll()
        const cashRegister = cashRegisterList.find((c) => {
            if (c.Code === Code) {
                return c
            } else {
                return
            }
        })
        if (cashRegister === undefined) throw(`No fue posible encontrar la caja registradora con código ${Code}`)
        return cashRegister
    }
}

export default CashRegisterGestor