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
    renderString: function (str, params) {
        for (key in params) {
            if (params[key])
                str = str.split('${' + key + '}').join(params[key]);
            else
                str = str.split('${' + key + '}').join('');
        }
        return str
    },
    renderFile: function (filename, params, callback) {
        this.readFile(filename, (err, html) => {
            if (err)
                return callback(err)
            callback(null, this.renderString(html, params))
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
    ifUserRegistered: function (username, passwd, callback) {
        db.query(this.renderString(this.query_strings.validateUserPassword, { 'username': username, 'passwd': passwd }), (err, res, fields) => {
            if (err)
                return callback(false)
            callback(res.length > 0)
        })
    },
    ifHasUser: function (username, callback) {
        db.query(this.renderString(this.query_strings.userExist, { 'username': username }), (err, res, fields) => {
            if (err)
                return callback(false)
            callback(res.length > 0)
        })
    },
    registerNewUser: function (username, passwd) {
        db.query(this.renderString(this.query_strings.newUser, { 'username': username, 'passwd': passwd }), (err, res, fields) => { })
    },
    renderUserMainPage: function (username, callback) {
        this.readFile(__dirname + '/frontend/index.html', (err, html) => {
            if (err)
                return callback(err)
            this.readFile(__dirname + '/frontend/component/job-block.html', (err, component) => {
                if (err)
                    return callback(err)
                db.query(this.renderString(this.query_strings.getUserFavInfo, { 'username': username }), (err, res, fields) => {
                    if (err)
                        return callback(err)
                    if (res.length <= 5) {
                        fav = ''
                        for (row in res) {
                            fav += this.renderString(component, {
                                'job_name': res[row].job_name,
                                'pos_field': res[row].pos_field,
                                'pos_name': res[row].pos_name,
                                'lo_sal': res[row].low_salary,
                                'hi_sal': res[row].high_salary,
                                'area_cctd': res[row].area_cctd_name,
                                'job_id': res[row].job_id
                            })
                        }
                        this.readFile(__dirname + '/frontend/component/job-block-suggest.html', (err, component2) => {
                            if (err)
                                return callback(err)
                            db.query(this.renderString(this.query_strings.suggestion, { 'username': username }), (err, res, fields) => {
                                sug = ''
                                for (row in res) {
                                    sug += this.renderString(component2, {
                                        'job_name': res[row].job_name,
                                        'pos_field': res[row].pos_field,
                                        'pos_name': res[row].pos_name,
                                        'lo_sal': res[row].low_salary,
                                        'hi_sal': res[row].high_salary,
                                        'area_cctd': res[row].area_cctd_name
                                    })
                                }
                                callback(null, this.renderString(html, { 'query-fav': fav, 'query-fav-detail': '', 'toggle-block_none': 'none', 'query-suggest': sug }))
                            })
                        })
                    }
                    else {
                        fav = ''
                        fav_detail = ''
                        for (row = 0; row < 4; row++) {
                            fav += this.renderString(component, {
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
                            fav_detail += this.renderString(component, {
                                'job_name': res[row].job_name,
                                'pos_field': res[row].pos_field,
                                'pos_name': res[row].pos_name,
                                'lo_sal': res[row].low_salary,
                                'hi_sal': res[row].high_salary,
                                'area_cctd': res[row].area_cctd_name,
                                'job_id': res[row].job_id
                            })
                        }
                        this.readFile(__dirname + '/frontend/component/job-block-suggest.html', (err, component2) => {
                            if (err)
                                return callback(err)
                            db.query(this.renderString(this.query_strings.suggestion, { 'username': username }), (err, res, fields) => {
                                sug = ''
                                for (row in res) {
                                    sug += this.renderString(component2, {
                                        'job_name': res[row].job_name,
                                        'pos_field': res[row].pos_field,
                                        'pos_name': res[row].pos_name,
                                        'lo_sal': res[row].low_salary,
                                        'hi_sal': res[row].high_salary,
                                        'area_cctd': res[row].area_cctd_name
                                    })
                                }
                                callback(null, this.renderString(html, { 'query-fav': fav, 'query-fav-detail': fav_detail, 'toggle-block_none': 'block', 'query-suggest': sug }))
                            })
                        })
                    }
                })
            })
        })
    },
    removeFavFromUser: function (username, jid) {
        db.query('DELETE FROM favorite WHERE username = "' + username + '" AND job_id = "' + jid + '";')
    }
    ,
    query_strings: {
        getUserFavInfo: 'SELECT t.job_id, t.job_name, t.low_salary, t.high_salary, t.area_cctd_name, p.pos_field, p.pos_name FROM ( SELECT t.job_id, t.job_name, t.low_salary, t.high_salary, l.area_cctd_name, t.pos_id FROM ( SELECT t.job_id, j.job_name, j.low_salary, j.high_salary, t.area_id, t.pos_id FROM ( SELECT j.job_id, j.area_id, j.pos_id FROM job j, favorite f WHERE f.username = "${username}" AND j.job_id = f.job_id) AS t, jobinfo j WHERE j.job_id = t.job_id ) AS t, localarea AS l WHERE t.area_id = l.area_id ) AS t, position p WHERE t.pos_id = p.pos_id;',
        validateUserPassword: 'SELECT * FROM user WHERE username = "${username}" AND passwd = "${passwd}";',
        userExist: 'SELECT * FROM user WHERE username = "${username}";',
        newUser: 'INSERT INTO user (username, passwd) VALUES ("${username}", "${passwd}");',
        suggestion: 'SELECT t.job_id, t.job_name, t.low_salary, t.high_salary, t.area_cctd_name, p.pos_field, p.pos_name FROM ( SELECT t.job_id, t.job_name, t.low_salary, t.high_salary, l.area_cctd_name, t.pos_id FROM ( SELECT t.job_id, j.job_name, j.low_salary, j.high_salary, t.area_id, t.pos_id FROM (SELECT j.job_id, j.area_id, j.pos_id FROM job j WHERE j.pos_id IN (SELECT pos_id FROM (SELECT p.pos_id, COUNT(*) AS cnt FROM favorite f, job j, position p WHERE f.username = "${username}" AND f.job_id = j.job_id AND j.pos_id = p.pos_id GROUP BY p.pos_id ORDER BY cnt DESC LIMIT 3) AS t) AND j.job_id NOT IN (SELECT j.job_id FROM favorite f, job j WHERE f.username = "${username}" AND f.job_id = j.job_id) ORDER BY RAND() LIMIT 10) AS t, jobinfo j WHERE j.job_id = t.job_id ) AS t, localarea AS l WHERE t.area_id = l.area_id ) AS t, position p WHERE t.pos_id = p.pos_id;'
    }
}
