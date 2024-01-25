import { NextFunction, Request, Response } from "express";
import AppFunctionGestor from "../models/AppFunctions.model";
import { verifyToken } from "./auth";
import { Group } from "../models/Groups.model";
import GroupAppFunctionGestor, { GroupAppFunction } from "../models/GroupAppFunctions.model";


export const checkPermissions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const appFunction = await AppFunctionGestor.GetByMethodAndRoute(req.method, req.path)
        if (!appFunction.RequiresAuth) {
            return next()
        }
        
        verifyToken(req, res)
        if(req.sessionData === undefined) {
            throw('Datos de sesión no cargados')
        }
        const {Groups} = req.sessionData
        const isAuth = await Promise.all(Groups.map(async (group: Group) => {
            const groupFunction: GroupAppFunction = {
                AppFunctionCode: appFunction.Code,
                GroupCode: group.Code
            }

            return await GroupAppFunctionGestor.Exists(groupFunction)
            })
        )
        if (!isAuth.includes(true)) {
            const nameGroups = Groups.map((group: Group) => group.Description.trimEnd()).join(", ")
            throw(`El usuario ${req.sessionData.User.trimEnd()} perteneciente a los grupos (${nameGroups}), no posee permisos para ejecutar la función ${appFunction.Code}`)
        }else {
            return next()
        } 
        
    } catch (error) {
        res.status(400).send(error)
        return
    }
    
}
