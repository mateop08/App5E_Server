import ContactDao from "../dao/Contacts.dao"

interface Contact {
    Identification: string,
    FullName: string,
    ContactNumber: string,
    Email: string,
    Address: string,
}

const ContactGestor = {

    async Create(Annonation: Contact) {
        const {Identification, FullName, ContactNumber, Email, Address} = Annonation
        if (await this.Exists(Identification)) {
            throw(`El contacto ${Identification} ya existe en la base de datos, no se puede volver a crear.`)
        }
        await ContactDao.insert(Identification, FullName, ContactNumber, Email, Address)
    },

    async ListAll() {
        const list = await ContactDao.listByFullName('')
        return list
    },

    async ListByFullName(FullName: string) {
        const list = await ContactDao.listByFullName(FullName)
        return list 
    },

    async GetByIdentification(Identification: string) {
        if (!await this.Exists(Identification)) {
            throw(`El contacto ${Identification} NO existe en la base de datos, no se puede inicializar el objeto Contact.`)
        }
        const data = await ContactDao.getByIdentification(Identification)
        if (data !== undefined) {
            const contact = data[0] as Contact
            return contact
        } else {
            throw('No fue posible inicializar el objeto Contact')
        }
        
    },

    async EditByIdentification(Contact: Contact) {
        const {Identification, FullName, ContactNumber, Email, Address} = Contact
        if (!await this.Exists(Identification)) {
            throw(`El contacto ${Identification} NO existe en la base de datos, no se puede modificar.`)
        }
        await ContactDao.updateByIdentification(Identification, FullName, ContactNumber, Email, Address)
    },

    async DeleteByIdentification(Identification: string) {
        if (!await this.Exists(Identification)) {
            throw(`El contacto ${Identification} NO existe en la base de datos, no se puede eliminar.`)
        }
        await ContactDao.deleteByIdentification(Identification)
    },

    async Exists(Identification: string) {
        const result = await ContactDao.getByIdentification(Identification)
        if (result === undefined || result?.length < 1 ) {
            return false
        }
        return true
    }
}
 

export default ContactGestor
export type {Contact}