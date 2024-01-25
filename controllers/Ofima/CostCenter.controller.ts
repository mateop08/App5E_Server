import CostCenterGestor from "../../models/Ofima/CostCenter.model";
import { Request, Response } from "express";

export const ListCostCentersByUser = async (req: Request, res: Response) => {
    try {
        const User = req.query.User as string
        const list = await CostCenterGestor.ListByUser(User)
        res.json(list)
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
}