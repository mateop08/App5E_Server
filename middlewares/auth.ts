import jwt from 'jsonwebtoken'
import config from '../config';
import { Request, Response } from "express";
import { Group } from '../models/Groups.model';

export interface UserData {
    User: string,
    Groups: Group[]
}

const TOKEN_KEY = config.token_key

const verifyToken = (req: Request, _res: Response): void => {
    const authHeader = req.headers['authorization'];
    if (authHeader === undefined){
        throw('No se pudo obtener el token del encabezado, revisar que la petición incluya el token.')
    }
    const token = authHeader && authHeader.split(' ')[1]
    
    if (token === null) {
        throw("Token requerido");
    }
    
    jwt.verify(token, TOKEN_KEY, (err, userData) => {
        if(err) throw("Token invalido");
        req.sessionData = userData as UserData
        return 
    })
}

const signToken = (userData: UserData) => {
    const token = jwt.sign(userData, TOKEN_KEY, {expiresIn: '18h'})
    return token
}

const verifyLoginWithToken = (token: string) => {
    const validation: any = jwt.verify(token, TOKEN_KEY, (err, userData) => {
        if(err) {
            throw('Token inválido')
        } else {
            return userData
        }
    })
    const userData = validation as UserData
    return userData
}
export { verifyToken, signToken, verifyLoginWithToken }