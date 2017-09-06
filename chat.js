let clients = [];

exports.subscribe = (req, res) => {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    clients.push(res);

    res.on('close', () => {
        clients.splice(clients.indexOf(res), 1);
    });

    res.on('end', () => {
        clients.splice(clients.indexOf(res), 1);
    });
};

exports.publish = (message) => {
    clients.forEach((res) => {
        res.send(message);
    });

    clients = [];
};