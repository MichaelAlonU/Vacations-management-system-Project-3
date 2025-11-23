import { NextFunction, Request, Response } from "express";
import User from "../../models/User";
import config from 'config'
import { createHmac } from "crypto";
import { sign } from "jsonwebtoken";
import Role from "../../models/Role";

function hashAndSaltPassword(plainTextPassword: string): string {
    const secret = config.get<string>('app.secret')
    return createHmac('sha256', secret).update(plainTextPassword).digest('hex')
}

function makeJwt(user: User): string {
    const jwtSecret = config.get<string>('app.jwtSecret')

    const plainData = user.get({ plain: true })
    // delete plainData.password
    const tokenPayload = {
        id: plainData.id,
        firstName: plainData.firstName,
        lastName: plainData.lastName,
        email: plainData.email,
        roleName: plainData.role?.roleName
    };
    const jwt = sign(tokenPayload, jwtSecret);

    return jwt
}

export async function signup(req: Request, res: Response, next: NextFunction) {
    try {

        req.body.password = hashAndSaltPassword(req.body.password)
        req.body.email = req.body.email.trim().toLowerCase();
        const existingEmail = await User.findOne({
            where: {
                email: req.body.email,
            }
        })
        if (existingEmail) throw new Error('email already in use')

        const userRole = await Role.findOne({ where: { roleName: "USER" } });
        req.body.roleId = userRole.id;
        const user = await User.create(req.body)
        const jwt = makeJwt(user);
        res.json({ jwt })
    } catch (e) {
        next(e)
    }
}

export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        req.body.email = req.body.email.trim().toLowerCase();
        const user = await User.findOne({
            where: {
                email: req.body.email,
                password: hashAndSaltPassword(req.body.password)
            },
            include: [Role]
        })
        if (!user) throw new Error('invalid email and/or password')
        const jwt = makeJwt(user);
        res.json({ jwt })
    } catch (e) {
        if (e.message === 'invalid email and/or password') return next({
            status: 401,
            message: 'invalid email and/or password'
        })
        next(e)
    }
}
