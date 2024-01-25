import UserGestor, {User} from "../models/Users.model";
import { Request, Response } from "express";

export const CreateUser = async (req: Request, res: Response) => {
    
    try {
        const User: User = req.body
        const {UserCode, Name} = User
        await UserGestor.Create(User)
        res.status(200).send(`Se ha creado correctamente el usuario ${UserCode} ${Name}`)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const ListAllUsers = async (_req: Request, res: Response) => {

    try {
        const list = await UserGestor.ListAll()
        res.json(list)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const ListUsersByName = async (req: Request, res: Response) => {

    try {
        const Name = req.query.Name as string
        const list = await UserGestor.ListByName(Name)
        res.json(list)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const GetUserByUserCode = async (req: Request, res: Response) => {

    try {
        const UserCode = req.query.UserCode as string
        const user = await UserGestor.GetByUserCode(UserCode)
        res.json(user)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const EditUser = async (req: Request, res: Response) => {

    try {
        const User: User = req.body
        const {UserCode, Name} = User
        await UserGestor.EditByUserCode(User)
        res.status(200).send(`Se ha modificado correctamente el usuario ${UserCode} ${Name}`)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const DeleteUser = async (req: Request, res: Response) => {

    try {
        const {UserCode} = req.body
        await UserGestor.DeleteByUserCode(UserCode)
        res.status(200).send(`Se ha eliminado correctamente el usuario ${UserCode}`)

    } catch (error) {
        res.status(400).send(error)
    }
}