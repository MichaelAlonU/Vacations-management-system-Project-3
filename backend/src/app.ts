import express, { json } from 'express'
import logger from './middlewares/error/logger';
import responder from './middlewares/error/responder';
import notFound from './middlewares/not-found';
import config from 'config'
import sequelize from './db/sequelize';
import Role from './models/Role';
import cors from 'cors'
import vacationsRouter from './routers/vacations'
import authRouter from './routers/auth'
import authenticate from './middlewares/authenticate';
import fileUpload from 'express-fileupload';

const app = express()

const port = Number(config.get<number>('app.port'))
const appName = String(config.get<string>('app.name'))
const secret = String(config.get<string>('app.secret'))

console.log(`app secret is ${secret}`)

app.use(cors())
app.use(fileUpload())
app.use(json())

app.use('/auth', authRouter)
app.use(authenticate)
app.use('/vacations', vacationsRouter)

// not found
app.use(notFound)

// error middlewares
// app.use(logger)
// app.use(responder)


(async () => {
  await sequelize.sync({ force: process.argv[2] === 'force', alter: process.argv[2] === 'alter' })
  await Role.bulkCreate(
    [
      { roleName: 'USER' },
      { roleName: 'ADMIN' },
    ],
    { ignoreDuplicates: true }
  );
  console.log('Roles seeded successfully');

  app.listen(port, () => console.log(`${appName} started on port ${port}`))

})()


console.log(process.argv)
