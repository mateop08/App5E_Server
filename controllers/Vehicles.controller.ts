import VehicleGestor, {Vehicle} from "../models/Vehicles.model";
import { Request, Response } from "express";

export const CreateVehicle = async (req: Request, res: Response) => {
    
    try {
        const Vehicle: Vehicle = req.body
        const {Plate} = Vehicle
        await VehicleGestor.Create(Vehicle)
        res.status(200).send(`Se ha creado correctamente el vehiculo ${Plate}`)

    } catch (error) {
        res.status(400).send(error)
    }
}

export const GetVehicleByPlate = async (req: Request, res: Response) => {

    try {
        const Plate = req.query.Plate as string
        const vehicle = await VehicleGestor.GetByPlate(Plate)
        res.json(vehicle)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const ListAllVehicles = async (_req: Request, res: Response) => {

    try {
        const list = await VehicleGestor.ListAll()
        res.json(list)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const ListVehiclesByDescription = async (req: Request, res: Response) => {

    try {
        const Description = req.query.Description as string
        const list = await VehicleGestor.ListByDescription(Description)
        res.json(list)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const EditVehicle = async (req: Request, res: Response) => {

    try {
        const Vehicle: Vehicle = req.body
        const {Plate} = Vehicle
        await VehicleGestor.EditByPlate(Vehicle)
        res.status(200).send(`Se ha modificado correctamente el vehiculo ${Plate}`)

    } catch (error) {
        res.status(400).send(error)
    }
}

export const DeleteVehicle = async (req: Request, res: Response) => {

    try {
        const {Plate} = req.body
        await VehicleGestor.DeleteByCode(Plate)
        res.status(200).send(`Se ha eliminado correctamente el vehiculo ${Plate}`)

    } catch (error) {
        res.status(400).send(error)
    }
}