const cluster = require('cluster');
const npmCPUs = require('os').cpus().length;

if (cluster.isMaster) {
    console.log(`마스터 프로세스 아이디: ${process.pid}`);
    for (let i = 0; i < npmCPUs; i+=1) {
        cluster.fork();
    }
    var worker = cluster.fork();

    // 생성한 워커가 보내는 메시지
    worker.on('message', (message) => {
        console.log('-----------------');
        console.log('To. 마스터');
        console.log(`${worker.process.pid} 워커의 메시지: ${message}`);
        console.log('-----------------');
    });

    // 생성한 워커에게 보내는 메시지
    worker.send('마스터가 보내는 메시지');

    // 워커 종료
    cluster.on('exit', (worker, code, signal) => {
        console.log(`${worker.process.pid} 번 종료`);
        console.log('code', code, 'signal', signal);
        cluster.fork(); // 워커 살리기
    });
} else {
    const express = require('express');
    const app = express();
    const http = require('http').createServer(app);
    
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.set('port', process.env.PORT || 8086);

    // app.get('/', test, (req, res) => {
    app.get('/', (req, res) => {
        console.log("get");
        res.send('Hello Cluster!');
        setTimeout(() => {
            // 워커 존재하는지 확인하기 위해 1초마다 강제 종료
            process.exit(1);
        }, 1000);
    })

    // function test(req, res, next) {
    //     console.log("test");
    //     next();
    // }
    
    http.listen(app.get('port'), () => {
        console.log(app.get('port'), 'port on');
    });

    console.log(`${process.pid}번 워커 실행`);
}

if (cluster.isWorker) {
    // 마스터가 보낸 메시지
    process.on('message', (message) => {
        console.log('-----------------');
        console.log('To. 워커');
        console.log(`마스터의 메시지: ${message}`);
        console.log('-----------------');
    });

    // 마스터에게 보내는 메시지
    process.send(`${process.pid} pid를 가진 워커가 보내는 메시지`);
}

// if (cluster.isMaster) {
//     console.log(`마스터 프로세스 아이디: ${process.pid}`);
//     for (let i = 0; i < npmCPUs; i+=1) {
//         cluster.fork();
//     }
//     // 워커 종료
//     cluster.on('exit', (worker, code, signal) => {
//         console.log(`${worker.process.pid} 번 종료`);
//         console.log('code', code, 'signal', signal);
//         cluster.fork();
//     });
// } else {
//     http.createServer((req, res) => {
//         res.writeHead(200, { 
//             'content-Type': 'text/html; charset=utf-8'
//         });
//         res.write('<h1>Hello Node!</h1>');
//         res.end('<p>Hello Cluster!</p>');
//         setTimeout(() => {
//             // 워커 존재하는지 확인하기 위해 1초마다 강제 종료
//             process.exit(1);
//         }, 1000);
//     }).listen(8086);

//     console.log(`${process.pid}번 워커 실행`);
// }