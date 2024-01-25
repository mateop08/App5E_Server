import { Router } from "express";
import { CreateOrderAnnotation,  ListByOrder, EditOrderAnnotation, DeleteOrderAnnotation } from "../controllers/OrderAnnotations.controller"
import generateValidation from "../validators/OrderAnnotations.validator";


const router = Router()

router.get('/orderannotations/', generateValidation(['OrderDocument', 'OrderNumber']), ListByOrder)
router.post('/orderannotations/', generateValidation(['OrderDocument','OrderNumber','AnnotationCode', 'TechnicianCode', 'Note','User']), CreateOrderAnnotation)
router.put('/orderannotations/', generateValidation(['Id','AnnotationCode', 'TechnicianCode', 'Note', 'User']), EditOrderAnnotation)
router.delete('/orderannotations/', generateValidation(['Id']), DeleteOrderAnnotation)

export default router
