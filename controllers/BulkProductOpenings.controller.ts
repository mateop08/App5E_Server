import BulkProductOpeningGestor from "../models/BulkProductOpenings.model";
import { Request, Response } from "express";

export const CreateBulkProductOpening = async (req: Request, res: Response) => {
    
    try {
        const {ProductCode, User} = req.body
        await BulkProductOpeningGestor.Create(ProductCode, User)
        res.status(200).send(`Se ha registrado la apertura de producto a granel ${ProductCode}`)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const GetBulkProductOpeningByOpeningId = async (req: Request, res: Response) => {

    try {
        const OpeningId = Number(req.query.OpeningId)
        const BulkProductOpening = await BulkProductOpeningGestor.GetTransferByOpeningId(OpeningId)
        res.json(BulkProductOpening)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const ListAllBulkProductOpenings = async (_req: Request, res: Response) => {

    try {
        const list = await BulkProductOpeningGestor.ListAll()
        res.json(list)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const ListActiveBulkProductOpenings = async (_req: Request, res: Response) => {

    try {
        const list = await BulkProductOpeningGestor.ListActives()
        res.json(list)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const CloseBulkProductOpening = async (req: Request, res: Response) => {

    try {
        const {OpeningId, LeftOverAmount, User } = req.body
        await BulkProductOpeningGestor.Close(OpeningId, LeftOverAmount, User)
        res.status(200).send(`Se ha cerrado correctamente la apertura de producto a granel.`)

    } catch (error) {
        res.status(400).send(error)
    }
}
