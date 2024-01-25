import OrderDocumentGestor from "../models/OrderDocuments.model";
import { Request, Response } from "express";


export const CreateOrderDocument = async (req: Request, res: Response) => {
    
    try {
        const {OrderDocument, OrderNumber, DocumentCode, User} = req.body
        const fileName = req.file?.filename
        if (fileName === undefined) throw("Error al cargar archivo, no se pudo obtener el nombre del archivo.")
        await OrderDocumentGestor.Create(OrderDocument, OrderNumber, DocumentCode, fileName, User)
        res.status(200).send(`Se ha agregado correctamente el documento ${DocumentCode} a la order ${OrderDocument} ${OrderNumber}`)

    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
}

export const EditOrderDocument = async (req: Request, res: Response) => {

    try {
        const {Id, DocumentCode, User} = req.body
        const fileName = req.file?.filename
        if (fileName === undefined) throw("Error al cargar archivo, no se pudo obtener el nombre del archivo.")
        if (Id === undefined) throw(`No se especificó el parametro Id en la petición.`)
        await OrderDocumentGestor.EditById(Id, DocumentCode, fileName, User)
        res.status(200).send(`Se ha modificado correctamente el documento ${DocumentCode}.`)

    } catch (error) {
        res.status(400).send(error)
    }
}

export const ListByOrder = async (req: Request, res: Response) => {

    try {
        const OrderDocument = req.query.OrderDocument as string
        const OrderNumber = Number(req.query.OrderNumber)
        const list = await OrderDocumentGestor.ListByOrder(OrderDocument, OrderNumber)
        res.json(list)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const DeleteOrderDocument = async (req: Request, res: Response) => {

    try {
        const {Id} = req.body
        await OrderDocumentGestor.DeleteById(Id)
        res.status(200).send(`Se ha eliminado correctamente el documento de la orden`)

    } catch (error) {
        res.status(400).send(error)
    }
}