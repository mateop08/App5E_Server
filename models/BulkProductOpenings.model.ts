import BulkProductOpeningDao from "../dao/BulkProductOpenings.dao"
import { InterventionRecord, InterventionRecordGestor } from "./InterventionRecord.model"
import { DateTime } from "luxon"
import UserGestor from "./Users.model"
import BulkProductOpeningsDao from "../dao/BulkProductOpenings.dao"
import ProductGestor from "./Products.model"

interface BulkProductOpening {
    OpeningId: number,
    ProductCode: string,  
    Active: boolean,
    InterventionRecord: InterventionRecord
    LeftOverAmount: number
}

const BulkProductOpeningGestor = {

    ConstructFromDao(data: any) {
        const bulkProductOpening: BulkProductOpening = {
            OpeningId: data.OpeningId,
            ProductCode: data.ProductCode,  
            Active: data.Active,
            LeftOverAmount: data.LeftOverAmount,
            InterventionRecord: InterventionRecordGestor.ConstructFromDao(data.OpenDate, data.OpenedBy, data.CloseDate, data.ClosedBy)
        }

        return bulkProductOpening
    },

    AdaptToTransfer(bulkProductOpening: BulkProductOpening) {
        const { InterventionRecord, ...rest} = bulkProductOpening

        const AdaptInterventionRecord = InterventionRecordGestor.AdaptToTransfer(InterventionRecord)

        const { CreationDate, CreatedBy, ModificationDate, ModifiedBy } = AdaptInterventionRecord

        const transferObject = {
            ...rest,
            InterventionRecord: {
                OpenDate: CreationDate,
                OpenedBy: CreatedBy,
                CloseDate: ModificationDate,
                ClosedBy: ModifiedBy
            }
            
        }
        return transferObject
    },

    AdaptToInsert(bulkProductOpening: BulkProductOpening) {
        const { InterventionRecord, ...rest} = bulkProductOpening
        const AdaptInterventionRecord = InterventionRecordGestor.AdaptToInsert(InterventionRecord)
        const { CreationDate, CreatedBy, ModificationDate, ModifiedBy } = AdaptInterventionRecord

        const adaptObject = {
            OpenDate: CreationDate,
            OpenedBy: CreatedBy,
            CloseDate: ModificationDate,
            ClosedBy: ModifiedBy,
            ...rest
        }
        return adaptObject

    },

    AdaptForUpdate(bulkProductOpening: BulkProductOpening) {
        const { OpeningId, InterventionRecord, ...rest} = bulkProductOpening
        const AdaptInterventionRecord = InterventionRecordGestor.AdaptForUpdate(InterventionRecord)
        if (OpeningId === null) throw("Error, no es posible actualizar los datos si el OpeningId es null.")
        const { CreationDate, CreatedBy, ModificationDate, ModifiedBy } = AdaptInterventionRecord

        const adaptObject = {
            OpeningId: OpeningId,
            OpenDate: CreationDate,
            OpenedBy: CreatedBy,
            CloseDate: ModificationDate,
            ClosedBy: ModifiedBy,
            ...rest
        }
        return adaptObject

    },

    async Create(ProductCode: string, User: string) {
        if (await this.ExistsActive(ProductCode)) {
            throw(`El producto ${ProductCode} actualmente tiene una apertura de producto a granel activa, no se puede volver a aperturar.`)
        }

        const product = ProductGestor.Construct(ProductCode, '', 0)
        if (!product.IsBulk) throw(`El producto ${ProductCode} no es un producto a granel, no se puede aperturar.`)

        const today = DateTime.local()
        const bulkProductOpening: BulkProductOpening = {
            ProductCode: ProductCode,
            Active: true,
            LeftOverAmount: 0,
            InterventionRecord: {
                CreationDate: today,
                CreatedBy: (await UserGestor.GetByUserCode(User)).UserCode,
                ModificationDate: null, 
                ModifiedBy: null
            },
            OpeningId: 0
        }
        const inserData = this.AdaptToInsert(bulkProductOpening)
        await BulkProductOpeningDao.insert(inserData)
    },

    async Close(OpeningId: number, LeftOverAmount: number, User: string) {
        
        const oldBulkProductOpening = await this.GetByOpeningId(OpeningId)
        if (!oldBulkProductOpening.Active) throw("La apertura de producto a granel actualmente se encuentra cerrada, no se puede volver a cerrar.")
        const {ProductCode, InterventionRecord: {CreatedBy, CreationDate} } = oldBulkProductOpening
        const today = DateTime.local()
        const newBulProductOpening: BulkProductOpening = {
            OpeningId: OpeningId,
            ProductCode: ProductCode,
            Active: false,
            InterventionRecord: {
                CreatedBy: CreatedBy,
                CreationDate: CreationDate,
                ModificationDate: today,
                ModifiedBy: (await UserGestor.GetByUserCode(User)).UserCode
            },
            LeftOverAmount: LeftOverAmount
        }
        const updateData = this.AdaptForUpdate(newBulProductOpening)
        await BulkProductOpeningsDao.updateByOpeningId(updateData)
    }, 

    async ListAll() {
        const list = await BulkProductOpeningDao.listAll()
        if (list === undefined) throw('Error al obtener el objeto BulkProductOpening, se obtuvo un valor "undefined" al hacer la consulta en la base de datos. Funcion: BulkProductOpening.GetByCode')
        const adaptObject = list.map((e) => this.ConstructFromDao(e))
        return adaptObject
    },

    async GetTransferListAll() {
        const list = await this.ListAll()
        const adaptTransfer = list.map((e) => this.AdaptToTransfer(e) ) 
        return adaptTransfer

    },

    async ListActives() {
        const data = await BulkProductOpeningDao.listActives()
        if (!data) throw('Error al obtener el objeto BulkProductOpening, se obtuvo un valor "undefined" al hacer la consulta en la base de datos. Funcion: BulkProductOpening.ListActives')
        const bulkProductOpeningList = data.map((e) => this.ConstructFromDao(e))
        return bulkProductOpeningList
    },

    async GetTransferListActives() {
        const list = await this.ListActives()
        const adaptTransfer = list.map((e) => this.AdaptToTransfer(e))
        return adaptTransfer
    },

    async GetByOpeningId(OpeningId: number) {
        const data = await BulkProductOpeningDao.getById(OpeningId)
        if (data === undefined) {
            throw('Error al obtener el objeto BulkProductOpening, se obtuvo un valor "undefined" al hacer la consulta en la base de datos. Funcion: BulkProductOpening.GetByCode')
        }
        if (data.length === 0) {
            throw(`Error al obtener el objeto BulkProductOpening, no existe una apertura de producto a granel con OpeningId ${OpeningId} en la base de datos.`)
        }
        if (data.length > 1) {
            throw(`Error al obtener el objeto BulkProductOpening, inconsistencia de datos: hay más de una apertura de producto a granel con OpeningId ${OpeningId} en la base de datos.`)
        }
        const adaptBulkProductOpening = this.ConstructFromDao(data[0])
        return adaptBulkProductOpening
    },

    async GetTransferByOpeningId(OpeningId: number) {
        const bulkProductOpening = await this.GetByOpeningId(OpeningId)
        const adaptObject = this.AdaptToTransfer(bulkProductOpening)
        return adaptObject
    },

    async GetActive(ProductCode: string) {
        const list = await this.ListActives()
        const activeBulkProductOpening = list.find((e) => {
            if (e.ProductCode === ProductCode) {
                return e
            } else {
                return
            }
        })
        if (!activeBulkProductOpening) throw(`No existe una apertura de producto a granel activa para el producto: ${ProductCode}`)
        return activeBulkProductOpening
    },

    async Exists(OpeningId: number) {
        const result = await BulkProductOpeningDao.getById(OpeningId)
        if (result === undefined || result?.length < 1 ) {
            return false
        }
        return true
    },

    async ExistsActive(ProductCode: string) {
        try {
            await this.GetActive(ProductCode)
            return true
        } catch (error) {
            return false
        }
    }
}
 

export default BulkProductOpeningGestor
export type {BulkProductOpening}