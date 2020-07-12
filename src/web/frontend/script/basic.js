const ws = new WebSocket('ws://localhost:3001')

ws.onopen = () => { }

ws.onclose = () => {
    console.log('Connection closed by remote server')
}

ws.onmessage = evt => {
    data = JSON.parse(evt.data)
    if (data.ok) {
        loader = document.getElementById('loader')
        resBlock = document.getElementById('search-res')
        resContainer = document.getElementById('search-res-container')
        if (loader.getAttribute('identifier') == data.identifier) {
            loader.style['display'] = 'none'
            resBlock.style['display'] = 'block'
            resContainer.innerHTML = data.result
        }
    }
    else {
        console.log(data)
    }
}

window.onload = () => {
    document.getElementById('search-btn').addEventListener('click', () => {
        search = document.getElementById('search-input').value
        if (search) {
            iden = Math.random().toString(36).substr(2)

            loader = document.getElementById('loader')
            resBlock = document.getElementById('search-res')
            resContainer = document.getElementById('search-res-container')
            loader.setAttribute('identifier', iden)
            loader.style['display'] = 'block'
            resBlock.style['display'] = 'none'
            for (todel = resContainer.children.length - 1; todel >= 0; todel--)
                resContainer.removeChild(resContainer.children[todel])

            ws.send(JSON.stringify({ from: 'basic', data: search, identifier: iden }))
        }
    })
    document.getElementById('search-input').addEventListener('keyup', evt => {
        if (evt.key == 'Enter') {
            search = document.getElementById('search-input').value
            if (search) {
                iden = Math.random().toString(36).substr(2)

                loader = document.getElementById('loader')
                resBlock = document.getElementById('search-res')
                resContainer = document.getElementById('search-res-container')
                loader.setAttribute('identifier', iden)
                loader.style['display'] = 'block'
                resBlock.style['display'] = 'none'
                for (todel = resContainer.children.length - 1; todel >= 0; todel--)
                    resContainer.removeChild(resContainer.children[todel])

                ws.send(JSON.stringify({ from: 'basic', data: search, identifier: iden }))
            }
        }
    })
}
