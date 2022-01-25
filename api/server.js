const path = require('path')
const express = require('express')
const session = require('express-session')

const usersRouter = require('./users/users-router.js')
const authRouter = require('./auth/auth-router.js')

const server = express()

server.use(express.static(path.join(__dirname, '../client')))
server.use(express.json())
server.use(session({
  name: 'monkey',
  secret: process.env.SECRET || 'keep it secret',
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false, // if true, only works on HTTPS
    httpOnly: false, // if true, javascript can't read cookie
  },
  resave: false, // ignore it
  saveUninitialized: false, // if true, server would always save the session
}))

server.use('/api/users', usersRouter)
server.use('/api/auth', authRouter)

server.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client', 'index.html'))
})

server.use('*', (req, res, next) => {
  next({ status: 404, message: 'not found!' })
})

server.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  })
})

module.exports = server
