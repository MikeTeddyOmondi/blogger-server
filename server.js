const express = require('express')
const mongoose = require('mongoose')
const flash = require('connect-flash')
const session = require('express-session')
const Article = require('./app/models/article')
const articleRouter = require('./app/routes/articles')
const methodOverride = require('method-override')
const path = require('path')
const cors = require('cors')
const app = express()

// Environment variables
require('dotenv').config()

app.enable('trust proxy');

app.use(cors());
app.use(express.json());

// DB Config
const db = require('./app/config/db').mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true ,useUnifiedTopology: true, useCreateIndex: true}
  )
  .then(() => {
        console.log('_________________________________________'),
        console.log('Database server connection initiated...'),
        console.log('_________________________________________'),
        console.log('Database server connection success!'),
        console.log('_________________________________________')
    })
  .catch(err => console.log(err));

// Express body parser
app.use(express.urlencoded({ extended: false }));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Middleware functions

// Connect flash
app.use(flash());

// Views
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'app', 'views'));
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))

app.get('/', async (req, res) => {
    const articles = await Article.find().sort({ createdAt: 'desc' })
    res.render('./articles/index', { articles: articles })
})

app.get('/api/blogs', async (req, res) => {
    const articles = await Article.find().sort({ createdAt: 'desc' })
    res.json(articles)
})

app.post('/api/contacts', async (req, res) => {
    console.log(req.body)
    //const articles = await Article.find().sort({ createdAt: 'desc' })
    //res.render('./articles/index', { articles: articles })
})

// Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});
  
// Routes
//app.use('/', require('./app/routes/index.js'));
//app.use('/users', require('./app/routes/users.js'));
app.use('/articles', articleRouter)

const PORT = process.env.PORT || 5000

app.listen(PORT, (err) => {
    if (!err) {
        console.log(`_________________________________________`)
        console.log(`Backend services initiated on port: ${PORT}`)
    } else {
        console.log(`___________________________________________________________`)
        console.log(`Error occured while starting the application server: ${err}`)
        console.log(`___________________________________________________________`)
    }
})