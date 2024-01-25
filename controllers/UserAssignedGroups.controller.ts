import UserAssignedGroupGestor, {UserAssignedGroup} from "../models/UserAssignedGroups.model";
import { Request, Response } from "express";

export const CreateUserAssignedGroup = async (req: Request, res: Response) => {
    
    try {
        const UserAssignedGroup: UserAssignedGroup = req.body
        const {UserCode, GroupCode} = UserAssignedGroup
        await UserAssignedGroupGestor.Create(UserAssignedGroup)
        res.status(200).send(`Se ha asignado el grupo ${GroupCode} al usuario ${UserCode}`)

    } catch (error) {
        res.status(400).send(error)
    }
}

export const CreateByGroupsListAndUserCode = async (req: Request, res: Response) => {

    try {
        const {GroupsList, UserCode } = req.body
        await UserAssignedGroupGestor.CreateByGoupsListAndUserCode(GroupsList, UserCode)
        res.status(200).send(`Se ha asignado los grupos al usuario  ${UserCode}`)

    } catch (error) {
        res.status(400).send(error)
    }
}

export const ListGroupsByUserCode = async (req: Request, res: Response) => {

    try {
        const UserCode = req.query.UserCode as string
        const list = await UserAssignedGroupGestor.ListGroupsByUserCode(UserCode)
        res.json(list)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const ListUsersByGroupCode = async (req: Request, res: Response) => {

    try {
        const GroupCode = req.query.GroupCode as string
        const list = await UserAssignedGroupGestor.ListUsersByGroupCode(GroupCode)
        res.json(list)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const DeleteUserAssignedGroup = async (req: Request, res: Response) => {

    try {
        const UserAssignedGroup = req.body
        const {UserCode, GroupCode} = UserAssignedGroup
        await UserAssignedGroupGestor.Delete(UserAssignedGroup)
        res.status(200).send(`Se ha desasignado el grupo ${GroupCode} al usuario ${UserCode}`)

    } catch (error) {
        res.status(400).send(error)
    }
}