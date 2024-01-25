import InvoiceGestor from "../../models/Ofima/Invoice.model";
import { Request, Response } from "express";

export const CreateInvoice = async (req: Request, res: Response) => {
    
    try {
        const { OrderDocument, OrderNumber, ConsecutiveCode, 
            CustomerId, Store, PaymentMethodsList, 
            CashRegisterCode, CostCenterCode, Seller, User} = req.body

        const message = await InvoiceGestor.Create(OrderDocument, OrderNumber, ConsecutiveCode, CustomerId, Store, PaymentMethodsList, CashRegisterCode, CostCenterCode, Seller, User)
        res.status(200).send(message)

    } catch (error) {
        res.status(400).send(error)
    }
}