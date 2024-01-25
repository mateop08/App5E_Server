import StoreDao from "../../dao/Ofima/Store.dao"
import UserClasificationControlGestor from "./UserClasificationControl.model"

export interface Store {
    Code: string,
    Description: string
}

const StoreGestor = {

    AdaptFromDao(data: any) {
        const costCenter: Store = {
            Code: data.LOGIN.trimEnd(),
            Description: data.DESCRIPCIO.trimEnd()
        }
        return costCenter
    },

    async ListAll() {
        const data = await StoreDao.ListAll()
        const costCenterList = data.map((e) => this.AdaptFromDao(e))
        return costCenterList
    },

    async ListByUser(User: string) {
        const costCenterList = await this.ListAll()
        const controlList = await UserClasificationControlGestor.FilterByUserAndClasficationCode(User, 'VBODEGAS')
        const costCenterListByUser = costCenterList.filter((c) => {
            const costCenter = controlList.find((control) => {
                if(control.AuthValue === c.Code) {
                    return c
                } else {
                    return
                }
            })
            return costCenter
        })
        return costCenterListByUser
    },

    async GetByCode(Code: string) {
        const costCenterList = await this.ListAll()
        const costCenter = costCenterList.find((c) => {
            if (c.Code === Code) {
                return c
            } else {
                return
            }
        })
        if (costCenter === undefined) throw(`No fue posible encontrar la bodega con código ${Code}`)
        return costCenter
    },

    async Exists(Code: string) {
        try {
            await this.GetByCode(Code)
            return true
        } catch (error) {
            return false
        }
        
    }
}

export default StoreGestor