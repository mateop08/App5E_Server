import VehicleMembershipGestor, {VehicleMembership} from "../models/VehicleMemberships.model";
import { Request, Response } from "express";

export const CreateVehicleMembership = async (req: Request, res: Response) => {
    
    try {
        const VehicleMembership: VehicleMembership = req.body
        const {Plate, ContactId} = VehicleMembership
        const CardNumber = await VehicleMembershipGestor.Create(VehicleMembership)
        res.status(200).send(`Se ha creado la membresía numero ${CardNumber} al vehículo ${Plate} con contacto ${ContactId}`)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const GetVehicleMembershipsByCardNumber = async (req: Request, res: Response) => {

    try {
        const CardNumber = Number(req.query.CardNumber)
        const vehicleMembership = await VehicleMembershipGestor.GeyByCardNumber(CardNumber)
        res.json(vehicleMembership)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const ListVehicleMembershipsByPlate = async (req: Request, res: Response) => {

    try {
        const Plate = req.query.Plate as string
        const list = await VehicleMembershipGestor.ListMembershipsByPlate(Plate)
        res.json(list)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const ListVehicleMembershipByContactId = async (req: Request, res: Response) => {

    try {
        const ContactId = req.query.ContactId as string
        const list = await VehicleMembershipGestor.ListMembershipsByContactId(ContactId)
        res.json(list)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const DeleteVehicleMembership = async (req: Request, res: Response) => {

    try {
        const VehicleMembership = req.body
        const {CardNumber} = VehicleMembership
        await VehicleMembershipGestor.DeleteByCardNumber(CardNumber)
        res.status(200).send(`Se ha eliminado la membresía ${CardNumber}`)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const ActivateVehicleMembership = async (req: Request, res: Response) => {

    try {
        const VehicleMembership = req.body
        const {CardNumber} = VehicleMembership
        await VehicleMembershipGestor.Activate(CardNumber)
        res.status(200).send(`Se ha activado la membresía ${CardNumber}`)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const DeactivateVehicleMembership = async (req: Request, res: Response) => {

    try {
        const VehicleMembership = req.body
        const {CardNumber} = VehicleMembership
        await VehicleMembershipGestor.Deactivate(CardNumber)
        res.status(200).send(`Se ha inactivado la membresía ${CardNumber}`)
    } catch (error) {
        res.status(400).send(error)
    }
}