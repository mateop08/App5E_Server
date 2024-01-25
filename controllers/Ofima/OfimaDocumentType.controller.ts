import OfimaDocumentTypeGestor from "../../models/Ofima/OfimaDocumentType.model";
import { Request, Response } from "express";

export const ListOfimaDocumentTypesByUser = async (req: Request, res: Response) => {
    try {
        const User = req.query.User as string
        const list = await OfimaDocumentTypeGestor.ListByUser(User)
        res.json(list)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const ListInvoiceOfimaDocumentTypesByUser = async (req: Request, res: Response) => {
    try {
        const User = req.query.User as string
        const list = await OfimaDocumentTypeGestor.GetInvoiceDocumentsByUser(User)
        res.json(list)
    } catch (error) {
        res.status(400).send(error)
    }
}