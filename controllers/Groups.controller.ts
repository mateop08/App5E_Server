import GroupGestor, {Group} from "../models/Groups.model";
import { Request, Response } from "express";

export const CreateGroup = async (req: Request, res: Response) => {
    
    try {
        const Group: Group = req.body
        const {Code, Description} = Group
        await GroupGestor.Create(Group)
        res.status(200).send(`Se ha creado correctamente el grupo ${Code} ${Description}`)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const GetGroupByCode = async (req: Request, res: Response) => {

    try {
        const Code = req.query.Code as string
        const Group = await GroupGestor.GetByCode(Code)
        res.json(Group)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const ListAllGroups = async (_req: Request, res: Response) => {

    try {
        const list = await GroupGestor.ListAll()
        res.json(list)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const ListGroupsByDescription = async (req: Request, res: Response) => {

    try {
        const Description = req.query.Description as string
        const list = await GroupGestor.ListByDescription(Description)
        res.json(list)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const EditGroup = async (req: Request, res: Response) => {

    try {
        const Group: Group = req.body
        const {Code, Description} = Group
        await GroupGestor.EditByCode(Group)
        res.status(200).send(`Se ha modificado correctamente el grupo ${Code} ${Description}`)

    } catch (error) {
        res.status(400).send(error)
    }
}

export const DeleteGroup = async (req: Request, res: Response) => {

    try {
        const {Code} = req.body
        await GroupGestor.DeleteByCode(Code)
        res.status(200).send(`Se ha eliminado correctamente el grupo ${Code}`)

    } catch (error) {
        res.status(400).send(error)
    }
}