import BulkProductOutGestor from "../models/BulkProductOuts.model";
import { Request, Response } from "express";

export const CreateBulkProductOut = async (req: Request, res: Response) => {
    
    try {
        const {ProductCode, InitialNumber, FinalNumber, Amount, WithDigitalDispenser, 
            ForServiceOrder, OrderProductId, User} = req.body
        
        if (InitialNumber === undefined) throw("El parametro (InitialNumber) no puede ser undefined")
        if (FinalNumber === undefined) throw("El parametro (FinalNumber) no puede ser undefined")
        if (OrderProductId === undefined) throw("El parametro (OrderProductId) no puede ser undefined")
        
        const data = {
            ProductCode: ProductCode,
            InitialNumber: InitialNumber,
            FinalNumber: FinalNumber,
            Amount: Amount,
            WithDigitalDispenser: WithDigitalDispenser,
            ForServiceOrder: ForServiceOrder,
            OrderProductId: OrderProductId,
            User: User
        }
        await BulkProductOutGestor.Create(data)
        res.status(200).send(`Se ha registrado la salida de producto a granel del ${ProductCode}`)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const GetBulkProductOutByOutId = async (req: Request, res: Response) => {

    try {
        const OutId = Number(req.query.OutId)
        const BulkProductOut = await BulkProductOutGestor.GetByOutId(OutId)
        res.json(BulkProductOut)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const ListBulkProductOutsByOpeningId = async (req: Request, res: Response) => {

    try {
        const OpeningId = Number(req.query.OpeningId)
        const list = await BulkProductOutGestor.ListByOpeningId(OpeningId)
        res.json(list)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const ListBulkProductOutsByOrderProductId = async (req: Request, res: Response) => {

    try {
        const OrderProductId = req.query.OrderProductId
        if (OrderProductId === undefined) throw("Error: OrderProductId con valor undefined en la petición")
        const list = await BulkProductOutGestor.ListByOrderProduct(Number(OrderProductId))
        res.json(list)
    } catch (error) {
        res.status(400).send(error)
    }
}

