import { Router } from "express";
import { CreateAppDocument,  ListAppDocumentsByDescription, EditAppDocument, DeleteAppDocument, ListAllAppDocuments } from "../controllers/AppDocuments.controller"
import generateValidation from "../validators/AppDocuments.validator";


const router = Router()

router.get('/appdocuments/', generateValidation([]), ListAllAppDocuments)
router.get('/appdocuments/byDescription/', generateValidation(['Description']), ListAppDocumentsByDescription)
router.post('/appdocuments/', generateValidation(['Code','Description','Consecutive','PriceCode','Store','InventoryType','ServicesLine']), CreateAppDocument)
router.put('/appdocuments/', generateValidation(['Code','Description','Consecutive','PriceCode','Store','InventoryType','ServicesLine']), EditAppDocument)
router.delete('/appdocuments/', generateValidation(['Code']), DeleteAppDocument)

export default router
