import multer from "multer";
import path from "path";

const allowedTypes = {
    ".pdf": ["application/pdf"],
    ".jpg": ["image/jpeg"],
    ".jpeg": ["image/jpeg"],
    ".png": ["image/png"],
    ".doc": ["application/msword"],
    ".docx": [
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ]
};

const storage = multer.memoryStorage();

const upload = multer({
    storage,

    limits: {
        fileSize: 10 * 1024 * 1024,
        files: 1,
        fields: 10,
        fieldSize: 64 * 1024,
        parts: 12
    },

    fileFilter: (req, file, cb) => {
        const extension = path.extname(file.originalname).toLowerCase();

        const allowedMimeTypes = allowedTypes[extension];

        if (
            !allowedMimeTypes ||
            !allowedMimeTypes.includes(file.mimetype)
        ) {
            const error = new Error("Unsupported file type");
            error.code = "UNSUPPORTED_FILE_TYPE";

            return cb(error);
        }

        cb(null, true);
    }
});

export default upload;