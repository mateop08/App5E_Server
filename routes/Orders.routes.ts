import { Router } from "express";
import { CreateOrder,  ListOpenOrders, EditOrder, AnnullOrder, CloseOrder, ListByFilters, GetByOrderDocumentAndOrderNumber } from "../controllers/Orders.controller"
import generateValidation from "../validators/Orders.validator";


const router = Router()

router.get('/orders/', generateValidation(["OrderDocument","OrderNumber"]), GetByOrderDocumentAndOrderNumber)
router.get('/orders/open/', generateValidation(["OrderDocument"]), ListOpenOrders)
router.post('/orders/filters/', generateValidation(["OrderDocument","PlateSearch","Diagnosis","Lubrication","Mechanics","Powertrain","Quote","Warranty","OpenSearch","StateSearch","InitialDate","FinalDate"]), ListByFilters)
router.post('/orders/', generateValidation(["OrderDocument","CardNumber","Plate","ContactId","Mileage","Diagnosis","Lubrication","Mechanics","Powertrain","Quote","User","Warranty","ReceptionNote"]), CreateOrder)
router.put('/orders/', generateValidation(["OrderDocument","OrderNumber","CardNumber","Plate","ContactId","Mileage","Diagnosis","Lubrication","Mechanics","Powertrain","Quote","User","Warranty","State","ReceptionNote"]), EditOrder)
router.put('/orders/close/',generateValidation(["OrderDocument","OrderNumber"]), CloseOrder)
router.put('/orders/annull/', generateValidation(["OrderDocument", "OrderNumber", "User", "AnnulledReason"]), AnnullOrder)

export default router
