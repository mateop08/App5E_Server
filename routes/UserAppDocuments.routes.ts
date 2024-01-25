import { Router } from "express";
import { CreateUserAppDocument,  CreateByAppDocumentsListAndUserCode, ListUsersByDocumentCode, ListDocumentsByUserCode, DeleteUserAppDocument } from "../controllers/UserAppDocuments.controller"
import generateValidation from "../validators/UserAppDocuments.validator";


const router = Router()

router.get('/userappdocuments/byUsercode/', generateValidation(['UserCode']), ListDocumentsByUserCode)
router.get('/userappdocuments/byDocumentcode/', generateValidation(['DocumentCode']), ListUsersByDocumentCode)
router.post('/userappdocuments/', generateValidation(['UserCode', 'DocumentCode']), CreateUserAppDocument)
router.post('/userappdocuments/byAppdocumentslistandusercode/', generateValidation(['UserCode', 'AppDocumentsList', 'AppDocumentsList.AppDocumentCode']), CreateByAppDocumentsListAndUserCode)
router.delete('/userappdocuments/', generateValidation(['UserCode', 'DocumentCode']), DeleteUserAppDocument)

export default router
