import VehicleManufacterGestor, {VehicleManufacter} from "../models/VehicleManufacters.model";
import { Request, Response } from "express";

export const CreateVehicleManufacter = async (req: Request, res: Response) => {
    
    try {
        const {Description} = req.body
        await VehicleManufacterGestor.Create(Description)
        res.status(200).send(`Se ha creado correctamente el fabricante de vehículo ${Description}`)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const ListAllVehicleManufacters = async (_req: Request, res: Response) => {

    try {
        const list = await VehicleManufacterGestor.ListAll()
        res.json(list)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const ListVehicleManufactersByDescription = async (req: Request, res: Response) => {

    try {
        const Description = req.query.Description as string
        const list = await VehicleManufacterGestor.ListByDescription(Description)
        res.json(list)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const EditVehicleManufacter = async (req: Request, res: Response) => {

    try {
        const VehicleManufacter: VehicleManufacter = req.body
        const {ManufacterId, Description} = VehicleManufacter
        await VehicleManufacterGestor.EditByManufacterId(VehicleManufacter)
        res.status(200).send(`Se ha modificado correctamente el fabricante de vehículo ${ManufacterId} ${Description}`)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const DeleteVehicleManufacter = async (req: Request, res: Response) => {

    try {
        const {ManufacterId} = req.body
        await VehicleManufacterGestor.DeleteByManufacterId(ManufacterId)
        res.status(200).send(`Se ha eliminado correctamente el fabricante de vehículo ${ManufacterId}`)
    } catch (error) {
        res.status(400).send(error)
    }
}