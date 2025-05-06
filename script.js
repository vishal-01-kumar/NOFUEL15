// Connect to WebSocket server
const socket = new WebSocket('ws://localhost:3000');

socket.addEventListener('open', () => {
  console.log('Connected to WebSocket server.');
});

socket.addEventListener('message', (event) => {
  const vehicle = JSON.parse(event.data);
  console.log('Received vehicle:', vehicle);
  addVehicleToTable(vehicle);
});

socket.addEventListener('close', () => {
  console.log('Disconnected from server.');
});

// Add received vehicle to table
function addVehicleToTable(vehicle) {
  const tableBody = document.getElementById('vehicle-table-body');

  const row = document.createElement('tr');

  row.innerHTML = `
    <td>${vehicle.plate}</td>
    <td>${vehicle.age}</td>
    <td class="${vehicle.status.toLowerCase()}">${vehicle.status}</td>
    <td>${vehicle.timestamp}</td>
  `;

  tableBody.prepend(row);
}

// Refresh the live camera feed
function refreshCamera() {
  const stream = document.getElementById('live-stream');
  if (stream) {
    stream.src = 'http://192.168.86.151:81/stream?' + new Date().getTime();
  }
}

// // Filter vehicle scan list
// function filterScans(status) {
//   console.log("Filtering scans by:", status);
//   if status=="Allowed"{
    
//   }
// }





function scanPlateFromCamera() {
  fetch('http://localhost:5000/scan', {
    method: 'POST'
  })
  .then(res => res.json())
  .then(data => {
    if (data.plate) {
      console.log('Detected:', data);
      // Update table with data.plate, data.vehicle_age, data.access_status, data.timestamp
    } else {
      console.error('Error:', data.error);
    }
  })
  .catch(err => console.error(err));
}











