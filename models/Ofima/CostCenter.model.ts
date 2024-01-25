import CostCenterDao from "../../dao/Ofima/CostCenter.dao"
import UserClasificationControlGestor from "./UserClasificationControl.model"

export interface CostCenter {
    Code: string,
    Description: string
}

const CostCenterGestor = {

    AdaptFromDao(data: any) {
        const costCenter: CostCenter = {
            Code: data.CODCC.trimEnd(),
            Description: data.NOMBRE.trimEnd()
        }
        return costCenter
    },

    async ListAll() {
        const data = await CostCenterDao.ListAll()
        const costCenterList = data.map((e) => this.AdaptFromDao(e))
        return costCenterList
    },

    async ListByUser(User: string) {
        const costCenterList = await this.ListAll()
        const controlList = await UserClasificationControlGestor.FilterByUserAndClasficationCode(User, 'CENTCOS')
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
        if (costCenter === undefined) throw(`No fue posible encontrar el centro de costos con código ${Code}`)
        return costCenter
    }
}

export default CostCenterGestor