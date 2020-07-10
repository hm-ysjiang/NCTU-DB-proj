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
    readFile: function (filename, callback) {
        fs.readFile(filename, 'utf8', (err, data) => {
            if (err)
                return callback(err);
            callback(null, data);
        })
    },
    render: function (html, params) {
        for (key in params) {
            if (params[key])
                html = html.split('${' + key + '}').join(params[key]);
            else
                html = html.split('${' + key + '}').join('');
        }
        return html
    },
    renderFile: function (filename, params, callback) {
        this.readFile(filename, (err, html) => {
            if (err)
                return callback(err)
            callback(null, this.render(html, params))
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
    },
    renderUserMainPage: function (username, callback) {
        this.readFile(__dirname + '/frontend/index.html', (err, html) => {
            if (err)
                return callback(err)
            db.query('SELECT t.job_id, t.job_name, t.low_salary, t.high_salary, t.area_cctd_name, p.pos_field, p.pos_name FROM ( SELECT t.job_id, t.job_name, t.low_salary, t.high_salary, l.area_cctd_name, t.pos_id FROM ( SELECT t.job_id, j.job_name, j.low_salary, j.high_salary, t.area_id, t.pos_id FROM ( SELECT j.job_id, j.area_id, j.pos_id FROM job j, favorite f WHERE f.username = "' + username + '" AND j.job_id = f.job_id) AS t, jobinfo j WHERE j.job_id = t.job_id ) AS t, localarea AS l WHERE t.area_id = l.area_id ) AS t, position p WHERE t.pos_id = p.pos_id;', (err, res, fields) => {
                if (err)
                    return callback(err)
                this.readFile(__dirname + '/frontend/component/job-block.html', (err, component) => {
                    if (err)
                        return callback(err)
                    if (res.length <= 5) {
                        fav = ''
                        for (row in res) {
                            fav += this.render(component, {
                                'job_name': res[row].job_name,
                                'pos_field': res[row].pos_field,
                                'pos_name': res[row].pos_name,
                                'lo_sal': res[row].low_salary,
                                'hi_sal': res[row].high_salary,
                                'area_cctd': res[row].area_cctd_name,
                                'job_id': res[row].job_id
                            })
                        }
                        callback(null, this.render(html, { 'query-fav': fav, 'query-fav-detail': '', 'toggle-block_none': 'none' }))
                    }
                    else {
                        fav = ''
                        fav_detail = ''
                        for (row = 0; row < 4; row++) {
                            fav += this.render(component, {
                                'job_name': res[row].job_name,
                                'pos_field': res[row].pos_field,
                                'pos_name': res[row].pos_name,
                                'lo_sal': res[row].low_salary,
                                'hi_sal': res[row].high_salary,
                                'area_cctd': res[row].area_cctd_name,
                                'job_id': res[row].job_id
                            })
                        }
                        for (row = 4; row < res.length; row++) {
                            fav_detail += this.render(component, {
                                'job_name': res[row].job_name,
                                'pos_field': res[row].pos_field,
                                'pos_name': res[row].pos_name,
                                'lo_sal': res[row].low_salary,
                                'hi_sal': res[row].high_salary,
                                'area_cctd': res[row].area_cctd_name,
                                'job_id': res[row].job_id
                            })
                        }
                        callback(null, this.render(html, { 'query-fav': fav, 'query-fav-detail': fav_detail, 'toggle-block_none': 'block' }))
                    }
                })
            })
        })
    },
    removeFavFromUser: function (username, jid) {
        db.query('DELETE FROM favorite WHERE username = "' + username + '" AND job_id = "' + jid + '";')
    }
}
