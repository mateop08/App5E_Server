import { Router } from "express";
import { CreateBulkProductOpening,  CloseBulkProductOpening, GetBulkProductOpeningByOpeningId, ListActiveBulkProductOpenings, ListAllBulkProductOpenings } from "../controllers/BulkProductOpenings.controller"
import generateValidation from "../validators/BulkProductOpenings.validator";

const router = Router()

router.get('/bulkproductopenings/', generateValidation([]), ListAllBulkProductOpenings)
router.get('/bulkproductopenings/active/', generateValidation([]), ListActiveBulkProductOpenings)
router.get('/bulkproductopenings/byOpeningid/', generateValidation(['OpeningId']), GetBulkProductOpeningByOpeningId)
router.post('/bulkproductopenings/', generateValidation(['ProductCode','User']), CreateBulkProductOpening)
router.put('/bulkproductopenings/close/', generateValidation(['OpeningId','LeftOverAmount','User']), CloseBulkProductOpening)

export default router
