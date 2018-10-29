/**
 * Created by wyw on 2018/10/14.
 */
// 导入koa，和koa 1.x不同，在koa2中，我们导入的是一个class，因此用大写的Koa表示:
const Koa = require('koa');
const path = require('path');
const koaSend = require('koa-send');
const static = require('koa-static');
const socket = require('koa-socket');
const users = {};
const io = new socket({
    ioOptions: {
        pingTimeout: 10000,
        pingInterval: 5000,
    }
});

// 创建一个Koa对象表示web app本身:
const app = new Koa();
// socket注入应用
io.attach(app);
app.use(static(
    path.join( __dirname,  './public')
));

// 对于任何请求，app将调用该异步函数处理请求：
app.use(async (ctx, next) => {
    if (!/\./.test(ctx.request.url)) {
        await koaSend(
            ctx,
            'index.html',
            {
                root: path.join(__dirname, './'),
                maxage: 1000 * 60 * 60 * 24 * 7,
                gzip: true,
            } // eslint-disable-line
        );
    } else {
        await next();
    }
});
// io.on('join', ctx=>{ // event data socket.id
// });
app._io.on( 'connection', sock => {
    sock.on('join', data=>{
        sock.join(data.roomid, () => {
            console.log('value',sock.id);
            if (!users[data.roomid]) {
                users[data.roomid] = [];
            }
            let obj = {
                account: data.account,
                id: sock.id
            };
            let arr = users[data.roomid].filter(v => v.account === data.account);
            if (!arr.length) {
                users[data.roomid].push(obj);
            }
            app._io.in(data.roomid).emit('joined', users[data.roomid], data.account, sock.id); // 发给房间内所有人
            // sock.to(data.roomid).emit('joined',data.account);
        });
    });
    sock.on('offer', data=>{
        // console.log('offer', data);
        sock.to(data.roomid).emit('offer',data);
    });
    sock.on('answer', data=>{
        // console.log('answer', data);
        sock.to(data.roomid).emit('answer',data);
    });
    sock.on('__ice_candidate', data=>{
        // console.log('__ice_candidate', data);
        sock.to(data.roomid).emit('__ice_candidate',data);
    });
    sock.on('leave', data => {
        sock.leave(data.roomid, () => {
            console.log(data);
            //users[data.roomid] = users[data.roomid].filter(v => v.account !== data.account);
            sock.to(data.roomid).emit('leaved', users[data.roomid]);
        });
    })
});
app._io.on('disconnect', (sock) => {
    for (let k in users) {
        users[k] = users[k].filter(v => v.id !== sock.id);
    }
    console.log(`disconnect id => ${users}`);
});

// 在端口3001监听:
let port = 3001;
app.listen(port, _ => {
    console.log('app started at port ...' + port);
});
// https.createServer(app.callback()).listen(3001);