import OrderAnnotationDetailGestor from "../models/OrderAnnotationDetails.model";
import { Request, Response } from "express";


export const CreateOrderAnnotationDetail = async (req: Request, res: Response) => {
    
    try {
        const {OrderDocument, OrderNumber, AnnotationId, Note, User} = req.body
        const fileName = req.file?.filename
        if (fileName === undefined) throw("Error al cargar archivo, no se pudo obtener el nombre del archivo.")
        await OrderAnnotationDetailGestor.Create(AnnotationId, Note, fileName, User)
        res.status(200).send(`Se ha agregado correctamente la evidencia a la orden ${OrderDocument} ${OrderNumber}`)

    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
}

export const EditOrderAnnotationDetail = async (req: Request, res: Response) => {

    try {
        const { EvidenceId, Note, User} = req.body
        const fileName = req.file?.filename
        
        if (fileName === undefined) throw("Error al cargar archivo, no se pudo obtener el nombre del archivo.")
        if (EvidenceId === undefined) throw(`No se especificó el parametro EvidenceId en la petición.`)
        await OrderAnnotationDetailGestor.EditByEvidenceId(EvidenceId, Note, fileName, User)
        res.status(200).send(`Se ha modificado correctamente la evidencia de la orden.`)

    } catch (error) {
        res.status(400).send(error)
    }
}

export const ListByAnnotationId = async (req: Request, res: Response) => {

    try {
        const AnnotationId = Number(req.query.AnnotationId)
        const list = await OrderAnnotationDetailGestor.ListByAnnotationId(AnnotationId)
        res.json(list)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const DeleteOrderAnnotationDetail = async (req: Request, res: Response) => {

    try {
        const {EvidenceId} = req.body
        await OrderAnnotationDetailGestor.DeleteByEvidenceId(EvidenceId)
        res.status(200).send(`Se ha eliminado correctamente la evidencia de la orden.`)

    } catch (error) {
        res.status(400).send(error)
    }
}