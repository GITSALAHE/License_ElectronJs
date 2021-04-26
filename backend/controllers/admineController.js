const Admine = require('../models/Admine')
const Conducteur = require('../models/Conducteur')
const Infraction = require('../models/infraction')

const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer")

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ADMINE
exports.signup = (req, res) => {
    try {
        if(req.body.confirmPass !== req.body.password || !req.body.confirmPass) {
            return res.status('400').json({error: "the password dosn't match"})
        }
        const admine = new Admine(req.body)

        admine.save((err, admine) => {
            if(err) {
                return res.status('400').json({error: "this email is already existe"})
            }
            admine.hashed_password = undefined
            admine.salt = undefined

            res.send(admine)
        })
    }
    catch(error) {

    }
}

exports.signin = (req, res) => {
    try {
        const {email, password} = req.body

        Admine.findOne({email}, (err, admine) => {
            if(err || !admine) {
                return res.status(400).json({error: "Admine not found ith this email, please sign up"})
            }
            if(!admine.authenticate(password)) {
                return res.status(401).json({error: 'Email and password d\'ont match !'})
            }

            const token = jwt.sign({_id: admine._id, role: admine.role, exp: Math.floor(Date.now() / 1000) + (60 * 60)}, process.env.JWT_SECRET);
    
            res.cookie('token', token, {expire: new Date() + 5000})

            const {_id, name, email, role} = admine;

            return res.json({
                token, admine: {_id, name, email, role}
            })
        })
    }
    catch(error) {

    }
}

exports.AById = (req, res, next, id) => {
    Admine.findById(id).exec((err, admine) => {
        if(err || !admine) {
            return res.status(404).json({
                error: "admine not found !"
            })
        }

        req.profile = admine;
        next();
    })
}

exports.getOneAdmine = (req, res) => {
    res.json({
        A: req.profile
    })
}

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> CONDUCTEUR
exports.getNumberOfPoint = (req, res, next) => {
    Conducteur.find({_id: req.params.id}, (err, numberOfP) => {
        if(err) {
            return res.status(400).json({error: 'server erreur'})
        }
        req.numberOfP = numberOfP[0].nombre_du_point
        req.conducteurEmail = numberOfP[0].email
        next()
    })
}

exports.checkNumberOfPoint = (req, res, next) => {
    Conducteur.findOne({_id: req.params.id}, (err, numberOfP) => {
        if(err) {
            return res.status(400).json({error: 'server erreur'})
        }
        if(req.body.nombre_du_point >= req.numberOfP) {
            return res.status(400).json({error: `enter a number less than ${req.numberOfP}`})
        }
        next()
    })
}

exports.updateConducteur = (req, res, next) => {
    Conducteur.findOneAndUpdate({_id: req.params.id}, {nombre_du_point: req.body.nombre_du_point}, (err, updated) => {
        if(err) {
            return res.status(400).json({error: 'server erreur'})
        }
        // res.send(updated)
        next()
    })
}

exports.addInfraction = (req, res, next) => {
    const infraction = new Infraction({
        infractionName: req.body.infractionName,
        TO: req.params.id
    })

    infraction.save((err, infraction) => {
        if(err) {
            return res.status('400').json({error: "we can't add infraction"})
        }

        next()
    })
}

exports.sendMailToConducteur = async(req, res) => {
    // async..await is not allowed in global scope, must use a wrapper
    try {
        let transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          auth: {
            user: "aibiyassin29@gmail.com",
            pass: "NEVERgiveUP",
          },
          tls: {
            rejectUnauthorized: false,
          },
        });

        let info = await transporter.sendMail({
          from: "monpermis@gmail.com",
          to: req.conducteurEmail,
          subject: "Warning ✔",
          text: "Compte verifié",
          html: `
            votre infraction :
            <h2>${req.body.infractionName}</h2>
            <br>

            votre point:
            <h1>${req.body.nombre_du_point}</h1>
          `,
        });
      } catch (error) {
        console.log(error);
      }
    res.json('OK')
}

// 
exports.getAllConducteur = (req, res) => {
    Conducteur.find({}, (err, allC) => {
        if(err)
            return res.status(404).send("conducteur is not found")

        res.json({Conducteur: allC})
    })
}

exports.getOneConducteur = (req, res) => {
    Infraction.find({TO: req.params.Cid}, (err, oneC) => {
        if(err)
            return res.status(404).send("conducteur is not found")

        res.json({Conducteur: oneC})
    })
}
