import OrderProductGestor from "../models/OrderProducts.model";
import { Request, Response } from "express";

export const CreateOrderProduct = async (req: Request, res: Response) => {
    
    try {
        const OrderProduct = req.body
        const {OrderDocument, OrderNumber, Code, Amount, User} = OrderProduct
        await OrderProductGestor.Create(OrderDocument, OrderNumber, Code, Amount, User)
        res.status(200).send(`Se ha agregado correctamente el producto ${Code} a la order ${OrderDocument} ${OrderNumber}`)

    } catch (error) {
        res.status(400).send(error)
    }
}

export const EditOrderProduct = async (req: Request, res: Response) => {

    try {
        const OrderProduct = req.body
        const {Id, Code, Amount, User} = OrderProduct
        await OrderProductGestor.EditById(Id, Code, Amount, User)
        res.status(200).send(`Se ha modificado correctamente el producto ${Code}.`)

    } catch (error) {
        res.status(400).send(error)
    }
}

export const ListByOrder = async (req: Request, res: Response) => {

    try {
        const OrderDocument = req.query.OrderDocument as string
        const OrderNumber = Number(req.query.OrderNumber)
        const list = await OrderProductGestor.ListByOrder(OrderDocument, OrderNumber)
        res.json(list)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const DeleteOrderProduct = async (req: Request, res: Response) => {

    try {
        const {Id} = req.body
        await OrderProductGestor.DeleteById(Id)
        res.status(200).send(`Se ha eliminado correctamente el producto de la orden`)

    } catch (error) {
        res.status(400).send(error)
    }
}