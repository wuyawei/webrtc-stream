
import io from 'socket.io-client';
// let host = location.origin;
const socket = io.connect('localhost:3001');
export default socket;