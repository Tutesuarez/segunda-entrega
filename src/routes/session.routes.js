import { Router } from 'express'
import { createHash, isValidPassword } from '../utils/bcrypt.js'
import { userModel } from '../controller/models/user.model.js'

const routerSession = Router()

routerSession.post('/register', async (req, res) => {
    const { first_name, last_name, email, gender, password } = req.body

    try {
        const exists = await userModel.findOne({ email })
        if (exists) return res.status(400).send({ status: 'error', error: 'user already exists' })

        const user = {
            first_name,
            last_name,
            email,
            gender,
            password: createHash(password)
        };

        await userModel.create(user)

        res.send({ status: 'success', message: 'user registered' }).redirect('/login')
    } catch (error) {
        console.log(error)
        res.status(500).send({ status: 'error', error }).redirect('/api/views/errorsingup')
    }
});

routerSession.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400)
        .send({ status: 'error', message: 'Incomplete values' }).redirect('/api/views/errorLogin')
    console.log('Incomplete values')

    try {
        const user = await userModel.findOne({ email })
        if (!user) {
            res.status(404).send({ status: 'error', message: 'User not fund' }).redirect('/api/views/errorlogin')
            console.log('User not fund')
        };

        // const isValidPassword = await compareData(password, user.password)
        // if (!isValidPassword){
        //     res.status(401).send({ status: 'error', message: 'Invalid credentials' }).render('errorLogin');
        //     console.log('Invalid credentials');
        // };
        if (!isValidPassword(user, password)) {
            res.status(401).send({ status: 'error', message: 'Invalid credentials' }).redirect('/api/views/errorlogin')
            console.log('Invalid credentials')
        };

        delete user.password

        req.session.user = user
        if (user.isAdmin === true) {
            res.send({ status: 'success', message: 'login success' }).redirect('/perfil')
        } else {
            res.send({ status: 'success', message: 'login success' }).redirect('/')
        }
        console.log('Login Success')
        return user

    } catch (error) {
        res.status(500).send({ status: 'error' })
    }
})

routerSession.get('/logout', async (req, res) => {
    req.session.destroy((err) => {
        if (!err){
            res.redirect("/login")
            console.log(' Session detroyed')
        } 
        else
            res.render("/perfil", {
                title: "Registro",
                style: "home",
                user,
                logued: true,
                error: { message: err, status: true },
            })
    })
})

export default routerSession;