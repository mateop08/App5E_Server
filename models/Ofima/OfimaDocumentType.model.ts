import OfimaDocumentTypeDao from "../../dao/Ofima/OfimaDocumentType.dao"
import MovementTypeGestor, { MovementType } from "./Movement.model"
import UserClasificationControlGestor from "./UserClasificationControl.model"

export interface OfimaDocumentType {
    ConsecutiveCode: string,
    Description: string,
    DocumentType: string,
    Origin: string,
    MasterDocument: string,
    Consecutive: number,
    IntegrationCode: number,
    MovementType: MovementType
}

const OfimaDocumentTypeGestor = {

    async AdaptFromDao(data: any) {
        const movementType = await MovementTypeGestor.GetByCode(data.TIPOMVTO.trimEnd())
        const ofimaDocumentType: OfimaDocumentType = {
            ConsecutiveCode: data.CODIGOCONS.trimEnd(),
            Description: data.DESCRIPCIO.trimEnd(),
            DocumentType: data.TIPODCTO.trimEnd(),
            Origin: data.ORIGEN.trimEnd(),
            MasterDocument: data.DCTOMAE.trimEnd(),
            Consecutive: data.CONSECUT,
            IntegrationCode: data.CODINT,
            MovementType: movementType
        }
        return ofimaDocumentType
    },

    async ListAll() {
        const data = await OfimaDocumentTypeDao.ListAll()
        const ofimaDocumentTypeList = await Promise.all(data.map(async(e) => await this.AdaptFromDao(e)))
        return ofimaDocumentTypeList
    },

    async ListByUser(User: string) {
        const ofimaDocumentTypeList = await this.ListAll()
        //console.log(ofimaDocumentTypeList)
        const controlList = await UserClasificationControlGestor.FilterByUserAndClasficationCode(User, 'CONSECUT')
        const ofimaDocumentTypeListByUser = ofimaDocumentTypeList.filter((c) => {
            const ofimaDocumentType = controlList.find((control) => {
                if(control.AuthValue === c.ConsecutiveCode) {
                    return c
                } else {
                    return
                }
            })
            return ofimaDocumentType
        })
        return ofimaDocumentTypeListByUser
    },

    async GetInvoiceDocumentsByUser(User: string) {
        const ofimaDocumentTypeList = await this.ListByUser(User)
        const InvoiceList = ofimaDocumentTypeList.filter((e) => {
            if(e.Origin === 'FAC' && e.MasterDocument === 'FA') {
                return e
            } else {
                return
            }
        })
        return InvoiceList
    },

    async GetByInvoiceConsecutiveCode(ConsecutiveCode: string) {
        const ofimaDocumentTypeList = await this.ListAll()
        const ofimaInvoiceDocumentType = ofimaDocumentTypeList.find((d) => {
            if(d.ConsecutiveCode === ConsecutiveCode && d.Origin === 'FAC') {
                return d
            } else {
                return
            }
        })
        if (ofimaInvoiceDocumentType === undefined) throw(`No fue posible encontrar el tipo de documento ${ConsecutiveCode}`)
        return ofimaInvoiceDocumentType
    },

    GetNextConsecutive(OfimaDocumentType: OfimaDocumentType) {
        return OfimaDocumentType.Consecutive + 1
    },

    async SetNextConsecutive(OfimaDocumentType: OfimaDocumentType) {
        const {ConsecutiveCode, Consecutive} = OfimaDocumentType
        await OfimaDocumentTypeDao.UpdateConsecut(ConsecutiveCode, Consecutive + 1)
    }
}

export default OfimaDocumentTypeGestor