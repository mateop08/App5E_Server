import { Router } from "express";
import { CreateDocumentType,  ListDocumentTypesByDescription, EditDocumentType, DeleteDocumentType, ListAllDocumentTypes } from "../controllers/DocumentTypes.controller"
import generateValidation from "../validators/DocumentTypes.validator";


const router = Router()

router.get('/documenttypes/', generateValidation([]), ListAllDocumentTypes)
router.get('/documenttypes/byDescription/', generateValidation(['Description']), ListDocumentTypesByDescription)
router.post('/documenttypes/', generateValidation(['Code','Description']), CreateDocumentType)
router.put('/documenttypes/', generateValidation(['Code','Description']), EditDocumentType)
router.delete('/documenttypes/', generateValidation(['Code']), DeleteDocumentType)

export default router
