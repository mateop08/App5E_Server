import ProductGestor from "../models/Products.model";
import { Request, Response } from "express";


export const ListProductsByDescription = async (req: Request, res: Response) => {

    try {
        const OrderDocument = req.query.OrderDocument as string
        const Description = req.query.Description as string
        const list = await ProductGestor.ListByDescription(OrderDocument, Description)
        res.json(list)
    } catch (error) {
        res.status(400).send(error)
    }
}


export const ListBulkProducts = async (req: Request, res: Response) => {

    try {
        const OrderDocument = req.query.OrderDocument as string
        const list = await ProductGestor.ListBulkProducts(OrderDocument)
        res.json(list)
    } catch (error) {
        res.status(400).send(error)
    }
}