import UserAppDocumentGestor, {UserAppDocument} from "../models/UserAppDocuments.model";
import { Request, Response } from "express";

export const CreateUserAppDocument = async (req: Request, res: Response) => {
    
    try {
        const UserAppDocument: UserAppDocument = req.body
        const {UserCode, DocumentCode} = UserAppDocument
        await UserAppDocumentGestor.Create(UserAppDocument)
        res.status(200).send(`Se ha asignado el documento de aplicación ${DocumentCode} al usuario ${UserCode}`)

    } catch (error) {
        res.status(400).send(error)
    }
}

export const CreateByAppDocumentsListAndUserCode = async (req: Request, res: Response) => {

    try {
        const {AppDocumentsList, UserCode } = req.body
        await UserAppDocumentGestor.CreateByAppDocumentsListAndUserCode(AppDocumentsList, UserCode)
        res.status(200).send(`Se ha asignado los documentos de aplicación al usuario  ${UserCode}`)

    } catch (error) {
        res.status(400).send(error)
    }
}

export const ListDocumentsByUserCode = async (req: Request, res: Response) => {

    try {
        const UserCode = req.query.UserCode as string
        const list = await UserAppDocumentGestor.ListDocumentsByUserCode(UserCode)
        res.json(list)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const ListUsersByDocumentCode = async (req: Request, res: Response) => {

    try {
        const DocumentCode = req.query.DocumentCode as string
        const list = await UserAppDocumentGestor.ListUsersByDocumentCode(DocumentCode)
        res.json(list)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const DeleteUserAppDocument = async (req: Request, res: Response) => {

    try {
        const UserAppDocument = req.body
        const {UserCode, DocumentCode} = UserAppDocument
        await UserAppDocumentGestor.Delete(UserAppDocument)
        res.status(200).send(`Se ha desasignado el documento de aplicación ${DocumentCode} al usuario ${UserCode}`)

    } catch (error) {
        res.status(400).send(error)
    }
}