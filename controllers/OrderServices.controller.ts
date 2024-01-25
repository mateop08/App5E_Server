import OrderServiceGestor from "../models/OrderServices.model";
import { Request, Response } from "express";

export const CreateOrderService = async (req: Request, res: Response) => {
    
    try {
        const OrderService = req.body
        const {OrderDocument, OrderNumber, Code, Amount, TechnicianCode, Note, User} = OrderService
        await OrderServiceGestor.Create(OrderDocument, OrderNumber, Code, Amount, TechnicianCode, Note, User)
        res.status(200).send(`Se ha agregado correctamente el servicio ${Code} a la order ${OrderDocument} ${OrderNumber}`)

    } catch (error) {
        res.status(400).send(error)
    }
}

export const EditOrderService = async (req: Request, res: Response) => {

    try {
        const OrderService = req.body
        const {Id, Code, Amount, TechnicianCode, Note, User} = OrderService
        await OrderServiceGestor.EditById(Id, Code, Amount, TechnicianCode, Note, User)
        res.status(200).send(`Se ha modificado correctamente el servicio ${Code}.`)

    } catch (error) {
        res.status(400).send(error)
    }
}

export const ListByOrder = async (req: Request, res: Response) => {

    try {
        const OrderDocument = req.query.OrderDocument as string
        const OrderNumber = Number(req.query.OrderNumber)
        const list = await OrderServiceGestor.ListTransferByOrder(OrderDocument, OrderNumber)
        res.json(list)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const DeleteOrderService = async (req: Request, res: Response) => {

    try {
        const {Id} = req.body
        await OrderServiceGestor.DeleteById(Id)
        res.status(200).send(`Se ha eliminado correctamente el servicio de la orden`)

    } catch (error) {
        res.status(400).send(error)
    }
}