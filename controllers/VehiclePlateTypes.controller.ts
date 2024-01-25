import VehiclePlateTypeGestor, {VehiclePlateType} from "../models/VehiclePlateTypes.model";
import { Request, Response } from "express";

export const CreateVehiclePlateType = async (req: Request, res: Response) => {
    
    try {
        const VehiclePlateType: VehiclePlateType = req.body
        const {Code, Description} = VehiclePlateType
        await VehiclePlateTypeGestor.Create(VehiclePlateType)
        res.status(200).send(`Se ha creado correctamente el tipo de placa de vehiculo ${Code} ${Description}`)

    } catch (error) {
        res.status(400).send(error)
    }
}

export const ListAllVehiclePlateTypes = async (_req: Request, res: Response) => {

    try {
        const list = await VehiclePlateTypeGestor.ListAll()
        res.json(list)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const ListVehiclePlateTypesByDescription = async (req: Request, res: Response) => {

    try {
        const Description = req.query.Description as string
        const list = await VehiclePlateTypeGestor.ListByDescription(Description)
        res.json(list)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const EditVehiclePlateType = async (req: Request, res: Response) => {

    try {
        const VehiclePlateType: VehiclePlateType = req.body
        const {Code, Description} = VehiclePlateType
        await VehiclePlateTypeGestor.EditByCode(VehiclePlateType)
        res.status(200).send(`Se ha modificado correctamente el tipo de placa de vehiculo ${Code} ${Description}`)

    } catch (error) {
        res.status(400).send(error)
    }
}

export const DeleteVehiclePlateType = async (req: Request, res: Response) => {

    try {
        const {Code} = req.body
        await VehiclePlateTypeGestor.DeleteByCode(Code)
        res.status(200).send(`Se ha eliminado correctamente el tipo de placa de vehiculo ${Code}`)

    } catch (error) {
        res.status(400).send(error)
    }
}