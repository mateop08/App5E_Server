import OrderAnnotationGestor from "../models/OrderAnnotations.model";
import { Request, Response } from "express";

export const CreateOrderAnnotation = async (req: Request, res: Response) => {
    
    try {
        const {OrderDocument, OrderNumber, AnnotationCode, TechnicianCode, Note, User} = req.body
        await OrderAnnotationGestor.Create(OrderDocument, OrderNumber, AnnotationCode, TechnicianCode, Note, User)
        res.status(200).send(`Se ha agregado correctamente la anotacion ${AnnotationCode} a la order ${OrderDocument} ${OrderNumber}`)

    } catch (error) {
        res.status(400).send(error)
    }
}

export const EditOrderAnnotation = async (req: Request, res: Response) => {

    try {
        const {Id, AnnotationCode, TechnicianCode, Note, User} = req.body
        await OrderAnnotationGestor.EditById(Id, AnnotationCode, TechnicianCode, Note, User)
        res.status(200).send(`Se ha modificado correctamente la anotacion ${AnnotationCode}.`)

    } catch (error) {
        res.status(400).send(error)
    }
}

export const ListByOrder = async (req: Request, res: Response) => {

    try {
        const OrderDocument = req.query.OrderDocument as string
        const OrderNumber = Number(req.query.OrderNumber)
        const list = await OrderAnnotationGestor.ListByOrder(OrderDocument, OrderNumber)
        res.json(list)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const DeleteOrderAnnotation = async (req: Request, res: Response) => {

    try {
        const {Id} = req.body
        await OrderAnnotationGestor.DeleteById(Id)
        res.status(200).send(`Se ha eliminado correctamente la anotacion de la orden`)

    } catch (error) {
        res.status(400).send(error)
    }
}