import { Router } from "express";
import { CreateAnotationType,  ListAnnotationTypesByDescription, EditAnnotationType, DeleteAnnotationType, ListAllAnnotationTypes } from "../controllers/AnnotationTypes.controller"
import generateValidation from "../validators/AnnotationTypes.validator";


const router = Router()

router.get('/annotationtypes/', generateValidation([]), ListAllAnnotationTypes)
router.get('/annotationtypes/byDescription/', generateValidation(['Description']), ListAnnotationTypesByDescription)
router.post('/annotationtypes/', generateValidation(['Code','Description']), CreateAnotationType)
router.put('/annotationtypes/', generateValidation(['Code','Description']), EditAnnotationType)
router.delete('/annotationtypes/', generateValidation(['Code']), DeleteAnnotationType)

export default router
