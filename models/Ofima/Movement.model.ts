import MovementTypeDao from "../../dao/Ofima/MovementType.dao"

export interface MovementType {
    Code: string,
    Description: string,
    IntegrationCode: number
}

const MovementTypeGestor = {

    AdaptFromDao(data: any) {
        const movementType: MovementType = {
            Code: data.TIPOMVTO.trimEnd(),
            Description: data.DESCRIPCIO.trimEnd(),
            IntegrationCode: data.CODINT
        }
        return movementType
    },

    async ListAll() {
        const data = await MovementTypeDao.ListAll()
        const movementTypeList = data.map((e) => this.AdaptFromDao(e))
        return movementTypeList
    },

    async GetByCode(Code: string) {
        const data = await MovementTypeDao.GetByTipoMvto(Code)
        const movementType = this.AdaptFromDao(data[0])
        return movementType
    }
}

export default MovementTypeGestor