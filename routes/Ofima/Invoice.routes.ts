import { Router } from "express";
import { CreateInvoice } from '../../controllers/Ofima/Invoice.controller'
import generateValidation from "../../validators/Ofima/Invoice.validator";

const router = Router()

router.post('/invoice/', generateValidation(['OrderDocument', 'OrderNumber', 'ConsecutiveCode', 'CustomerId',
    'Store', 'CashRegisterCode', 'CostCenterCode', 'Seller', 'User', 'PaymentMethodsList', 'PaymentMethodsList.PaymentMethod',
    'PaymentMethodsList.PaymentMethod.Code', 'PaymentMethodsList.PaymentMethod.Description', 'PaymentMethodsList.PaymentMethod.Account', 
    'PaymentMethodsList.PaymentMethod.Concept', 'PaymentMethodsList.Value', 'PaymentMethodsList.Note']), CreateInvoice)

export default router
