
import { Request, Response } from "express";
import LoginGestor from "../models/Login.model";

export const login = async (req: Request, res: Response) => {
    
    try {
        const {User, Password} = req.body
        const sessionData = await LoginGestor.Login(User, Password)
        res.status(200).json(sessionData)
    } catch (error) {
        res.status(401).send(error)
    }
}

export const loginWithToken = (req: Request, res: Response) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]
        if (token === undefined) {
            throw('No es posible iniciar sesión con token, debido a que el autheader esta vacío.')
        }

        const sessionData = LoginGestor.LoginWithToken(token)
        res.status(200).json(sessionData)
    } catch (error) {
        res.status(401).send(error)
    }
    
    
}