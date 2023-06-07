import { Router } from 'express'
import { createUser } from '../controller/user.controller.js'
import passport from 'passport'

const userRouter = Router()

// GET endpoint para mostrar la vista de formulario 
userRouter.get('/register', (req, res) => {
    res.render('createUser');
  });

userRouter.post("/register", passport.authenticate("register"), createUser)

export default userRouter