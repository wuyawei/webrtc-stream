
import io from 'socket.io-client';
const socket = io.connect('http://192.168.13.28:3001');
export default socket;