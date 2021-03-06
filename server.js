const fs = require('fs');
const chat = require('./chat');
const express = require("express");
const app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));

app.get("/", (req, res) => {
    sendFile("/index.html", res);
});

app.get("/date", (req, res) => {
    let now = timeSendMessage();
    res.send(now);
});

app.post("/subscribe", (req, res) => {
    chat.subscribe(req, res);
});

app.post("/publish", (req, res) => {
    let body = '';

    req.on('readable', () => {
        let content;
        if (null !== (content = req.read()) ) {
            body += content;
        }

        if (body.length > 1e4) {
            res.setHeader("content-type", "text/plain");
            res.status(413);
            res.send("Your message is too big for my little chat");
        }
    })
        .on('end', () => {
            try {
                body = JSON.parse(body);
            } catch (e) {
                res.setHeader("content-type", "text/plain");
                res.status(400);
                res.send("Bad Request");
                return;
            }

            chat.publish(body.message);
            res.setHeader("content-type", "text/plain");
            res.send("ok");
        });
});

// Обробник 404 помилки
app.use((req, res, next) => {
    res.status(404);
    res.type("text/plain");
    res.send("404");
});

// Обробник 505 помилки
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500);
    res.type("text/plain");
    res.send("500");
});

app.listen(app.get('port'), () => {
    console.log( 'Express запущенний на http://localhost:' +
        app.get('port') + '; нажміть Ctrl+C для завершення.' );
});

function timeSendMessage() {
    let now = new Date();
    let day = now.getDate();
    let month = now.getMonth();
    let year = now.getFullYear();
    let hours = now.getHours();
    let minutes = now.getMinutes();

    if(month < 10) {
        month = "0" + month;
    }

    if(minutes < 10) {
        minutes = "0" + minutes;
    }

    return day + "." + month + "." + year + "_" + hours + ":" + minutes;
}

// function sendFile(fileName, res) {
//     let fileStream = fs.createReadStream(fileName);
//     fileStream
//         .on('error', () => {
//             res.setHeader("content-type", "text/plain");
//             res.status(500);
//             res.send("Server error");
//         })
//         .pipe(res)
//         .on('close', () => {
//             fileStream.destroy();
//         });
// }