import VehicleYearGestor, {VehicleYear} from "../models/VehicleYears.model";
import { Request, Response } from "express";

export const CreateVehicleYear = async (req: Request, res: Response) => {
    
    try {
        const VehicleYear: VehicleYear = req.body
        await VehicleYearGestor.Create(VehicleYear)
        res.status(200).send(`Se ha creado correctamente el año de vehículo ${VehicleYear.Year}`)
    } catch (error) {
        res.status(400).send(error)
        
    }
}

export const ListAllVehicleYears = async (_req: Request, res: Response) => {

    try {
        const list = await VehicleYearGestor.ListAll()
        res.json(list)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const ListVehicleYearsByLineId = async (req: Request, res: Response) => {

    try {
        const LineId = Number(req.query.LineId)
        const list = await VehicleYearGestor.ListByLineId(LineId)
        res.json(list)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const EditVehicleYear = async (req: Request, res: Response) => {

    try {
        const VehicleYear: VehicleYear = req.body
        const {LineId, Year} = VehicleYear
        await VehicleYearGestor.EditByYearId(VehicleYear)
        res.status(200).send(`Se ha modificado correctamente el año de vehículo ${LineId} ${Year}`)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const DeleteVehicleYear = async (req: Request, res: Response) => {

    try {
        const {YearId} = req.body
        await VehicleYearGestor.DeleteByYearId(YearId)
        res.status(200).send(`Se ha eliminado correctamente el año de vehículo ${YearId}`)
    } catch (error) {
        res.status(400).send(error)
    }
}