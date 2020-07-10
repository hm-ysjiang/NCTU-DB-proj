// requires
const express = require('express')
const fs = require('fs')

// consts
const app = express()
const websockServer = require('ws').Server
const server = express().listen(3001, () => console.log(`Web Socket Server started, listening on port 3001`))
const wss = new websockServer({ server })

// helpers
function render(filename, params, callback) {
    fs.readFile(filename, 'utf8', (err, data) => {
        if (err)
            return callback(err);
        for (key in params) {
            data = data.replace('{$' + key + '}', params[key]);
        }
        callback(null, data);
    });
}

// ws setup
wss.on('connection', ws => {
    // On connect
    console.log('Client connected')

    ws.on('close', () => {
        // On connection close
    })
})

// express setup
app.use(express.static(__dirname + '/frontend'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/frontend/index.html')
})

app.get('/job/:jid', (req, res) => {
    render(__dirname + '/frontend/job.html', {
        jid: req.params.jid
    }, (err, html) => {
        res.send(html)
    })
})

app.get('/comp/:cid', (req, res) => {
    render(__dirname + '/frontend/comp.html', {
        cid: req.params.cid
    }, (err, html) => {
        res.send(html)
    })
})

app.listen(3000, () => {
    console.log("Server Started, Listening on port 3000")
})