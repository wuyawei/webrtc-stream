/**
 * Created by wyw on 2018/10/14.
 */
// 导入koa，和koa 1.x不同，在koa2中，我们导入的是一个class，因此用大写的Koa表示:
const Koa = require('koa');
const path = require('path');
const koaSend = require('koa-send');
const static = require('koa-static');
const socket = require('koa-socket');
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
            console.log('value',data);
            app._io.in(data.roomid).emit('joined',data.account);
            sock.emit('en', 'ok');
        });
    });
    sock.on('offer', data=>{
        sock.to(data.roomid).emit('offer',data.sdp);
    });
    sock.on('answer', data=>{
        sock.to(data.roomid).emit('answer',data.sdp);
    });
    sock.on('__ice_candidate', data=>{
        sock.to(data.roomid).emit('__ice_candidate',data.candidate);
    });
});
app.io.on('disconnect', (ctx) => {
    console.log(`disconnect id =>${ctx.socket.id}`);
});

// 在端口3001监听:
let port = 3001;
app.listen(port, _ => {
    console.log('app started at port ...' + port);
});
// https.createServer(app.callback()).listen(3001);