const bodyParser = require('body-parser')
const express = require('express')

const app = express()
const users = [];

app.set('view engine', 'pug')
app.set('views', 'views')
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.render('index', {pageTitle: 'Add user'})
})

app.get('/users', (req, res) => {
  res.render('users', { pageTitle: 'Users', users: users });
})

app.post('/add-user', (req, res) => {
  users.push({name: req.body.username})
  res.redirect('/users')
})

app.listen(3000)