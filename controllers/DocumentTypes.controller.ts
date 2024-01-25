import DocumentTypeGestor, {DocumentType} from "../models/DocumentTypes.model";
import { Request, Response } from "express";

export const CreateDocumentType = async (req: Request, res: Response) => {
    
    try {
        const DocumentType: DocumentType = req.body
        const {Code, Description} = DocumentType
        await DocumentTypeGestor.Create(DocumentType)
        res.status(200).send(`Se ha creado correctamente el tipo de documento ${Code} ${Description}`)

    } catch (error) {
        res.status(400).send(error)
    }
}

export const ListAllDocumentTypes = async (_req: Request, res: Response) => {

    try {
        const list = await DocumentTypeGestor.ListAll()
        res.json(list)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const ListDocumentTypesByDescription = async (req: Request, res: Response) => {

    try {
        const Description = req.query.Description as string
        const list = await DocumentTypeGestor.ListByDescription(Description)
        res.json(list)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const EditDocumentType = async (req: Request, res: Response) => {

    try {
        const DocumentType: DocumentType = req.body
        const {Code, Description} = DocumentType
        await DocumentTypeGestor.EditByCode(DocumentType)
        res.status(200).send(`Se ha modificado correctamente el tipo de documento ${Code} ${Description}`)

    } catch (error) {
        res.status(400).send(error)
    }
}

export const DeleteDocumentType = async (req: Request, res: Response) => {

    try {
        const {Code} = req.body
        await DocumentTypeGestor.DeleteByCode(Code)
        res.status(200).send(`Se ha eliminado correctamente el tipo de documento ${Code}`)

    } catch (error) {
        res.status(400).send(error)
    }
}