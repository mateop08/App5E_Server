import CustomerGestor from "../../models/Ofima/Customer.model";
import { Request, Response } from "express";

export const GetCustomerByIdentification = async (req: Request, res: Response) => {

    try {
        const Identification = req.query.Identification as string
        const Customer = await CustomerGestor.GetByIdentification(Identification)
        res.json(Customer)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const ListCustomersBySearchText = async (req: Request, res: Response) => {

    try {
        const SearchText = req.query.SearchText as string
        const list = await CustomerGestor.Search(SearchText)
        res.json(list)
    } catch (error) {
        res.status(400).send(error)
    }
}
