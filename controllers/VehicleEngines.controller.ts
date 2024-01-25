import VehicleEngineGestor, {VehicleEngine} from "../models/VehicleEngines.model";
import { Request, Response } from "express";

export const CreateVehicleEngine = async (req: Request, res: Response) => {
    
    try {
        const VehicleEngine: VehicleEngine = req.body
        await VehicleEngineGestor.Create(VehicleEngine)
        res.status(200).send(`Se ha creado correctamente el motor de vehículo ${VehicleEngine.Description}`)
    } catch (error) {
        res.status(400).send(error)
        
    }
}

export const ListAllVehicleEngines = async (_req: Request, res: Response) => {

    try {
        const list = await VehicleEngineGestor.ListAll()
        res.json(list)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const ListVehicleEnginesByYearId = async (req: Request, res: Response) => {

    try {
        const YearId = Number(req.query.YearId)
        const list = await VehicleEngineGestor.ListByYearId(YearId)
        res.json(list)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const EditVehicleEngine = async (req: Request, res: Response) => {

    try {
        const VehicleEngine: VehicleEngine = req.body
        const {EngineId, Description} = VehicleEngine
        await VehicleEngineGestor.EditByEngineId(VehicleEngine)
        res.status(200).send(`Se ha modificado correctamente el motor de vehículo ${EngineId} ${Description}`)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const DeleteVehicleEngine = async (req: Request, res: Response) => {

    try {
        const {EngineId} = req.body
        await VehicleEngineGestor.DeleteByEngineId(EngineId)
        res.status(200).send(`Se ha eliminado correctamente el motor de vehículo ${EngineId}`)
    } catch (error) {
        res.status(400).send(error)
    }
}