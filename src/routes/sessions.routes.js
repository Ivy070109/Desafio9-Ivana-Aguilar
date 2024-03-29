import { Router } from 'express'
//import usersModel from '../dao/models/users.model.js'
//importo las funciones de bcrypt
import { createHash, isValidPassword } from '../utils.js'
//importar de passport
import passport from 'passport'
//importamos el congif de passport
import initPassport from '../auth/passport.auth.js'

//inicializo la estrategia de passport
initPassport()
const router = Router()

//middleware de autenticación del admin
const auth = (req, res, next) => {
    try {
        if (req.session.user.admin) {
            if (req.session.user.admin === true) {
                next()
            } else {
                res.status(403).send({ status: 'ERR', data: 'Usuario no admin', role: 'user' })
            }
        } else {
            res.status(401).send({ status: 'ERR', data: 'Usuario no autorizado' })
        }
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message })
    }
}

// cerrar sesion
router.get('/logout', async (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                res.status(500).send({ status: 'ERR', data: err.message })
            } else {
                //res.status(200).send({ status: 'OK', data: "Sesión finalizada" })
                res.redirect('/login')
            }
        })
    } catch (err) {
        res.status(500).send({ status: "ERR", data: err.message })
    }
})

//pequeña autenticación del admin, utilizaré un middleware para ésto  
router.get('/admin', auth, async (req, res) => {
    try {
        res.status(200).send({ status: 'OK', data: 'Éstos son los datos para el administrador'})
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message })
    }
})

//para hashear passwords planos anteriores. Es un endpoint de uso interno!
router.get('/hash/:pass', async (req, res) => {
    res.status(200).send({ status: 'OK', data: createHash(req.params.pass) })
})

//endpoint de fail de register
router.get('/failregister', async (req, res) => {
    res.status(400).send({ status: 'ERR', data: 'El email ya existe o faltan completar campos obligatorios' })
})

//endpoint de fail restore
router.get('/failrestore', async (req, res) => {
    res.status(400).send({ status: 'ERR', data: 'El email no existe o faltan completar campos obligatorios' })
})

//ruta de autenticación fail de login
router.get('/failauth', async (req, res) => {
    res.status(400).send({ status: 'ERR', data: 'Ha habido un error en el login' })
})

//endpoint de github con autenticación con passport
router.get('/github', passport.authenticate('githubAuth', { scope: ['user: email'] }), async (req, res) => {
})

//endpoint de callback de github
router.get('/githubcallback', passport.authenticate('githubAuth', { failureRedirect: '/login' }), async (req, res) => {
    req.session.user = { username: req.user.email, admin: true }
    //req.session.user = req.user
    res.redirect('/profile')
})

//login hardcodeado
/* router.post('/login', async (req, res) => {
    try { 
        const { email, password } = req.body

        const userInDb = await usersModel.findOne({ email: email })

        if (userInDb !== null && isValidPassword(userInDb, password)) {
            req.session.user = { username: email, admin: true } 
            res.redirect('/products')
        } else {
            res.status(401).send({ status: 'ERR', data: `Datos no válidos` })
        } 
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message })
        }
}) */

//ruta current para login
router.get('/current', (req, res) => {
    if (req.user) {
        const user = req.user
        res.status(200).send({ message: 'Inicio de sesión exitoso', user })
    } else {
        res.redirect('/login')
    }
})

//register con passport
router.post('/login', passport.authenticate('loginAuth', { failureRedirect: '/api/sessions/failauth' }), async (req, res) => {
    try {
        res.redirect('/products')
        //res.redirect('/api/sessions/current')
        //res.status(200).send({ status: 'OK', data: 'bienvenido' })
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message })
    }
}) 

//register con password plano
/*
router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body

        const userExists = await usersModel.findOne({ email })
        if (userExists) {
            return res.status(401).json({ status: 'ERR', data: 'El correo ya está registrado' })
        }

        const newUser = new usersModel({
            first_name,
            last_name,
            email,
            age,
            password
        })
        
        await newUser.save()

        res.status(200).json({ status: 'OK', data: 'Usuario registrado' })
    } catch (err) {
        res.status(400).json({ status: 'ERR', data: err.message })
    }
})
*/

//register con passport
router.post('/register', passport.authenticate('register', { failureRedirect: '/api/sessions/failregister'}), async (req, res) => {
    try {
        res.status(200).send({ status: 'OK', data: 'Usuario registrado' })
        //res.redirect('/login')
    } catch(err) {
        res.status(500).send({ status: 'ERR', data: err.message })
    }
})

//restaurar contraseña
router.post('/restore', passport.authenticate('restore', { failureRedirect: '/api/sessions/failrestore' }), async (req, res) => {
    try {
        res.status(200).send({ status: 'OK', data: "Contraseña actualizada" })
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message })
    }
})

export default router
