// requires
const bodyparser = require('body-parser')
const express = require('express')
const fs = require('fs')
const helper = require('./htmlhelper.js')
const session = require('express-session')

// consts
const app = express()
const websockServer = require('ws').Server
const server = express().listen(3001, () => console.log(`Web Socket Server started, listening on port 3001`))
const wss = new websockServer({ server })

// ws setup
wss.on('connection', ws => {
    // On connect
    console.log('Client connected')

    int = setInterval(() => {
        ws.send(String(new Date()))
    }, 1000)

    ws.on('close', () => {
        // On connection close
        clearInterval(int)
    })
})

// express setup
app.use('/frontend', express.static(__dirname + '/frontend'));
app.use(session({
    secret: 'NCTUCS-DB-Final',
    maxAge: 600000,
    resave: false,
    saveUninitialized: true
}))
app.use(bodyparser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    if (!req.session.username)
        res.redirect('/login')
    else {
        helper.renderUserMainPage(req.session.username, (err, html) => {
            res.send(html)
        })
    }
})

app.get('/basic', (req, res) => {
    if (!req.session.username)
        res.redirect('/login')
    else
        res.sendFile(__dirname + '/frontend/basic.html')
})

app.get('/advance', (req, res) => {
    if (!req.session.username)
        res.redirect('/login')
    else
        res.sendFile(__dirname + '/frontend/advance.html')
})

app.get('/statistic', (req, res) => {
    if (!req.session.username)
        res.redirect('/login')
    else
        res.sendFile(__dirname + '/frontend/statistic.html')
})

app.get('/job/:jid', (req, res) => {
    if (!req.session.username)
        res.redirect('/login')
    else
        helper.renderJobPageAndThen(req.params.jid, (err, html) => {
            if (err)
                res.sendFile(__dirname + '/frontend/error.html')
            else
                res.send(html)
        })
})

app.get('/comp/:cid', (req, res) => {
    if (!req.session.username)
        res.redirect('/login')
    else
        helper.renderFile(__dirname + '/frontend/comp.html', {
            cid: req.params.cid
        }, (err, html) => {
            res.send(html)
        })
})

app.get('/login', (req, res) => {
    if (req.session.username)
        res.redirect('/')
    else
        helper.renderFile(__dirname + '/frontend/login.html', {
            err: ''
        }, (err, html) => {
            res.send(html)
        })
})

app.get('/register', (req, res) => {
    if (req.session.username)
        res.redirect('/')
    else
        helper.renderFile(__dirname + '/frontend/register.html', {
            err: ''
        }, (err, html) => {
            res.send(html)
        })
})

app.post('/login', (req, res) => {
    username = req.body.username
    passwd = req.body.passwd
    if (helper.isValidUserInfo(username, passwd)) {
        helper.ifUserRegistered(username, helper.getHashedPasswd(passwd), isuser => {
            if (isuser) {
                console.log('Welcome, ' + username)
                req.session.username = username
                res.redirect('/')
            }
            else {
                helper.renderFile(__dirname + '/frontend/login.html', {
                    err: 'Incorrect username/passwd'
                }, (err, html) => {
                    res.send(html)
                })
            }
        })
    }
    else {
        helper.renderFile(__dirname + '/frontend/login.html', {
            err: 'Invalid tokens'
        }, (err, html) => {
            res.send(html)
        })
    }
})

app.post('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/login')
})

app.post('/register', (req, res) => {
    username = req.body.username
    passwd = req.body.passwd
    passwdcheck = req.body.passwdcheck
    if (username.length > 15) {
        helper.renderFile(__dirname + '/frontend/register.html', {
            err: 'Username too long'
        }, (err, html) => {
            res.send(html)
        })
    }
    else if (passwd != passwdcheck) {
        helper.renderFile(__dirname + '/frontend/register.html', {
            err: 'The passwords are inconsistent'
        }, (err, html) => {
            res.send(html)
        })
    }
    else if (helper.isValidUserInfo(username, passwd)) {
        helper.ifHasUser(username, hasuser => {
            if (hasuser) {
                helper.renderFile(__dirname + '/frontend/register.html', {
                    err: 'Username already exists'
                }, (err, html) => {
                    res.send(html)
                })
            }
            else {
                helper.registerNewUser(username, helper.getHashedPasswd(passwd))
                console.log('Welcome new user, ' + username)
                req.session.username = username
                res.redirect('/')
            }
        })
    }
    else {
        helper.renderFile(__dirname + '/frontend/register.html', {
            err: 'Invalid tokens'
        }, (err, html) => {
            res.send(html)
        })
    }
})

app.post('/delfav', (req, res) => {
    username = req.session.username
    jid = req.body.jid
    helper.removeFavFromUser(username, jid)
    res.redirect('/')
})

app.listen(3000, () => {
    console.log("Server Started, Listening on port 3000")
})