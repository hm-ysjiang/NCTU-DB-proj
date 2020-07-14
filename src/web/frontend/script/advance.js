const ws = new WebSocket('ws://localhost:3001')

ws.onopen = () => { }

ws.onclose = () => {
    console.log('Connection closed by remote server')
}

ws.onmessage = evt => {
    data = JSON.parse(evt.data)
    if (data.ok) {
        switch (data.content) {
            case 'mainresult':
                loader = document.getElementById('loader')
                resBlock = document.getElementById('search-res')
                resContainer = document.getElementById('search-res-container')
                dataCount = document.getElementById('data-count')
                timeElapsed = document.getElementById('time-elapsed')
                if (loader.getAttribute('identifier') == data.identifier) {
                    loader.style['display'] = 'none'
                    resBlock.style['display'] = 'block'
                    resContainer.innerHTML = data.result
                    dataCount.textContent = data.count
                    timeElapsed.textContent = parseInt(new Date().getTime() - data.time) / 1000
                }
                break
            default:
                if (document.getElementById('loader').getAttribute('identifier') == data.identifier) {
                    cont = data.content
                    if (cont == 'area') {
                        cctd_result = JSON.parse(data.result)
                        document.getElementById('area-max-running').style['display'] = 'none'
                        document.getElementById('area-max').style['display'] = 'block'
                        document.getElementById('area-cc-max').textContent = cctd_result.cc
                        document.getElementById('area-cctd-max').textContent = cctd_result.cctd
                    }
                    else {
                        document.getElementById(cont + '-running').style['display'] = 'none'
                        document.getElementById(cont).style['display'] = 'block'
                        document.getElementById(cont + '-text').textContent = data.result.toFixed(4)
                    }
                }
        }
    }
    else {
        console.log(data)
    }
}

runSearch = () => {
    search = document.getElementById('search-input').value
    document.getElementById('search-input').className = 'form-control form-control-lg'
    iden = Math.random().toString(36).substr(2)

    loader = document.getElementById('loader')
    resBlock = document.getElementById('search-res')
    resContainer = document.getElementById('search-res-container')

    pos_field = document.getElementById('pos-field').value
    pos_name = ''
    pos_names = document.getElementsByClassName('pos-name')
    for (i = 0; i < pos_names.length; i++)
        if (pos_names[i].style['display'] == 'block') {
            pos_name = pos_names[i].value
            break
        }
    if (pos_field == '不拘')
        pos_field = ''
    if (pos_name == '不拘')
        pos_name = ''

    area_cc = document.getElementById('area-cc').value
    area_td = ''
    areas = document.getElementsByClassName('area-td')
    for (i = 0; i < areas.length; i++)
        if (areas[i].style['display'] == 'block') {
            area_td = areas[i].value
            break
        }
    if (area_cc == '不拘')
        area_cc = ''
    if (area_td == '不拘')
        area_td = ''

    job_type = document.getElementById('job-type').value.substr(0, 2)
    salary = document.getElementById('salary').value
    if (!salary || !salary.match("^[0-9]+$")) {
        salary = 'NULL'
        document.getElementById('salary').value = ''
    }

    degree = document.getElementById('degree').value
    exp_year = document.getElementById('exp-year').value
    night = document.getElementById('night').value
    worktime = document.getElementById('worktime').value
    if (!exp_year || !exp_year.match("^[0-9]+$")) {
        exp_year = '0'
        document.getElementById('exp-year').value = '0'
    }
    if (!worktime || !worktime.match("^[0-9]+$")) {
        worktime = '0'
        document.getElementById('worktime').value = ''
    }

    loader.setAttribute('identifier', iden)
    loader.style['display'] = 'block'
    resBlock.style['display'] = 'none'
    resContainer.innerHTML = ''

    statistics = document.getElementsByClassName('statistic')
    statistics_loading = document.getElementsByClassName('statistic-loading')
    for (i = 0; i < statistics.length; i++)
        statistics[i].style['display'] = 'none'
    for (i = 0; i < statistics.length; i++)
        statistics_loading[i].style['display'] = 'block'
    document.getElementById('salary-avg-text').textContent = ''
    document.getElementById('salary-max-text').textContent = ''
    document.getElementById('salary-min-text').textContent = ''
    document.getElementById('exp-avg-text').textContent = ''
    document.getElementById('worktime-avg-text').textContent = ''
    document.getElementById('area-cc-max').textContent = ''
    document.getElementById('area-cctd-max').textContent = ''

    data = {
        from: 'advance',
        search: search,
        identifier: iden,
        pos_field: pos_field,
        pos_name: pos_name,
        area_cc: area_cc,
        area_td: area_td,
        job_type: job_type,
        salary: salary,
        degree: degree,
        exp_year: exp_year,
        is_night: night,
        worktime: worktime,
        time: new Date().getTime()
    }
    console.log(data)
    ws.send(JSON.stringify(data))
}

window.onload = () => {
    document.getElementById('search-btn').addEventListener('click', () => {
        runSearch()
    })
    document.getElementById('search-input').addEventListener('keyup', evt => {
        if (evt.key == 'Enter') {
            runSearch()
        }
    })

    pos_fields = document.getElementById('pos-field')
    pos_fields.onchange = () => {
        opt = pos_fields.children[pos_fields.selectedIndex]
        if (opt.id) {
            pos_names = document.getElementsByClassName('pos-name')
            for (chd = 0; chd < pos_names.length; chd++) {
                pos_names[chd].style['display'] = 'none';
            }
            document.getElementById('pos-name-container').style['display'] = 'none'
        }
        else {
            document.getElementById('pos-name-container').style['display'] = 'inline-flex'
            pos_names = document.getElementsByClassName('pos-name')
            for (chd = 0; chd < pos_names.length; chd++) {
                pos_names[chd].style['display'] = 'none';
            }
            document.getElementById(opt.getAttribute('for')).style['display'] = 'block'
        }
    }

    area_ccs = document.getElementById('area-cc')
    area_ccs.onchange = () => {
        console.log(area_ccs)
        opt = area_ccs.children[area_ccs.selectedIndex]
        if (opt.id) {
            areas = document.getElementsByClassName('area-td')
            for (chd = 0; chd < areas.length; chd++) {
                areas[chd].style['display'] = 'none';
            }
            document.getElementById('area-container').style['display'] = 'none'
        }
        else {
            document.getElementById('area-container').style['display'] = 'inline-flex'
            areas = document.getElementsByClassName('area-td')
            for (chd = 0; chd < areas.length; chd++) {
                areas[chd].style['display'] = 'none';
            }
            document.getElementById(opt.getAttribute('for')).style['display'] = 'block'
        }
    }
}
