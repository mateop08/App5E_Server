/*import multer from "multer"

const storage = multer.diskStorage({
    destination: function (_req, _file, cb) {
      cb(null, 'uploads')
    },
    filename: function (_req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })

const upload = multer({storage: storage})

const uploadFile = (file: File, destination: string, filename: string) => {

  const storage = multer.diskStorage({
    destination: function (_req, _file, cb) {
      cb(null, 'uploads')
    },
    filename: function (_req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })

  const upload = multer({storage: storage})

  

  upload(_req, res, function (err) {
    if (err instanceof multer.MulterError) {
        const errorMessage = err.name + ' ' + err.message  + ' (' + err.field + ')'
        return res.status(400).send(errorMessage)
    } else if (err) {
        return res.status(400).send(err)
    }
    return next()
})

}

export default upload*/