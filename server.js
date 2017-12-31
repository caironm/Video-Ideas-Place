const express = require('express');
const path = require('path')
const app = express();
const PORT = 5000;
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const passport = require("passport")
const session = require('express-session');

// Body parser middleware

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

require('./config/passport')(passport)



// Static folder

app.use(express.static(path.join(__dirname,'public')))

//Map global promise

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/vidjot-dev', {
	useMongoClient: true
}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))

app.use(methodOverride('_method'))


app.use(session({
	secret: 'a4f8071f-c873-4447-8ee2',
	resave: false
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

// Global Variables

app.use(function(req, res, next){
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	next();
})

app.engine('handlebars', exphbs({defaultLayout: 'main'}))

app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
	res.render('index', {title: "Vidjot"});
})

app.get('/about', (req, res) => {
	res.render("about");
})


// Load Routes
	const ideas = require('./routes/ideas')
	app.use('/ideas', ideas)

	const users = require('./routes/users')
	app.use('/users', users)

app.listen(PORT, () => {
	console.log(`Servidor rodando na porta ${PORT} `);
})
