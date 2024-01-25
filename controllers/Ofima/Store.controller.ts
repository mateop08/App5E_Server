import StoreGestor from "../../models/Ofima/Store.model";
import { Request, Response } from "express";

export const ListStoresByUser = async (req: Request, res: Response) => {
    try {
        const User = req.query.User as string
        const list = await StoreGestor.ListByUser(User)
        res.json(list)
    } catch (error) {
        res.status(400).send(error)
    }
}