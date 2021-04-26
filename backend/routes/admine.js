const express = require('express')
const router = express.Router()
const {signin, AById, getOneAdmine, updateConducteur, checkNumberOfPoint, getNumberOfPoint, addInfraction, sendMailToConducteur, getAllConducteur, getOneConducteur} = require('../controllers/admineController')
const {requireSignIn, isAuth, isAdmine} = require('../middllwars/auth')
const {SignInValidator, updateConducteurV} = require('../middllwars/signmiddlwars')

router.post('/signIn', SignInValidator, signin)
// router.post('/signUp', signup)
router.post('/updateConducteur/:Aid/:id', requireSignIn, isAuth, isAdmine, updateConducteurV, getNumberOfPoint, checkNumberOfPoint, updateConducteur, addInfraction, sendMailToConducteur)

router.get('/getAllConducteur', getAllConducteur)
router.get('/getOneConducteur/:Cid', getOneConducteur)

router.get('/:Aid', requireSignIn, isAuth, isAdmine, getOneAdmine)
router.param('Aid', AById)

module.exports = router
