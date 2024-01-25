import VariablesDao from "../../dao/Ofima/Variables.dao"


export interface Variable {
    Field: string,
    Value: string | number,
    User: string
}

const VariablesGestor = {

    async AdaptFromDao(data: any) {
        let value: any
        if (typeof data.VALOR === 'string') {
            value = data.VALOR.trimEnd()
        } else {
            value = data.VALOR
        }
        const variable: Variable = {
            Field: data.CAMPO,
            Value: value,
            User: data.USUARIO
        }
        return variable
    },

    async GetByField(Field: string) {
        const data = await VariablesDao.Get(Field, '')
        const variable = await this.AdaptFromDao(data[0])
        return variable
    },

    async GetByFieldAndUser(Field: string, User: string) {
        const data = await VariablesDao.Get(Field, User)
        const variable = await this.AdaptFromDao(data[0])
        return variable
    }
}

export default VariablesGestor