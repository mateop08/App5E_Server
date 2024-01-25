import { Router } from "express";
import { CreateOrderDocument,  ListByOrder, EditOrderDocument, DeleteOrderDocument } from "../controllers/OrderDocuments.controller"
import generateValidation/*, {generateFormDataMulterToOrderDocument}*/ from "../validators/OrderDocuments.validator";
import { uploadEjecution } from "../multer/OrderDocuments.multer";

const router = Router()

router.get('/orderdocuments/', generateValidation(['OrderDocument', 'OrderNumber']), ListByOrder)
router.post('/orderdocuments/', uploadEjecution , CreateOrderDocument)
router.put('/orderdocuments/', uploadEjecution , EditOrderDocument)
router.delete('/orderdocuments/', generateValidation(['Id']), DeleteOrderDocument)

export default router