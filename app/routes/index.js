const express = require('express');
const router = express.Router();
const Article = require('../models/article')
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

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

// API - Post Subscribers' Contact Info
router.post('/api/contacts', async(req, res) => {
    console.log(req.body)
})

module.exports = router;