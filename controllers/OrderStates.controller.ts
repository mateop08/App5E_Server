import OrderStateGestor, {OrderState} from "../models/OrderStates.model";
import { Request, Response } from "express";

export const CreateOrderState = async (req: Request, res: Response) => {
    
    try {
        const OrderState: OrderState = req.body
        const {Code, Description} = OrderState
        await OrderStateGestor.Create(OrderState)
        res.status(200).send(`Se ha creado correctamente el estado de orden ${Code} ${Description}`)

    } catch (error) {
        res.status(400).send(error)
    }
}

export const ListAllOrderStates = async (_req: Request, res: Response) => {

    try {
        const list = await OrderStateGestor.ListAll()
        res.json(list)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const ListOrderStatesByDescription = async (req: Request, res: Response) => {

    try {
        const Description = req.query.Description as string
        const list = await OrderStateGestor.ListByDescription(Description)
        res.json(list)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const EditOrderState = async (req: Request, res: Response) => {

    try {
        const OrderState: OrderState = req.body
        const {Code, Description} = OrderState
        await OrderStateGestor.EditByCode(OrderState)
        res.status(200).send(`Se ha modificado correctamente el estado de orden ${Code} ${Description}`)

    } catch (error) {
        res.status(400).send(error)
    }
}

export const DeleteOrderState = async (req: Request, res: Response) => {

    try {
        const {Code} = req.body
        await OrderStateGestor.DeleteByCode(Code)
        res.status(200).send(`Se ha eliminado correctamente el estado de orden ${Code}`)

    } catch (error) {
        res.status(400).send(error)
    }
}