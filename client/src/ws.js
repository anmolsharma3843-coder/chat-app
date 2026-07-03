import io from 'socket.io-client'
export function CONNECTWS(){
    return io(import.meta.env.VITE_BASE_URL)
}