import ContactGestor, {Contact} from "../models/Contacts.model";
import { Request, Response } from "express";

export const CreateContact = async (req: Request, res: Response) => {
    
    try {
        const Contact: Contact = req.body
        const {Identification, FullName} = Contact
        await ContactGestor.Create(Contact)
        res.status(200).send(`Se ha creado correctamente el contacto ${Identification} ${FullName}`)

    } catch (error) {
        res.status(400).send(error)
    }
}

export const ListAllContacts = async (_req: Request, res: Response) => {

    try {
        const list = await ContactGestor.ListAll()
        res.json(list)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const ListContactsByFullName = async (req: Request, res: Response) => {

    try {
        const FullName = req.query.FullName as string
        const list = await ContactGestor.ListByFullName(FullName)
        res.json(list)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const EditContact = async (req: Request, res: Response) => {

    try {
        const Contact: Contact = req.body
        const {Identification, FullName} = Contact
        await ContactGestor.EditByIdentification(Contact)
        res.status(200).send(`Se ha modificado correctamente el contacto  ${Identification} ${FullName}`)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const DeleteContact = async (req: Request, res: Response) => {

    try {
        const {Identification} = req.body
        await ContactGestor.DeleteByIdentification(Identification)
        res.status(200).send(`Se ha eliminado correctamente el contacto ${Identification}`)

    } catch (error) {
        res.status(400).send(error)
    }
}