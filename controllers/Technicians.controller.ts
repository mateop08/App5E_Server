import TechnicianGestor, {Technician} from "../models/Technicians.model";
import { Request, Response } from "express";

export const CreateTechnician = async (req: Request, res: Response) => {
    
    try {
        const Technician: Technician = req.body
        const {Code, Description} = Technician
        await TechnicianGestor.Create(Technician)
        res.status(200).send(`Se ha creado correctamente el tecnico ${Code} ${Description}`)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const ListAllTechnicians = async (_req: Request, res: Response) => {

    try {
        const list = await TechnicianGestor.ListAll()
        res.json(list)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const ListTechniciansByDescription = async (req: Request, res: Response) => {

    try {
        const Description = req.query.Description as string
        const list = await TechnicianGestor.ListByDescription(Description)
        res.json(list)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const EditTechnician = async (req: Request, res: Response) => {

    try {
        const Technician: Technician = req.body
        const {Code, Description} = Technician
        await TechnicianGestor.EditByCode(Technician)
        res.status(200).send(`Se ha modificado correctamente el tecnico ${Code} ${Description}`)

    } catch (error) {
        res.status(400).send(error)
    }
}

export const DeleteTechnician = async (req: Request, res: Response) => {

    try {
        const {Code} = req.body
        await TechnicianGestor.DeleteByCode(Code)
        res.status(200).send(`Se ha eliminado correctamente el tecnico ${Code}`)

    } catch (error) {
        res.status(400).send(error)
    }
}