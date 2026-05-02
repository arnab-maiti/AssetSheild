import crypto from "node:crypto";

export function generateHash(fileBuffer) {
    const hash = crypto.createHash("sha256");
    hash.update(fileBuffer);
    return hash.digest("hex");
}
