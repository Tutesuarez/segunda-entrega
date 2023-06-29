import bcrypt  from 'bcrypt'


export const createHash = password => {return bcrypt.hashSync(password, bcrypt.genSaltSync())};
// export const isValidPassword = (user, password) => {return bcrypt.compareSync(password, user.password)};
export const isValidPassword = (user, password) => {return bcrypt.compareSync(password, user.password)};