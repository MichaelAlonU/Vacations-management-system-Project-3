import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import config from 'config'

interface JwtUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    roleName: string;
}
declare global {
    namespace Express {
        interface Request {
            user?: JwtUser
        }
    }
}

export default function authenticate(req: Request, res: Response, next: NextFunction) {

    const jwtSecret = config.get<string>('app.jwtSecret')

    const authHeader = req.get('Authorization')

    if (!authHeader) return next({
        status: 401,
        message: 'missing Authorization header'
    })

    if (!authHeader.startsWith('Bearer')) return next({
        status: 401,
        message: 'missing Bearer keyword'
    })

    const parts = authHeader.split(' ')
    const jwt = parts[1]

    if (!jwt) return next({
        status: 401,
        message: 'missing jwt'
    })

    try {
        const user = verify(jwt, jwtSecret) as JwtUser
        req.user = user
        console.log(user)
        next()

    } catch (e) {
        next({
            status: 401,
            message: 'invalid jwt'
        })
    }
}