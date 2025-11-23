import { NextFunction, Request, Response } from "express";
import Follow from "../../models/Follow";
// import socket from "../../io/io";
// import SocketMessages from "socket-enums-shaharsolllllll";

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
        res.json({ success: true });

        // const follow = await Follow.create({
        //     followerId: req.userId,
        //     followeeId: req.params.id
        // })
        // res.json(follow)

        // const followee = (await User.findByPk(req.params.id)).get({ plain: true })
        // const follower = (await User.findByPk(req.userId)).get({ plain: true })

        // socket.emit(SocketMessages.NewFollow, {
        //     from: req.get('x-client-id'),
        //     followee,
        //     follower
        // })

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
        res.json({
            success: true
        })
    } catch (e) {
        console.log(e)
        if (e.message === 'the user is not following this vacation') return next({
            status: 422,
            message: 'the user is not following this vacation'
        })
        next(e)
    }
}

