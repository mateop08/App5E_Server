import OrderGestor from "../models/Orders.model";
import { Request, Response } from "express";

export const CreateOrder = async (req: Request, res: Response) => {
    
    try {
        const Order = req.body
        const {Plate} = Order
        const orderNumber = await OrderGestor.Create(Order)
        res.status(200).send(`Se ha creado correctamente la orden ${orderNumber} para la placa ${Plate}`)

    } catch (error) {
        res.status(400).send(error)
    }
}

export const GetByOrderDocumentAndOrderNumber = async (req: Request, res: Response) => {

    try {
        const OrderDocument = req.query.OrderDocument as string
        const OrderNumber = Number(req.query.OrderNumber as string)
        const order = await OrderGestor.GetByDocumentAndNumber(OrderDocument, OrderNumber)
        const transferObject = OrderGestor.AdaptToTransfer(order)
        res.json(transferObject)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const ListByFilters = async (req: Request, res: Response) => {

    try {
        const data = req.body
        const {OpenSearch, StateSearch, InitialDate, FinalDate} = data
        if (OpenSearch === undefined) throw("El parametro OpenSearch no puede ser undefined")
        if (StateSearch === undefined) throw("El parametro StateSearch no puede ser undefined")
        if (InitialDate === undefined) throw("El parametro InitialDate no puede ser undefined")
        if (FinalDate === undefined) throw("El parametro FinalDate no puede ser undefined")

        const list = await OrderGestor.ListByFilters(data)
        res.json(list)
    } catch (error) {
        //console.log(error)
        res.status(400).send(error)
    }
}

export const ListOpenOrders = async (req: Request, res: Response) => {

    try {
        const OrderDocument = req.query.OrderDocument as string
        const list = await OrderGestor.ListOpenOrdersByOrderDocument(OrderDocument)
        res.json(list)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const EditOrder = async (req: Request, res: Response) => {

    try {
        const Order = req.body
        const {OrderDocument, OrderNumber} = Order
        await OrderGestor.EditByDocumentAndNumber(Order)
        res.status(200).send(`Se ha modificado correctamente la orden ${OrderDocument} ${OrderNumber}`)

    } catch (error) {
        res.status(400).send(error)
    }
}

export const CloseOrder = async (req: Request, res: Response) => {

    try {
        const {OrderDocument, OrderNumber} = req.body
        await OrderGestor.Close(OrderDocument, OrderNumber)
        res.status(200).send(`Se ha cerrado correctamente la orden ${OrderDocument} ${OrderNumber}`)

    } catch (error) {
        res.status(400).send(error)
    }
}

export const AnnullOrder = async (req: Request, res: Response) => {

    try {
        const {OrderDocument, OrderNumber, User, AnnulledReason} = req.body
        await OrderGestor.Annull(OrderDocument, OrderNumber, User, AnnulledReason)
        res.status(200).send(`Se ha anulado correctamente la orden ${OrderDocument} ${OrderNumber}`)

    } catch (error) {
        res.status(400).send(error)
    }
}