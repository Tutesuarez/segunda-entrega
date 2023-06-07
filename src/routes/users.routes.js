import { Router } from 'express'
import { createUser } from '../controller/user.controller.js'
import passport from 'passport'

const userRouter = Router()

userRouter.post("/register", passport.authenticate("register"), createUser)

export default userRouter