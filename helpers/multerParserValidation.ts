import multer, { FileFilterCallback } from 'multer';
import { Request, Response, NextFunction } from 'express';
import path from 'path';

export interface multerInputs {
    name: string
    maxCount: number
}

const storage = multer.diskStorage({
    destination: function (_req, _file, cb) {
        //console.log(req.body)
        console.log("Esto pasoo")
        cb(null, './uploads')
        //throw("Error de prueba 2")
    },
    filename: function (req, file, cb) {
        const {OrderDocument, OrderNumber, DocumentCode} = req.body
        const name = OrderDocument + OrderNumber + DocumentCode
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, name + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})

const multerInputsAdapter = (fields: string[]) => {
    const inputs: multerInputs[] = fields.map((f) => {return {name: f, maxCount: 1 }})
    return inputs
}

export const getMulterParserValidation = (fields: string[]) => {

    const multerParserValidation = (_req: Request, res: Response, next: NextFunction) => {

        const inputs = multerInputsAdapter(fields)
        const upload = multer({storage: storage, fileFilter: checkFileType}).fields(inputs)
        upload(_req, res, function (err) {
            if (err instanceof multer.MulterError) {
                const errorMessage = err.name + ' ' + err.message  + ' (' + err.field + ')'
                console.log(err)
                return res.status(400).send(errorMessage)
            } else if (err) {
                return res.status(400).send(err)
            }
            return next()
        })
    }

    return multerParserValidation    
}


function checkFileType(_req: Request, file: Express.Multer.File, cb:  FileFilterCallback){
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
  
    if(mimetype && extname){
      return cb(null, true);
    } else {
        const err = new Error('Error: Images Only!')
        cb(err);
    }
  }