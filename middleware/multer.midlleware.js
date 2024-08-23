import multer from "multer";

const multerUpload = multer({
    limits: {
        fileSize: 1024 * 1024 * 10  
    }
});

const singleUpload = multerUpload.single("image"); 

export { singleUpload };
