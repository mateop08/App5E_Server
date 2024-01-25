import GroupAppFunctionGestor, {GroupAppFunction} from "../models/GroupAppFunctions.model";
import { Request, Response } from "express";

export const CreateGroupAppFunction = async (req: Request, res: Response) => {
    
    try {
        const GroupAppFunction: GroupAppFunction = req.body
        const {AppFunctionCode, GroupCode} = GroupAppFunction
        await GroupAppFunctionGestor.Create(GroupAppFunction)
        res.status(200).send(`Se ha asignado la función ${AppFunctionCode} al grupo ${GroupCode}`)

    } catch (error) {
        res.status(400).send(error)
    }
}

export const SetByAppFunctionListAndGroupCode = async (req: Request, res: Response) => {

    try {
        const {AppFunctionList, GroupCode} = req.body
        await GroupAppFunctionGestor.SetByAppFunctionListAndGroupCode(AppFunctionList, GroupCode)
        res.status(200).send(`Se ha asignado el grupo de funciones al grupo ${GroupCode}`)

    } catch (error) {
        res.status(400).send(error)
    }
}
export const ListGroupsByAppFunctionCode = async (req: Request, res: Response) => {

    try {
        const AppFunctionCode = req.query.AppFunctionCode as string
        const list = await GroupAppFunctionGestor.ListGroupsByAppFunctionCode(AppFunctionCode)
        res.json(list)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const ListFunctionsByGroupCode = async (req: Request, res: Response) => {

    try {
        const GroupCode = req.query.GroupCode as string
        const list = await GroupAppFunctionGestor.ListFunctionsByGroupCode(GroupCode)
        res.json(list)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const DeleteGroupAppFunction = async (req: Request, res: Response) => {

    try {
        const GroupAppFunction = req.body
        const {AppFunctionCode, GroupCode} = GroupAppFunction
        await GroupAppFunctionGestor.Delete(GroupAppFunction)
        res.status(200).send(`Se ha desasignado la función ${AppFunctionCode} al grupo ${GroupCode}`)

    } catch (error) {
        res.status(400).send(error)
    }
}