import AppFunctionGestor, {AppFunction} from "../models/AppFunctions.model";
import { Request, Response } from "express";

export const CreateAppFunction = async (req: Request, res: Response) => {
    
    try {
        const AppFunction: AppFunction = req.body
        const {Code, Description} = AppFunction
        await AppFunctionGestor.Create(AppFunction)
        res.status(200).send(`Se ha creado correctamente la funcion de aplicacion ${Code} ${Description}`)

    } catch (error) {
        res.status(400).send(error)
    }
}

export const ListAllAppFunctions = async (_req: Request, res: Response) => {

    try {
        const list = await AppFunctionGestor.ListAll()
        res.json(list)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const ListAppFunctionsByDescription = async (req: Request, res: Response) => {

    try {
        const Description = req.query.Description as string
        const list = await AppFunctionGestor.ListByDescription(Description)
        res.json(list)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const EditAppFunction = async (req: Request, res: Response) => {

    try {
        const AppFunction: AppFunction = req.body
        const {Code, Description} = AppFunction
        await AppFunctionGestor.EditByCode(AppFunction)
        res.status(200).send(`Se ha modificado correctamente la funcion de aplicacion ${Code} ${Description}`)

    } catch (error) {
        res.status(400).send(error)
    }
}

export const DeleteAppFunction = async (req: Request, res: Response) => {

    try {
        const {Code} = req.body
        await AppFunctionGestor.DeleteByCode(Code)
        res.status(200).send(`Se ha eliminado correctamente la funcion de aplicacion ${Code}`)

    } catch (error) {
        res.status(400).send(error)
    }
}