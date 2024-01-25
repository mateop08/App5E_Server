import { Router } from "express";
import { CreateOrderAnnotationDetail,  ListByAnnotationId, EditOrderAnnotationDetail, DeleteOrderAnnotationDetail } from "../controllers/OrderAnnotationDetails.controller"
import generateValidation/*, {generateFormDataMulterToOrderAnnotationDetail}*/ from "../validators/OrderAnnotationDetails.validator";
import { uploadEjecution } from "../multer/OrderAnnotationDetails.multer";

const router = Router()

router.get('/orderannotationdetails/', generateValidation(['AnnotationId']), ListByAnnotationId)
router.post('/orderannotationdetails/', uploadEjecution , CreateOrderAnnotationDetail)
router.put('/orderannotationdetails/', uploadEjecution , EditOrderAnnotationDetail)
router.delete('/orderannotationdetails/', generateValidation(['EvidenceId']), DeleteOrderAnnotationDetail)

export default router