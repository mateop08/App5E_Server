import AppDocumentGestor, {AppDocument} from "../models/AppDocuments.model";
import { Request, Response } from "express";

export const CreateAppDocument = async (req: Request, res: Response) => {
    
    try {
        const AppDocument: AppDocument = req.body
        await AppDocumentGestor.Create(AppDocument)
        res.status(200).send(`Se ha creado correctamente el tipo de documento de aplicación ${AppDocument.Code} ${AppDocument.Description}`)

    } catch (error) {
        res.status(400).send(error)
    }
}

export const ListAllAppDocuments = async (_req: Request, res: Response) => {

    try {
        const list = await AppDocumentGestor.ListAll()
        res.json(list)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const ListAppDocumentsByDescription = async (req: Request, res: Response) => {

    try {
        const Description = req.query.Description as string
        const list = await AppDocumentGestor.ListByDescription(Description)
        res.json(list)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const EditAppDocument = async (req: Request, res: Response) => {

    try {
        const AppDocument: AppDocument = req.body
        await AppDocumentGestor.EditByCode(AppDocument)
        res.status(200).send(`Se ha modificado correctamente el tipo de documento de aplicación ${AppDocument.Code} ${AppDocument.Description}.`)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const DeleteAppDocument = async (req: Request, res: Response) => {

    try {
        const {Code} = req.body
        await AppDocumentGestor.DeleteByCode(Code)
        res.status(200).send(`Se ha eliminado correctamente el tipo de documento de documento de aplicación  ${Code}`)

    } catch (error) {
        res.status(400).send(error)
    }
}