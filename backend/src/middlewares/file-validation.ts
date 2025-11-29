import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";

export default function fileValidation(validator: ObjectSchema) {
    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            console.log("Validating pic with fileVal middleware, req.files: ", req.files)
            // If there are no uploaded files, skip validation (optional image)
            const files = (req.files ?? {}) as any
            if (!files) {
                console.log("No files uploaded - skipping file validation")
                return next()
            }

            const validated = await validator.validateAsync(files)
            // assign back the validated object (may be useful downstream)
            req.files = validated as any
            console.log("Validating pic with fileVal middleware ended successfully")
            next()
        } catch (e) {
            next({
                status: 422,
                message: e.message
            })
        }
    }

}