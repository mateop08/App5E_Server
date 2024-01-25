import BulkProductOutAnnullationGestor from "../models/BulkProductOutAnnullations.model";
import { Request, Response } from "express";

export const CreateBulkProductOutAnnullation = async (req: Request, res: Response) => {
    
    try {
        const {ProductCode, Amount, OutId, AnnulledReason, User} = req.body
        await BulkProductOutAnnullationGestor.Create(ProductCode, Amount, OutId, AnnulledReason, User)
        res.status(200).send(`Se ha registrado la anulación de salida de producto a granel del ${ProductCode}`)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const GetBulkProductOutAnnullationByAnnullationId = async (req: Request, res: Response) => {

    try {
        const AnnullationId = Number(req.query.AnnullationId)
        const BulkProductOutAnnullation = await BulkProductOutAnnullationGestor.GetTransferByAnnullationId(AnnullationId)
        res.json(BulkProductOutAnnullation)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const ListBulkProductOutAnnullationsByOutId = async (req: Request, res: Response) => {

    try {
        const OutId = Number(req.query.OutId)
        const list = await BulkProductOutAnnullationGestor.GetTransferListByOutId(OutId)
        res.json(list)
    } catch (error) {
        res.status(400).send(error)
    }
}
