let ws = new WebSocket('ws://localhost:3001')

ws.onopen = () => {
    console.log('Connected')
}

ws.onclose = () => {
    console.log('Connection Closed')
}

ws.onmessage = evt => {
    data = JSON.parse(evt.data)
}
