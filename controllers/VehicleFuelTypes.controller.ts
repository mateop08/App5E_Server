import VehicleFuelTypeGestor, {VehicleFuelType} from "../models/VehicleFuelTypes.model";
import { Request, Response } from "express";

export const CreateVehicleFuelType = async (req: Request, res: Response) => {
    
    try {
        const VehicleFuelType: VehicleFuelType = req.body
        const {Code, Description} = VehicleFuelType
        await VehicleFuelTypeGestor.Create(VehicleFuelType)
        res.status(200).send(`Se ha creado correctamente el tipo de combustible de vehiculo ${Code} ${Description}`)

    } catch (error) {
        res.status(400).send(error)
    }
}

export const ListAllVehicleFuelTypes = async (_req: Request, res: Response) => {

    try {
        const list = await VehicleFuelTypeGestor.ListAll()
        res.json(list)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const ListVehicleFuelTypesByDescription = async (req: Request, res: Response) => {

    try {
        const Description = req.query.Description as string
        const list = await VehicleFuelTypeGestor.ListByDescription(Description)
        res.json(list)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const EditVehicleFuelType = async (req: Request, res: Response) => {

    try {
        const VehicleFuelType: VehicleFuelType = req.body
        const {Code, Description} = VehicleFuelType
        await VehicleFuelTypeGestor.EditByCode(VehicleFuelType)
        res.status(200).send(`Se ha modificado correctamente el tipo de combustible de vehiculo ${Code} ${Description}`)

    } catch (error) {
        res.status(400).send(error)
    }
}

export const DeleteVehicleFuelType = async (req: Request, res: Response) => {

    try {
        const {Code} = req.body
        await VehicleFuelTypeGestor.DeleteByCode(Code)
        res.status(200).send(`Se ha eliminado correctamente el tipo de combustible de vehiculo ${Code}`)

    } catch (error) {
        res.status(400).send(error)
    }
}