const WebSocket = require('ws');
const http = require('http');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

console.log("WebSocket Server started.");

wss.on('connection', (ws) => {
  console.log('Client connected.');

  setInterval(() => {
    const vehicleData = generateFakeVehicle();
    ws.send(JSON.stringify(vehicleData));
  }, 5000);
});

function generateFakeVehicle() {
  const plates = ['ABC1234', 'XYZ9876', 'DEF5678', 'GHI9012', 'JKL3456', 'MNO7890'];
  const randomPlate = plates[Math.floor(Math.random() * plates.length)];
  const age = Math.floor(Math.random() * 15) + 1;
  const status = Math.random() > 0.5 ? 'Allowed' : 'Denied';
  const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');

  return {
    plate: randomPlate,
    age: `${age} years`,
    status: status,
    timestamp: timestamp
  };
}

server.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});