import { Upload } from "@aws-sdk/lib-storage";
import { NextFunction, Request, Response } from "express";
import s3Client, { createAppBucketIfNotExists } from "../aws/aws";
import config from 'config'
import { UploadedFile } from "express-fileupload";
import { randomUUID } from "crypto";
import { extname } from "path";
import { URL } from 'url'

declare global {
    namespace Express {
        interface Request {
            imageUrl?: string
        }
    }
}

export default async function fileUploader(req: Request, res: Response, next: NextFunction) {
    console.log("=== HEADERS ===");
    console.log(req.headers);

    console.log("=== CONTENT-TYPE ===");
    console.log(req.headers['content-type']);

    console.log("=== METHOD & URL ===");
    console.log("method: ", req.method, "URL:", req.url);

    console.log(`=======body :  ========`)
    console.log(req.body)

    console.log(`=======req files:  ========`)
    console.log(req.files)

    if (!req.files) return next()
    if (!req.files.image) return next()

    console.log(`req files:  `, req.files)

    const { mimetype, data, name } = req.files.image as UploadedFile
    try {
        await createAppBucketIfNotExists();
    } catch (e) {
        console.error("Bucket creation failed:", e);
        return next(e);
    }
    const upload = new Upload({
        client: s3Client,
        params: {
            Bucket: config.get<string>('s3.bucket'),
            Key: `${randomUUID()}${extname(name)}`,
            ContentType: mimetype,
            Body: data
        }
    })

    const result = await upload.done()
    const url = new URL(result.Location)
    req.imageUrl = url.pathname
    next()
}