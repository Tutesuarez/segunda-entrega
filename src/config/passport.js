import local from 'passport-local'  // importo estrategia a utilizar
import passport from 'passport' // importo el core del passport
import { Strategy as GithubStrategy } from 'passport-github2'

import { createHash, isValidPassword } from '../utils/bcrypt.js'
import { userModel } from '../controller/models/user.model.js'
import "dotenv/config"

const LocalStrategy = local.Strategy // defino estragia local

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
    try {
        const user = userModel.findById(id)
        done(null, user)
    } catch {
        done(error)
    }
})

// passport.use('login', new LocalStrategy({
//     usernameField: 'email',
//     passReqToCallback: true
// }, async (req, email, password, done) => {
//     try {
//         const user = await userModel.findone({ email })
//         if (!user) return done(null, false, { message: 'User or Password incorrect' })
//         if (isValidPassword(password, user.password)) {
//             return done(user)
//         }
//         return done(null, false)
//     } catch {
//         return done(null, false)
//     }
// }))

async function verifyCallback(accessToken, refreshToken, profile, done) {
    const { name, email, gender} = profile._json
    try {
        const userDB = await userModel.findOne({ email })
        if (userDB) {
            return done(null, userDB)
        }
        const user = {
            first_name: name.split(' ')[0],
            last_name: name.split(' ')[1] || '',
            email,
            gender: gender || '',
            password: ' ',
        }
        const newUserDB = await userModel.create(user)
        done(null, newUserDB)
    } catch (error) {
        done(error)
    }
}

passport.use('githubSignup', new GithubStrategy({
    clientID: process.env.CLIENTID,
    clientSecret: process.env.CLIENTSECRET,
    callbackURL: 'http://localhost:8080/api/session/githubSignup',
}, verifyCallback))
