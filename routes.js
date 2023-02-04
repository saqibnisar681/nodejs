const fs = require('fs');

const requestHandler = (req, res) => {

    const url = req.url;
    const method = req.method;
    if (url === '/') {
        res.write('<html><body>');
        res.write('<form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form>');
        res.write('</body></html>');
        return res.end();
    }
    if (url === "/message" && method == "POST") {
        const body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        });
        return req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split('=')[1];
            fs.writeFile('message.txt', message, err => {
                res.statusCode = 302;
                res.setHeader('Location', '/');
                return res.end();
            });
        });
    }
    res.write('<p>'.concat(req.url).concat('</p>'));
    res.end();
}

module.exports = {
    handler: requestHandler
};