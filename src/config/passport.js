import local from 'passport-local'  // importo estrategia a utilizar
import passport from 'passport' // importo el core del passport

import { createHash, isValidPassword } from '../utils/bcrypt.js'
import { userModel } from '../controller/models/user.model.js'

const LocalStrategy = local.Strategy // defino estragia local

const initializePassport = () => {
    // Defino la aplicacion de mi estragia
    passport.use('register', new LocalStrategy(
        {
            passReqToCallback: true,
            usernameField: 'email'
        },
        async (req, usernameField, password, done) => {
            const { first_name, last_name, email, gender } = req.body
            try {
                const user = await userModel.findone({ email: email }) // busco un usuario con el mail ingresado

                if (user) {
                    return (null, false) // Usuario ya registrado
                }

                // si usuario no exite, lo creo
                const passwordHash = createHash(password)
                const userCreated = userModel.create({
                    first_name: first_name,
                    last_name: last_name,
                    email: email,
                    gender: gender,
                    password: passwordHash
                })
                return done(null, userCreated)
            } catch (error) {
                return done(error)
            }
        }
    ))

    // inicializar la session del usuario
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    //Eliminar la sesion del usuario
    passport.deserializeUser(async (id, done) => {
        const user = userModel.findById(id)
        done(null, user)
    })

    passport.use('login', new LocalStrategy({ 
        usernameField: 'email' 
    }, async (username, passport, done) => {
        try {
            const user = await userModel.findone({ email: username })
            if (!user) return done(null, false, { message: 'User or Password incorrect' })
            if (isValidPassword(password, user.password)) {
                return done(user)
            }
            return done(null, false)
        } catch {
            return done(null, false)
        }
    }))

}
export default initializePassport