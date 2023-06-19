import bcrypt  from 'bcrypt'
import {genSaltSync} from 'bcrypt'


// //Encripta contrsa;a y devuelve
//  export const createHash = (password) => bcrypt.hashSync(password, genSaltSync(parseInt(process.env.SALT)) )

// //Devolver un logico (V o F) si la contraseña enviada es igual a la de BDD
// export const validatePassword = (passwordSend, passwordBDD) => bcrypt.compareSync(passwordSend, passwordBDD)

export const createHash = password => {return bcrypt.hashSync(password, bcrypt.genSaltSync())};
// export const isValidPassword = (user, password) => {return bcrypt.compareSync(password, user.password)};
export const isValidPassword = (user, password) => {return bcrypt.compareSync(password, user.password)};