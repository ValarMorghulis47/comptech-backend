// import multer from "multer";

// const multerUpload = multer({
//     limits: {
//         fileSize: 1024 * 1024 * 10  
//     }
// });

// const singleUpload = multerUpload.single("image");
// const multipleUpload = multerUpload.array("images", 10); 

// export { singleUpload, multipleUpload };

import multer from "multer";

const multerUpload = multer({
    limits: {
        fileSize: 1024 * 1024 * 10  // 10 MB
    }
});

const upload = multerUpload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'person', maxCount: 1 },
    { name: 'eventPics', maxCount: 10 },
]);

export { upload };