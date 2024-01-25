import ServiceGestor from "../models/Services.model";
import { Request, Response } from "express";


export const ListServicesByDescription = async (req: Request, res: Response) => {

    try {
        const OrderDocument = req.query.OrderDocument as string
        const Description = req.query.Description as string
        const list = await ServiceGestor.ListByDescription(OrderDocument, Description)
        res.json(list)
    } catch (error) {
        res.status(400).send(error)
    }
}
