import OrderStateDao from "../dao/OrderStates.dao"

interface OrderState {
    Code: string,
    Description: string,
    Default: boolean,
    Final: boolean
}

const OrderStateGestor = {

    async Create(OrderState: OrderState) {
        const {Code, Description, Default, Final} = OrderState
        if (await this.Exists(Code)) {
            throw(`El estado de orden ${Code} ya existe en la base de datos, no se puede volver a crear.`)
        }
        const existsDefault = await this.ExistsDefault()

        if (existsDefault) {
            const defaultOrder = await this.GetDefault()
            if (defaultOrder !== undefined) {
                
                if (defaultOrder.Code !== Code && Boolean(Default) === true) {
                    throw(`Actualmente existe una orden de estado por defecto, no se puede tener más de una orden por defecto en la base de datos.`)
                }
            }
        }

        await OrderStateDao.insert(Code, Description, Default, Final)
    },

    async ListAll() {
        const list = await OrderStateDao.listByDescription('')
        return list
    },

    async ListByDescription(Description: string) {
        const list = await OrderStateDao.listByDescription(Description)
        return list 
    },

    async GetByCode(Code: string) {
        const data = await OrderStateDao.getByCode(Code)
        if (data === undefined) {
            throw('Error al obtener el objeto OrderState, se obtuvo un valor "undefined" al hacer la consulta en la base de datos. Funcion: OrderState.GetByCode')
        }
        if (data.length === 0) {
            throw(`Error al obtener el objeto OrderState, no existe un estado de orden con código ${Code} en la base de datos.`)
        }
        if (data.length > 1) {
            throw(`Error al obtener el objeto OrderState, inconsistencia de datos: hay más de un estado de orden con código ${Code} en la base de datos, solo puede existir un estado de orden por defecto.`)
        }
        const orderState = data[0] as OrderState
        return orderState
    },

    async EditByCode(OrderState: OrderState) {
        const {Code, Description, Default, Final} = OrderState
        if (!await this.Exists(Code)) {
            throw(`El estado de orden ${Code} NO existe en la base de datos, no se puede modificar.`)
        }
        
        const existsDefault = await this.ExistsDefault()
        
        if (existsDefault) {
            const defaultOrder = await this.GetDefault()
            if (defaultOrder !== undefined) {
                
                if (defaultOrder.Code !== Code && Boolean(Default) === true) {
                    throw(`Actualmente existe una orden de estado por defecto, no se puede tener más de una orden por defecto en la base de datos.`)
                }
            }
        }
        
        await OrderStateDao.updateByCode(Code, Description, Default, Final)
    },

    async DeleteByCode(Code: string) {
        if (!await this.Exists(Code)) {
            throw(`El estado de orden ${Code} NO existe en la base de datos, no se puede eliminar.`)
        }
        await OrderStateDao.deleteByCode(Code)
    },

    async Exists(Code: string) {
        const result = await OrderStateDao.getByCode(Code)
        if (result === undefined || result?.length < 1 ) {
            return false
        }
        return true
    },

    async ExitsDefault() {
        const data = await OrderStateDao.getDefault()
        if (data === undefined) {
            throw('Error al obtener el objeto OrderState, se obtuvo un valor "undefined" al hacer la consulta en la base de datos. Funcion: OrderState.GetDefault')
        }
        if (data.length > 1) {
            throw('Error al obtener el objeto OrderState, inconsistencia de datos: hay más de un estado de orden por defecto en la base de datos, solo puede existir un estado de orden por defecto.')
        }
        if (data.length === 0) {
            return false
        } else {
            return true
        }
    },

    async GetDefault() {
        const data = await OrderStateDao.getDefault()
        if (data === undefined) {
            throw('Error al obtener el objeto OrderState, se obtuvo un valor "undefined" al hacer la consulta en la base de datos. Funcion: OrderState.GetDefault')
        }
        if (data.length === 0) {
            throw('Error al obtener el objeto OrderState, no existe un estado de orden por defecto en la base de datos.')
        }
        if (data.length > 1) {
            throw('Error al obtener el objeto OrderState, inconsistencia de datos: hay más de un estado de orden por defecto en la base de datos, solo puede existir un estado de orden por defecto.')
        }
        const orderState = data[0] as OrderState
        return orderState
    },

    async GetFinal() {
        const data = await OrderStateDao.getFinal()
        if (data === undefined) {
            throw('Error al obtener el objeto OrderState, se obtuvo un valor "undefined" al hacer la consulta en la base de datos. Funcion: OrderState.GetFinal')
        }
        if (data.length === 0) {
            throw('Error al obtener el objeto OrderState, no existe un estado de orden de tipo finalizado en la base de datos.')
        }
        if (data.length > 1) {
            throw('Error al obtener el objeto OrderState, inconsistencia de datos: hay más de un estado de orden de tipo finalizado en la base de datos, solo puede existir un estado de orden de tipo finalizado.')
        }
        const orderState = data[0] as OrderState
        return orderState
    },

    async ExistsDefault() {
        const result = await OrderStateDao.getDefault()
        if (result === undefined || result?.length < 1 ) {
            return false
        }
        return true
    },

    async ExistsFinal() {
        const result = await OrderStateDao.getFinal()
        if (result === undefined || result?.length < 1 ) {
            return false
        }
        return true
    },

    async ValidateFinalState(orderState: OrderState) {
        const finalOrderState = await this.GetFinal()
        if(String(orderState.Code.trimEnd()) === String(finalOrderState.Code.trimEnd())) { 
            return true
        } else {
            return false
        }
    }
}
 

export default OrderStateGestor
export type {OrderState}