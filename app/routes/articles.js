const express = require('express')
const Article = require('../models/article')
const Trash = require('../models/Trash')
const { ensureAuthenticated } = require('../config/auth');
const router = express.Router()

// Dashboard
router.get('/posts', ensureAuthenticated, async(req, res) => {
    const articles = await Article.find().sort({ createdAt: 'desc' })
    res.render('articles/posts', {
        title: 'All Posts',
        user: req.user,
        articles: articles,
        layout: './layouts/sidebarLayout'
    })
});

router.get('/new', ensureAuthenticated, (req, res) => {
    res.render('articles/new', {
        article: new Article(),
        user: req.user,
        title: 'New Post',
        layout: './layouts/sidebarLayout'
    })
})

router.get('/edit/:id', ensureAuthenticated, async(req, res) => {
    const article = await Article.findById(req.params.id)
    res.render('articles/edit', {
        article: article,
        user: req.user,
        title: 'Edit',
        layout: './layouts/sidebarLayout'
    })
})

router.get('/:slug', ensureAuthenticated, async(req, res) => {
    const article = await Article.findOne({ slug: req.params.slug })
    if (article == null) res.redirect('/')
    res.render('articles/show', {
        article: article,
        user: req.user,
        title: `${req.params.slug}`,
        layout: './layouts/sidebarLayout'
    })
})

router.post('/', ensureAuthenticated, async(req, res, next) => {
    req.article = new Article()
    next()
}, saveArticleAndRedirect('new'))

router.put('/:id', ensureAuthenticated, async(req, res, next) => {
    req.article = await Article.findById(req.params.id)
    next()
}, saveArticleAndRedirect('edit'))


router.delete('/:id', ensureAuthenticated, async(req, res, next) => {
    let errors = []
    let article = await Article.findById(req.params.id)
    try {
        let articleToTrash = new Trash({
            _id: article._id,
            createdAt: article.createdAt,
            title: article.title,
            description: article.description,
            markdown: article.markdown
        })
        await articleToTrash.save()
        await Article.findByIdAndDelete(article)
        req.flash(
            'success_msg',
            'You deleted the post successfully...'
        );
        res.redirect('/articles/posts')
    } catch (err) {
        req.flash(
            'error_msg',
            'An error occurred while deleting that blog...'
        );
        console.log(`Error occured while deleting the article:${err}`)
    }
})

function saveArticleAndRedirect(path) {
    return async(req, res) => {
        let errors = []
        let article = req.article
        article.title = req.body.title
        article.description = req.body.description
        article.markdown = req.body.markdown

        try {
            article = await article.save()
            if (path === 'new') {
                req.flash(
                    'success_msg',
                    'Great! You published a new post...'
                );
            } else {
                req.flash(
                    'success_msg',
                    'You edited the post successfully...'
                );
            }
            res.redirect(`/articles/${article.slug}`)

        } catch (err) {
            console.log(err)
            req.flash(
                'error_msg',
                'An error occurred while saving that blog...'
            );
            res.render(`articles/${path}`, {
                article: article,
                user: req.user,
                title: `${path}`,
                layout: './layouts/sidebarLayout'
            })
        }
    }
}

module.exports = router