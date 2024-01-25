import VehicleContactGestor, {VehicleContact} from "../models/VehicleContacts.model";
import { Request, Response } from "express";

export const CreateVehicleContact = async (req: Request, res: Response) => {
    
    try {
        const VehicleContact: VehicleContact = req.body
        const {VehiclePlate, ContactId} = VehicleContact
        await VehicleContactGestor.Create(VehicleContact)
        res.status(200).send(`Se ha asignado el contacto ${ContactId} a la placa ${VehiclePlate}`)

    } catch (error) {
        res.status(400).send(error)
    }
}

export const ExistsVehicleContact = async (req: Request, res: Response) => {
    
    try {
        const VehicleContact: VehicleContact = req.body
        const exist = await VehicleContactGestor.Exists(VehicleContact)
        res.json(exist)

    } catch (error) {
        res.status(400).send(error)
    }
}

export const ListContactsByPlate = async (req: Request, res: Response) => {

    try {
        const VehiclePlate = req.query.VehiclePlate as string
        const list = await VehicleContactGestor.ListContactsByVehiclePlate(VehiclePlate)
        res.json(list)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const ListVehiclesByContactId = async (req: Request, res: Response) => {

    try {
        const ContactId = req.query.ContactId as string
        const list = await VehicleContactGestor.ListVehiclesByContactId(ContactId)
        res.json(list)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const DeleteVehicleContact = async (req: Request, res: Response) => {

    try {
        const VehicleContact = req.body
        const {VehiclePlate, ContactId} = VehicleContact
        await VehicleContactGestor.Delete(VehicleContact)
        res.status(200).send(`Se ha desasignado el contacto ${ContactId} a la placa ${VehiclePlate}`)

    } catch (error) {
        res.status(400).send(error)
    }
}