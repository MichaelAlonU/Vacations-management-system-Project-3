import { Server } from "socket.io";
import config from 'config'

const server = new Server({
    cors: {
        origin: '*'
    }
})

server.on('connection', socket => {
    console.log('client connected...')

    socket.on('vacation-like', (payload: any) => {
        server.emit('vacation-like', payload); 
    });
    
    socket.on('disconnect', () => console.log('client disconnected...'))
})

server.listen(config.get('port'))
console.log(`io server started on port ${config.get('port')}`)