import { createHash } from "node:crypto";

export function generateHash(fileBuffer) {
    const hash = createHash("sha256");
    hash.update(fileBuffer);
    return hash.digest("hex");
}
