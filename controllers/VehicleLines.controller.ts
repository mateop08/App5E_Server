import VehicleLineGestor, {VehicleLine} from "../models/VehicleLines.model";
import { Request, Response } from "express";

export const CreateVehicleLine = async (req: Request, res: Response) => {
    
    try {
        const vehicleLine: VehicleLine = req.body
        await VehicleLineGestor.Create(vehicleLine)
        res.status(200).send(`Se ha creado correctamente la linea de vehículo ${vehicleLine.Description}`)
    } catch (error) {
        res.status(400).send(error)
        
    }
}

export const ListAllVehicleLines = async (_req: Request, res: Response) => {

    try {
        const list = await VehicleLineGestor.ListAll()
        res.json(list)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const ListVehicleLinesByManufacterId = async (req: Request, res: Response) => {

    try {
        const ManufacterId = Number(req.query.ManufacterId)
        const list = await VehicleLineGestor.ListByManufacterId(ManufacterId)
        res.json(list)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const EditVehicleLine = async (req: Request, res: Response) => {

    try {
        const VehicleLine: VehicleLine = req.body
        const {LineId, Description} = VehicleLine
        await VehicleLineGestor.EditByLineId(VehicleLine)
        res.status(200).send(`Se ha modificado correctamente la linea de vehículo ${LineId} ${Description}`)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const DeleteVehicleLine = async (req: Request, res: Response) => {

    try {
        const {LineId} = req.body
        await VehicleLineGestor.DeleteByLineId(LineId)
        res.status(200).send(`Se ha eliminado correctamente la linea de vehículo ${LineId}`)
    } catch (error) {
        res.status(400).send(error)
    }
}