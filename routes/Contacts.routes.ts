import { Router } from "express";
import { CreateContact,  ListContactsByFullName, EditContact, DeleteContact, ListAllContacts } from "../controllers/Contacts.controller"
import generateValidation from "../validators/Contacts.validator";


const router = Router()

router.get('/contacts/', generateValidation([]), ListAllContacts)
router.get('/contacts/byFullName/', generateValidation(['FullName']), ListContactsByFullName)
router.post('/contacts/', generateValidation(['Identification', 'FullName', 'ContactNumber', 'Email', 'Address']), CreateContact)
router.put('/contacts/', generateValidation(['Identification', 'FullName', 'ContactNumber', 'Email', 'Address']), EditContact)
router.delete('/contacts/', generateValidation(['Identification']), DeleteContact)

export default router
