const express = require('express')
const router = express.Router()
const {signup, signin, AById, checkEmailIfExist, getOneConducteur} = require('../controllers/conducteurController')
const {requireSignIn, isAuth, isConducteur} = require('../middllwars/auth')
const {SignInValidator, SignUpValidator} = require('../middllwars/signmiddlwars')

router.post('/signIn', SignInValidator, signin)
router.post('/signUp', SignUpValidator, checkEmailIfExist, signup)

router.get('/:Aid', requireSignIn, isAuth, isConducteur, getOneConducteur)
router.param('Aid', AById)

module.exports = router
