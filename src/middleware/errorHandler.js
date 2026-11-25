import multer from "multer";

function errorHandler(error, req, res, next) {
    console.error("[API ERROR]", error);

    if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
            return res.status(413).json({
                success: false,
                message: "File size exceeds the 10 MB limit"
            });
        }

        return res.status(400).json({
            success: false,
            message: "Invalid file upload request"
        });
    }

    if (error.code === "UNSUPPORTED_FILE_TYPE") {
        return res.status(415).json({
            success: false,
            message: "Unsupported file type. Allowed: PDF, JPG, PNG, DOC, DOCX"
        });
    }

    if (error.type === "entity.too.large") {
        return res.status(413).json({
            success: false,
            message: "Request body is too large"
        });
    }

    if (error.type === "entity.parse.failed") {
        return res.status(400).json({
            success: false,
            message: "Invalid JSON request body"
        });
    }

    return res.status(500).json({
        success: false,
        message: "Internal server error"
    });
}

export default errorHandler;