const express = require('express');
const router = express.Router();
const Article = require('../models/article')
const Contact = require('../models/Contact')
const Subscriber = require('../models/Subscriber')
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const sendMail = require('../config/mailer')

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome', {
    title: 'Welcome'
}));

// Dashboard
router.get('/dashboard', ensureAuthenticated, async(req, res) => {
    let current_user = req.user
    req.flash('success_msg', `Welcome ${current_user.name}!...`);
    res.render('admin/dashboard', {
        title: 'Dashboard',
        user: current_user,
        layout: './layouts/sidebarLayout'
    })
});

// API - Get All Blogs
router.get('/api/blogs', async(req, res) => {
    const articles = await Article.find().sort({ createdAt: 'desc' })
    res.json(articles)
})

// API - Post Contacts
router.post('/api/contacts', async(req, res) => {
    let mail_body = req.body

    //console.log(mail_body)

    const { name, email, phone, message } = mail_body
    const contact = new Contact({
        name,
        email,
        phone,
        message
    })

    contact.save()
        .then(contact => {
            res.status(200).json({
                success: `Saved a new contact: ${contact}`
            })
        })
        .catch(err => {
            res.status(500).json({ error: `Error occurred: ${err.message}` })
        })

    sendMail(mail_body)
        .then((emailSent) => {
            console.log(`${emailSent.response}`)
            console.log('Email sent to:', emailSent.envelope.to)
        })
        .catch((error) => console.log(`Error occurred while sending the contact email: ${error.message}`))
})

// API - Post Subscribers
router.post('/api/subscribers', async(req, res) => {
    let mail_body = req.body

    //console.log(mail_body)

    const { name, email } = mail_body
    const subscriber = new Subscriber({
        name,
        email
    })

    subscriber.save()
        .then(subscriber => {
            res.status(200).json({
                success: `
                        Saved a new subscriber: ${ subscriber }
                        `
            })
        })
        .catch(err => {
            res.status(500).json({ error: `
                        Error occurred
                        while saving a subscriber: ${ err.message }
                        ` })
        })

    sendMail(mail_body)
        .then((emailSent) => {
            //console.log(`${ emailSent.response }`)
            console.log('Email sent to:', emailSent.envelope.to)
        })
        .catch((error) => console.log(`Error occurred while sending the subscriber email: ${error.message}`))
})

module.exports = router;