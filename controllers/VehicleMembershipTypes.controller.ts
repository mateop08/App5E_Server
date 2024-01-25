import VehicleMembershipTypeGestor, {VehicleMembershipType} from "../models/VehicleMembershipTypes.model";
import { Request, Response } from "express";

export const CreateVehicleMembershipType = async (req: Request, res: Response) => {
    
    try {
        const VehicleMembershipType: VehicleMembershipType = req.body
        const {Code, Description} = VehicleMembershipType
        await VehicleMembershipTypeGestor.Create(VehicleMembershipType)
        res.status(200).send(`Se ha creado correctamente el tipo de membresia de vehiculo ${Code} ${Description}`)

    } catch (error) {
        res.status(400).send(error)
    }
}

export const ListAllVehicleMembershipTypes = async (_req: Request, res: Response) => {

    try {
        const list = await VehicleMembershipTypeGestor.ListAll()
        res.json(list)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const ListVehicleMembershipTypesByDescription = async (req: Request, res: Response) => {

    try {
        const Description = req.query.Description as string
        const list = await VehicleMembershipTypeGestor.ListByDescription(Description)
        res.json(list)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const EditVehicleMembershipType = async (req: Request, res: Response) => {

    try {
        const VehicleMembershipType: VehicleMembershipType = req.body
        const {Code, Description} = VehicleMembershipType
        await VehicleMembershipTypeGestor.EditByCode(VehicleMembershipType)
        res.status(200).send(`Se ha modificado correctamente el tipo de membresia de vehiculo ${Code} ${Description}`)

    } catch (error) {
        res.status(400).send(error)
    }
}

export const DeleteVehicleMembershipType = async (req: Request, res: Response) => {

    try {
        const {Code} = req.body
        await VehicleMembershipTypeGestor.DeleteByCode(Code)
        res.status(200).send(`Se ha eliminado correctamente el tipo de membresia de vehiculo ${Code}`)

    } catch (error) {
        res.status(400).send(error)
    }
}