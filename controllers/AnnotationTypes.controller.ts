import AnnotationTypeGestor, {AnnotationType} from "../models/AnnotationTypes.model";
import { Request, Response } from "express";

export const CreateAnotationType = async (req: Request, res: Response) => {
    
    try {
        const annotationType: AnnotationType = req.body
        await AnnotationTypeGestor.Create(annotationType)
        res.status(200).send(`Se ha creado correctamente la anotacion ${annotationType.Code} ${annotationType.Description}`)
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
}

export const ListAllAnnotationTypes = async (_req: Request, res: Response) => {

    try {
        const list = await AnnotationTypeGestor.ListAll()
        res.json(list)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const ListAnnotationTypesByDescription = async (req: Request, res: Response) => {

    try {
        const Description = req.query.Description as string
        const list = await AnnotationTypeGestor.ListByDescription(Description)
        res.json(list)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const EditAnnotationType = async (req: Request, res: Response) => {

    try {
        const annotationType: AnnotationType = req.body
        await AnnotationTypeGestor.EditByCode(annotationType)
        res.status(200).send(`Se ha modificado correctamente la anotacion ${annotationType.Code} ${annotationType.Description}`)
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
}

export const DeleteAnnotationType = async (req: Request, res: Response) => {

    try {
        const {Code} = req.body
        await AnnotationTypeGestor.DeleteByCode(Code)
        res.status(200).send(`Se ha eliminado correctamente la anotacion ${Code}`)
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
}