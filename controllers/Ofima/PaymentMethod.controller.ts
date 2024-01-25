import PaymentMethodGestor from "../../models/Ofima/PaymentMethod.model";
import { Request, Response } from "express";

export const ListPaymentMethodsByUser = async (req: Request, res: Response) => {
    try {
        const User = req.query.User as string
        const list = await PaymentMethodGestor.ListByUser(User)
        res.json(list)
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
}