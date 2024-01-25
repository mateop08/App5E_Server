import CashRegisterGestor from "../../models/Ofima/CashRegister.model";
import { Request, Response } from "express";

export const ListCashRegistersByUser = async (req: Request, res: Response) => {
    try {
        const User = req.query.User as string
        const list = await CashRegisterGestor.ListByUser(User)
        res.json(list)
    } catch (error) {
        res.status(400).send(error)
    }
}