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
        str = str.toString()
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
                                'salary': this.castSalaryString(res[row].low_salary, res[row].high_salary),
                                'area_cctd': res[row].area_cctd_name,
                                'job_id': res[row].job_id
                            })
                        }
                        this.readFile(__dirname + '/frontend/component/job-block-suggest.html', (err, component2) => {
                            if (err)
                                return callback(err)
                            db.query(this.renderString(this.query_strings.suggestionMain, { 'username': username }), (err, res, fields) => {
                                sug = ''
                                for (row in res) {
                                    sug += this.renderString(component2, {
                                        'job_name': res[row].job_name,
                                        'pos_field': res[row].pos_field,
                                        'pos_name': res[row].pos_name,
                                        'salary': this.castSalaryString(res[row].low_salary, res[row].high_salary),
                                        'area_cctd': res[row].area_cctd_name,
                                        'job_id': res[row].job_id
                                    })
                                }
                                callback(null, this.renderString(html, { 'query-fav': fav, 'query-fav-detail': '', 'toggle-block_none': 'none', 'query-suggest': sug }))
                            })
                        })
                    }
                    else {
                        fav = ''
                        fav_detail = ''
                        for (row = 0; row < 5; row++) {
                            fav += this.renderString(component, {
                                'job_name': res[row].job_name,
                                'pos_field': res[row].pos_field,
                                'pos_name': res[row].pos_name,
                                'salary': this.castSalaryString(res[row].low_salary, res[row].high_salary),
                                'area_cctd': res[row].area_cctd_name,
                                'job_id': res[row].job_id
                            })
                        }
                        for (row = 5; row < res.length; row++) {
                            fav_detail += this.renderString(component, {
                                'job_name': res[row].job_name,
                                'pos_field': res[row].pos_field,
                                'pos_name': res[row].pos_name,
                                'salary': this.castSalaryString(res[row].low_salary, res[row].high_salary),
                                'area_cctd': res[row].area_cctd_name,
                                'job_id': res[row].job_id
                            })
                        }
                        this.readFile(__dirname + '/frontend/component/job-block-suggest.html', (err, component2) => {
                            if (err)
                                return callback(err)
                            db.query(this.renderString(this.query_strings.suggestionMain, { 'username': username }), (err, res, fields) => {
                                sug = ''
                                for (row in res) {
                                    sug += this.renderString(component2, {
                                        'job_name': res[row].job_name,
                                        'pos_field': res[row].pos_field,
                                        'pos_name': res[row].pos_name,
                                        'salary': this.castSalaryString(res[row].low_salary, res[row].high_salary),
                                        'area_cctd': res[row].area_cctd_name,
                                        'job_id': res[row].job_id
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
    renderJobPage: function (job_id, callback) {
        fs.readFile(__dirname + '/frontend/job.html', 'utf-8', (fs_err, cont) => {
            if (fs_err)
                return callback(fs_err)
            db.query(this.renderString(this.query_strings.singleJob, { 'job_id': job_id }), (mysql_err, res, fields) => {
                if (mysql_err)
                    return callback(mysql_err)
                if (res.length == 0)
                    return callback('Empty Query Result')
                html = this.renderString(cont, {
                    'job_id': res[0].job_id,
                    'job_name': res[0].job_name,
                    'com_id': res[0].com_id,
                    'com_name': res[0].com_name,
                    'needed_num': res[0].needed_num,
                    'salary_unit': (res[0].job_type ? '時' : '月'),
                    'salary': this.castSalaryString(res[0].low_salary, res[0].high_salary),
                    'job_type': (res[0].job_type ? '工讀' : '全職'),
                    'is_night': (res[0].is_night == 1 ? '日班' : res[0].is_night == 2 ? '夜班' : '日 / 夜班'),
                    'worktime': res[0].worktime,
                    'pos_field': res[0].pos_field,
                    'pos_name': res[0].pos_name,
                    'area_cctd_name': res[0].area_cctd_name,
                    'degree': this.degree_table[res[0].degree],
                    'exp_year': res[0].exp_year ? res[0].exp_year.toString() + '年' : '不拘'
                })
                job_id = res[0].job_id
                com_id = res[0].com_id
                pos_id = res[0].pos_id
                area_id = res[0].area_id
                lo_sal = res[0].low_salary
                hi_sal = res[0].high_salary
                db.query(this.renderString(this.query_strings.isInUserFav, { 'username': username, 'job_id': job_id }), (err, res, fields) => {
                    if (err)
                        return callback(err)
                    faved = res.length > 0
                    html = this.renderString(html, { 'action': (faved ? 'delfav' : 'addfav'), 'action_desc': (faved ? '移除' : '加入') })
                    fs.readFile(__dirname + '/frontend/component/job-block-suggest.html', (err, component) => {
                        if (err)
                            return callback(err)
                        db.query(this.renderString(this.query_strings.suggestionComp, { 'job_id': job_id, 'com_id': com_id }), (err, res, fields) => {
                            if (err)
                                return callback(err)
                            sug_comp = ''
                            for (row in res) {
                                sug_comp += this.renderString(component, {
                                    'job_name': res[row].job_name,
                                    'pos_field': res[row].pos_field,
                                    'pos_name': res[row].pos_name,
                                    'salary': this.castSalaryString(res[row].low_salary, res[row].high_salary),
                                    'area_cctd': res[row].area_cctd_name,
                                    'job_id': res[row].job_id
                                })
                            }
                            html = this.renderString(html, { 'suggest-comp': sug_comp, 'suggest-comp-show': (res.length > 0 ? 'block' : 'none') })
                            db.query(this.renderString(this.query_strings.suggestionPos, { 'job_id': job_id, 'pos_id': pos_id }), (err, res, fields) => {
                                if (err)
                                    return callback(err)
                                sug_pos = ''
                                for (row in res) {
                                    sug_pos += this.renderString(component, {
                                        'job_name': res[row].job_name,
                                        'pos_field': res[row].pos_field,
                                        'pos_name': res[row].pos_name,
                                        'salary': this.castSalaryString(res[row].low_salary, res[row].high_salary),
                                        'area_cctd': res[row].area_cctd_name,
                                        'job_id': res[row].job_id
                                    })
                                }
                                html = this.renderString(html, { 'suggest-pos': sug_pos, 'suggest-pos-show': (res.length > 0 ? 'block' : 'none') })
                                db.query(this.renderString(this.query_strings.suggestionArea, { 'job_id': job_id, 'area_id': area_id }), (err, res, fields) => {
                                    if (err)
                                        return callback(err)
                                    sug_area = ''
                                    for (row in res) {
                                        sug_area += this.renderString(component, {
                                            'job_name': res[row].job_name,
                                            'pos_field': res[row].pos_field,
                                            'pos_name': res[row].pos_name,
                                            'salary': this.castSalaryString(res[row].low_salary, res[row].high_salary),
                                            'area_cctd': res[row].area_cctd_name,
                                            'job_id': res[row].job_id
                                        })
                                    }
                                    html = this.renderString(html, { 'suggest-area': sug_area, 'suggest-area-show': (res.length > 0 ? 'block' : 'none') })

                                    callback(null, html)
                                })
                            })
                        })
                    })
                })
            })
        })
    },
    renderComPage: function (com_id, callback) {
        fs.readFile(__dirname + '/frontend/comp.html', 'utf-8', (fs_err, cont) => {
            if (fs_err)
                return callback(fs_err)
            db.query(this.renderString(this.query_strings.compInfo, { 'com_id': com_id }), (mysql_err, res, fields) => {
                if (mysql_err)
                    return callback(mysql_err)
                if (res.length == 0)
                    return callback('Empty Query Result')
                html = this.renderString(cont, {
                    'com_id': res[0].com_id,
                    'com_name': res[0].com_name,
                    'com_addr': res[0].addr,
                    'com_emp': (res[0].emp_number ? res[0].emp_number : ''),
                    'com_emp-show': (res[0].emp_number ? 'block' : 'none')
                })
                fs.readFile(__dirname + '/frontend/component/job-block-suggest.html', (err, component) => {
                    if (err)
                        callback(err)
                    db.query(this.renderString(this.query_strings.compJobs, { 'com_id': com_id }), (err, res, fields) => {
                        if (err)
                            callback(err)
                        jobs = ''
                        for (row in res) {
                            jobs += this.renderString(component, {
                                'job_name': res[row].job_name,
                                'pos_field': res[row].pos_field,
                                'pos_name': res[row].pos_name,
                                'salary': this.castSalaryString(res[row].low_salary, res[row].high_salary),
                                'area_cctd': res[row].area_cctd_name,
                                'job_id': res[row].job_id
                            })
                        }
                        callback(null, this.renderString(html, { 'com_job': jobs, 'com_job-show': (res.length > 0) }))
                    })
                })
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
    addFavToUser: function (username, jid) {
        db.query(this.renderString(this.query_strings.isInUserFav, { 'username': username, 'job_id': jid }), (err, res, fields) => {
            if (err)
                return callback(err)
            if (res.length == 0)
                db.query(this.renderString(this.query_strings.favAdd, { 'username': username, 'job_id': jid }))
        })
    },
    removeFavFromUser: function (username, jid) {
        db.query(this.renderString(this.query_strings.favDel, { 'username': username, 'job_id': jid }))
    },
    castSalaryString: function (lo, hi) {
        return (lo == hi ? lo : '' + (lo ? lo : '') + ' ~ ' + (hi ? hi : ''))
    }
    ,
    query_strings: {
        getUserFavInfo: 'SELECT t.job_id, t.job_name, t.low_salary, t.high_salary, t.area_cctd_name, p.pos_field, p.pos_name FROM ( SELECT t.job_id, t.job_name, t.low_salary, t.high_salary, l.area_cctd_name, t.pos_id FROM ( SELECT t.job_id, j.job_name, j.low_salary, j.high_salary, t.area_id, t.pos_id FROM ( SELECT j.job_id, j.area_id, j.pos_id FROM job j, favorite f WHERE f.username = "${username}" AND j.job_id = f.job_id) AS t, jobinfo j WHERE j.job_id = t.job_id ) AS t, localarea AS l WHERE t.area_id = l.area_id ) AS t, position p WHERE t.pos_id = p.pos_id;',
        validateUserPassword: 'SELECT * FROM user WHERE username = "${username}" AND passwd = "${passwd}";',
        userExist: 'SELECT * FROM user WHERE username = "${username}";',
        newUser: 'INSERT INTO user (username, passwd) VALUES ("${username}", "${passwd}");',
        suggestionMain: 'SELECT t.job_id, t.job_name, t.low_salary, t.high_salary, t.area_cctd_name, p.pos_field, p.pos_name FROM ( SELECT t.job_id, t.job_name, t.low_salary, t.high_salary, l.area_cctd_name, t.pos_id FROM ( SELECT t.job_id, j.job_name, j.low_salary, j.high_salary, t.area_id, t.pos_id FROM (SELECT j.job_id, j.area_id, j.pos_id FROM job j WHERE j.pos_id IN (SELECT pos_id FROM (SELECT p.pos_id, COUNT(*) AS cnt FROM favorite f, job j, position p WHERE f.username = "${username}" AND f.job_id = j.job_id AND j.pos_id = p.pos_id GROUP BY p.pos_id ORDER BY cnt DESC LIMIT 3) AS t) AND j.job_id NOT IN (SELECT j.job_id FROM favorite f, job j WHERE f.username = "${username}" AND f.job_id = j.job_id) ORDER BY RAND() LIMIT 10) AS t, jobinfo j WHERE j.job_id = t.job_id ) AS t, localarea AS l WHERE t.area_id = l.area_id ) AS t, position p WHERE t.pos_id = p.pos_id;',
        singleJob: 'SELECT j.job_id, j.job_name, j.degree, j.low_salary, j.high_salary, j.exp_year, j.job_type, j.worktime, j.is_night, j.needed_num, l.area_id, l.area_cctd_name, p.pos_id, p.pos_field, p.pos_name, c.com_id, c.com_name FROM job, jobinfo j, localarea l, position p, company c WHERE job.job_id = j.job_id AND job.area_id = l.area_id AND job.pos_id = p.pos_id AND job.com_id = c.com_id AND job.job_id = ${job_id};',
        isInUserFav: 'SELECT * FROM favorite f WHERE f.username = "${username}" AND f.job_id = ${job_id};',
        favAdd: 'INSERT INTO favorite (username, job_id) VALUES ("${username}", ${job_id});',
        favDel: 'DELETE FROM favorite WHERE username = "${username}" AND job_id = "${job_id}";',
        suggestionComp: 'SELECT t.job_id, t.job_name, t.low_salary, t.high_salary, t.area_cctd_name, p.pos_field, p.pos_name FROM (SELECT t.job_id, t.job_name, t.low_salary, t.high_salary, l.area_cctd_name, t.pos_id FROM (SELECT t.job_id, j.job_name, j.low_salary, j.high_salary, t.area_id, t.pos_id FROM (SELECT * FROM job WHERE com_id = ${com_id} AND job_id != ${job_id}) AS t, jobinfo j WHERE j.job_id = t.job_id) AS t, localarea AS l WHERE t.area_id = l.area_id) AS t, position p WHERE t.pos_id = p.pos_id ORDER BY RAND() LIMIT 5;',
        suggestionPos: 'SELECT t.job_id, t.job_name, t.low_salary, t.high_salary, t.area_cctd_name, p.pos_field, p.pos_name FROM (SELECT t.job_id, t.job_name, t.low_salary, t.high_salary, l.area_cctd_name, t.pos_id FROM (SELECT t.job_id, j.job_name, j.low_salary, j.high_salary, t.area_id, t.pos_id FROM (SELECT * FROM job WHERE pos_id = ${pos_id} AND job_id != ${job_id}) AS t, jobinfo j WHERE j.job_id = t.job_id) AS t, localarea AS l WHERE t.area_id = l.area_id) AS t, position p WHERE t.pos_id = p.pos_id ORDER BY RAND() LIMIT 5;',
        suggestionArea: 'SELECT t.job_id, t.job_name, t.low_salary, t.high_salary, t.area_cctd_name, p.pos_field, p.pos_name FROM (SELECT t.job_id, t.job_name, t.low_salary, t.high_salary, l.area_cctd_name, t.pos_id FROM (SELECT t.job_id, j.job_name, j.low_salary, j.high_salary, t.area_id, t.pos_id FROM (SELECT * FROM job WHERE area_id = ${area_id} AND job_id != ${job_id}) AS t, jobinfo j WHERE j.job_id = t.job_id) AS t, localarea AS l WHERE t.area_id = l.area_id) AS t, position p WHERE t.pos_id = p.pos_id ORDER BY RAND() LIMIT 5;',
        compInfo: 'select * from company where com_id = ${com_id};',
        compJobs: 'SELECT t.job_id, t.job_name, t.low_salary, t.high_salary, t.area_cctd_name, p.pos_field, p.pos_name FROM (SELECT t.job_id, t.job_name, t.low_salary, t.high_salary, l.area_cctd_name, t.pos_id FROM (SELECT t.job_id, j.job_name, j.low_salary, j.high_salary, t.area_id, t.pos_id FROM (SELECT * FROM job WHERE com_id = ${com_id}) AS t, jobinfo j WHERE j.job_id = t.job_id) AS t, localarea AS l WHERE t.area_id = l.area_id) AS t, position p WHERE t.pos_id = p.pos_id;'
    },
    degree_table: ['不拘', '國中', '高中職', '專科', '大學', '碩士', '博士']
}
