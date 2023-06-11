import { Router } from 'express'
import { createUser } from '../controller/user.controller.js'
import passport from 'passport'

const userRouter = Router()

// GET endpoint para mostrar la vista de formulario 
userRouter.get('/login', (req, res) => {
    res.render('login');
    //res.render('login');
  });

userRouter.post("/createUser", passport.authenticate("register"), createUser)

export default userRouter