import { NextFunction, Request, Response } from "express";
// import Post from "../../models/Post";
// import User from "../../models/User";
// import Comment from "../../models/Comment";
// import { newPostValidator } from "./validator";
// import postIncludes from "../common/post-includes";
import Vacation from "../../models/Vacation";
import Follow from "../../models/Follow";
import User from "../../models/User";

export async function getAll(req: Request, res: Response, next: NextFunction) {

    try {
        const vacations = await Vacation.findAll({
            include: [{
                model: User,
                attributes: ["id"],
                through: { attributes: [] } 
            }
            ]
        })
        res.json(vacations)
    } catch (e) {
        next(e)
    }
}

export async function createNewVacation(req: Request, res: Response, next: NextFunction) {

    try {
        const newVacation = await Vacation.create({
            ...req.body,
            imageUrl: req.imageUrl
        })
        res.json(newVacation)
    } catch (e) {
        next(e)
    }
}

export async function updateVacation(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
        const vacation = await Vacation.findByPk(req.params.id);
        if (!vacation) return next({
            status: 404,
            message: 'no vacation was found'
        })
        const { destination, description, startTime, endTime, price } = req.body
        vacation.destination = destination
        vacation.description = description
        vacation.startTime = startTime
        vacation.endTime = endTime
        vacation.price = price

        await vacation.save()
        res.json(vacation)
    } catch (e) {
        next(e)
    }
}

export async function deleteVacation(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
        const { id } = req.params
        const deletedRows = await Vacation.destroy({ where: { id } })
        if (deletedRows === 0) return next({
            status: 404,
            message: 'No vacation was found'
        })
        res.json({ success: true })
    } catch (e) {
        next(e)
    }
}