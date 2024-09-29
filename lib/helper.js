export const getBase64 = (file) => {
    if (!file || !file.buffer) {
        throw new Error("Invalid file object or buffer is undefined");
    }
    return `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
};