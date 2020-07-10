const crypto = require('crypto')
const fs = require('fs')
const mysql = require('mysql')

const db = mysql.createConnection({
    host: 'localhost',
    user: 'db_final_user',
    password: 'cs2020db',
    database: 'db_final'
})
db.connect()

module.exports = {
    render: function (filename, params, callback) {
        fs.readFile(filename, 'utf8', (err, data) => {
            if (err)
                return callback(err);
            for (key in params) {
                data = data.replace('{$' + key + '}', params[key]);
            }
            callback(null, data);
        })
    },
    renderJobPageAndThen: function (jid, callback) {
        console.log(jid)
        fs.readFile(__dirname + '/frontend/job.html', 'utf-8', (fs_err, cont) => {
            if (fs_err)
                return callback(fs_err)
            db.query('select * from jobinfo where job_id = ' + jid + ';', (mysql_err, res, fields) => {
                if (mysql_err)
                    return callback(mysql_err)
                console.log(res)
                if (res.length == 0)
                    return callback('Empty Query Result')
                cont = cont.replace('{$jid}', jid);
                callback(null, cont)
            })
        })
    },
    isValidUserInfo: function (username, passwd) {
        if (username.length > 15)
            return false
        return username.match("^[A-Za-z0-9]+$") && passwd.match("^[A-Za-z0-9]+$")
    },
    getHashedPasswd: function (passwd) {
        return crypto.createHash('sha256').update(passwd).digest('hex')
    },
    ifIsRegisteredUser: function (username, passwd, callback) {
        db.query('SELECT * FROM user WHERE username = "' + username + '" AND passwd = "' + passwd + '";', (err, res, fields) => {
            if (err)
                return callback(false)
            callback(res.length > 0)
        })
    },
    ifHasUser: function (username, callback) {
        db.query('SELECT * FROM user WHERE username = "' + username + '";', (err, res, fields) => {
            if (err)
                return callback(false)
            callback(res.length > 0)
        })
    },
    registerNewUser: function (username, passwd) {
        db.query('INSERT INTO user (username, passwd) VALUES ("' + username + '", "' + passwd + '");', (err, res, fields) => { })
    }
}
