import io from 'socket.io-client'
export function CONNECTWS(){
    return io('http://localhost:4600')
}