import { NextFunction, Request, Response } from "express";
import Follow from "../../models/Follow";
import Vacation from "../../models/Vacation";
import User from "../../models/User";

export async function follow(req: Request<{ vacationId: string }>, res: Response, next: NextFunction) {
    try {
        const userId = req.user.id;
        const vacationId = req.params.vacationId;

        const existing = await Follow.findOne({
            where: {
                userId,
                vacationId
            }
        })
        if (existing) throw new Error('follow already exists')

        await Follow.create({ userId, vacationId });
        const vacation = await Vacation.findByPk(vacationId, {
            include: [{
                model: User,
                attributes: ["id"],
                through: { attributes: [] }
            }]
        });

        res.json(vacation);

    } catch (e) {
        if (e.message === 'follow already exists') return next({
            status: 422,
            message: e.message
        })
        next(e)
    }
}

export async function unfollow(req: Request<{ vacationId: string }>, res: Response, next: NextFunction) {
    try {
        const userId = req.user.id;
        const vacationId = req.params.vacationId;

        const follow = await Follow.findOne({ where: { userId, vacationId } });
        if (!follow) throw new Error('the user is not following this vacation')

        await follow.destroy()

        const vacation = await Vacation.findByPk(vacationId, {
            include: [{
                model: User,
                attributes: ["id"],
                through: { attributes: [] }
            }]
        });

        res.json(vacation);

    } catch (e) {
        console.log(e)
        if (e.message === 'the user is not following this vacation') return next({
            status: 422,
            message: 'the user is not following this vacation'
        })
        next(e)
    }
}

