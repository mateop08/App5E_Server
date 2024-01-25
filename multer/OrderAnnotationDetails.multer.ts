import multer from "multer"
import path from 'path'
import OrderAnnotationDetailGestor from "../models/OrderAnnotationDetails.model"
import { Request, NextFunction, Response } from "express"

const validateExist = (field: any, fieldName: string) => {
    if (field === undefined) throw(`No se especificó el parametro ${fieldName} en la petición.`)
}

const checkFileType = (file: Express.Multer.File) => {

    const filetypes = /jpeg|jpg|png|pdf|aac|mp3|mp4|mpeg/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if(!(mimetype && extname)) throw('Error: los únicos tipos de archivos permitidos para los documentos de orden son: jpeg, jpg, png, pdf, mp3, mp4, mpeg')
}

const destination = (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void ) => {
    const {OrderDocument, OrderNumber, AnnotationId, Note, User} = req.body
    
    try {
        validateExist(OrderDocument,'OrderDocument')
        validateExist(OrderNumber,'OrderNumber')
        validateExist(AnnotationId,'AnnotationId')
        validateExist(Note,'Note')
        validateExist(User,'User')
        checkFileType(file)
        OrderAnnotationDetailGestor.ValidateAction(AnnotationId)
            .then( () => cb(null, './uploads'))
            .catch((err)=> cb(err.message, './uploads'))
    } catch (err: any) {
        cb(err, './uploads')
    }
    //
}

const filename = (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void ) => {
    
    let error: Error | null = null
    let fileName = ''
    try {
        const {OrderDocument, OrderNumber} = req.body
        const name = OrderDocument + OrderNumber + '-EVIDENCE-'
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        fileName = name + '-' + uniqueSuffix + path.extname(file.originalname)
        
    } catch (err: any) {
        error = new Error(err)
    }
    cb(error, fileName)
    
}

const storage = multer.diskStorage({
    destination: destination,
    filename: filename
})

const fileInputName = 'File'

export const uploadEjecution = (req: Request, res: Response, next: NextFunction) => {

    const upload = multer({storage: storage}).single(fileInputName)
    let errorMessage = ''
    upload(req, res, function (err) {

        if (err instanceof multer.MulterError) {
            errorMessage = err.name + ' ' + err.message  + ' (' + err.field + ')'
            return res.status(400).send(errorMessage)
             
        } else if (err) {
            return res.status(400).send(err)
        }
        return next() 
        
    })
}
