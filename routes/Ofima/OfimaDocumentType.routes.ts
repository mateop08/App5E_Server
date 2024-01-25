import { Router } from "express";
import { ListOfimaDocumentTypesByUser, ListInvoiceOfimaDocumentTypesByUser } from '../../controllers/Ofima/OfimaDocumentType.controller'
import generateValidation from "../../validators/Ofima/OfimaDocumentType.validator";

const router = Router()

router.get('/ofimadocumenttype/', generateValidation(['User']), ListOfimaDocumentTypesByUser)
router.get('/ofimadocumenttype/invoice/', generateValidation(['User']), ListInvoiceOfimaDocumentTypesByUser)

export default router
