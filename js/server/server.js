// noinspection DuplicatedCode

import {WebSocketServer} from 'ws';

const wss = new WebSocketServer({port: 8080});

let servers = {};

wss.on('connection', ws => {
    ws.on('message', data => {
        data = JSON.parse(data);
        console.log(data);
        if (data.type === "log") {
            console.log(data.value);
        } else if (data.type === "newServer") {
            servers[data.id] = {
                items: [],
                player: {money: 100, recentTransactions: [], popularity: 1, skill: 1, totalEarnings: 100},
                orders: [],
                chat: []
            };
        } else if (data.type === "itemUpdate") {
            servers[data.id].items = data.data;
            wss.broadcast(JSON.stringify(data));
        } else if (data.type === "playerUpdate") {
            servers[data.id].player = data.data;
            wss.broadcast(JSON.stringify(data));
        } else if (data.type === "orderUpdate") {
            servers[data.id].orders = data.data;
            wss.broadcast(JSON.stringify(data));
        } else if (data.type === "newUser") {
            console.log(servers[data.id]);
            if (servers[data.id] === undefined) {
                wss.broadcast(JSON.stringify({type: "missingServer", id: data.id}));
            }
            wss.broadcast(JSON.stringify({type: "itemUpdate", id: data.id, data: servers[data.id].items}));
            wss.broadcast(JSON.stringify({type: "playerUpdate", id: data.id, data: servers[data.id].player}));
            wss.broadcast(JSON.stringify({type: "orderUpdate", id: data.id, data: servers[data.id].orders}));
        } else if (data.type === "chat") {
            servers[data.id].chat.push(data.message);
            wss.broadcast(JSON.stringify({type: "chat", id: data.id, message: data.message}));
        }
    });
});

wss.broadcast = msg => {
    console.log(msg);
    wss.clients.forEach(client => {
        client.send(msg);
    });
};