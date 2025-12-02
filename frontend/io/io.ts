import io from 'socket.io-client'
import { v4 as uuid } from "uuid";

export const clientId = uuid();
const socket = io(`${import.meta.env.VITE_IO_SERVER_URL}`)

export default socket
