const Conducteur = require('../models/Conducteur')
const jwt = require('jsonwebtoken')

exports.checkEmailIfExist = (req, res, next) => {
    try {
        Conducteur.find({email: req.body.email}, (err, find) => {
            if(find.length > 0)
                return res.status(400).json({error: "this email is already exist"})

            next()
        })
    }
    catch {

    }
}

exports.signup = (req, res) => {
    try {
        if(req.body.confirmPass !== req.body.password || !req.body.confirmPass) {
            return res.status('400').json({error: "the password dosn't match"})
        }
        const conducteur = new Conducteur(req.body)

        conducteur.save((err, Conducteur) => {
            if(err) {
                return res.status('400').json({error: err})
            }
            conducteur.hashed_password = undefined
            conducteur.salt = undefined

            res.send(Conducteur)
        })
    }
    catch(error) {

    }
}

exports.signin = (req, res) => {
    try {
        const {email, password} = req.body

        Conducteur.findOne({email}, (err, conducteur) => {
            if(err || !conducteur) {
                return res.status(400).json({error: "conducteur not found ith this email, please sign up"})
            }
            if(!conducteur.authenticate(password)) {
                return res.status(401).json({error: 'Email and password d\'ont match !'})
            }

            const token = jwt.sign({_id: conducteur._id, role: conducteur.role, exp: Math.floor(Date.now() / 1000) + (60 * 60)}, process.env.JWT_SECRET);
    
            res.cookie('token', token, {expire: new Date() + 5000})

            const {_id, name, email, role} = conducteur;

            return res.json({
                token, conducteur: {_id, name, email, role}
            })
        })
    }
    catch(error) {

    }
}

exports.AById = (req, res, next, id) => {
    Conducteur.findById(id).exec((err, conducteur) => {
        if(err || !conducteur) {
            return res.status(404).json({
                error: "conducteur not found !"
            })
        }

        req.profile = conducteur;
        next();
    })
}

exports.getOneConducteur = (req, res) => {
    res.json({
        C: req.profile
    })
}
