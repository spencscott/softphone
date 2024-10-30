// Basic configuration for JsSIP
const socket = new JsSIP.WebSocketInterface('wss://uc1sfo.vofm.us:8001'); // Using your PBX WebSocket URL
const configuration = {
  sockets: [socket],
  uri: 'sip:9999a@fastmetrics.com', // Your SIP URI with the provided domain and username
  password: 'CAUYp02y', // Your SIP password
  registrar_server: 'sip:fastmetrics.com', // Optional: explicitly set the registrar server
  contact_uri: 'sip:9999a@core1sfo.vofm.us:5060', // Use outbound proxy if required
};

// Initialize the JsSIP User Agent
const userAgent = new JsSIP.UA(configuration);

userAgent.on('connected', () => {
  document.getElementById('status').textContent = 'Status: Connected';
});

userAgent.on('disconnected', () => {
  document.getElementById('status').textContent = 'Status: Disconnected';
});

userAgent.on('newRTCSession', (e) => {
  const session = e.session;

  if (session.direction === 'incoming') {
    // Incoming call handling
    document.getElementById('status').textContent = 'Status: Incoming call...';
    session.answer(); // Automatically answer for demo purposes
  }

  // Update buttons
  document.getElementById('hangupButton').disabled = false;
  document.getElementById('callButton').disabled = true;

  session.on('ended', () => {
    document.getElementById('status').textContent = 'Status: Call ended';
    document.getElementById('hangupButton').disabled = true;
    document.getElementById('callButton').disabled = false;
  });

  session.on('failed', () => {
    document.getElementById('status').textContent = 'Status: Call failed';
    document.getElementById('hangupButton').disabled = true;
    document.getElementById('callButton').disabled = false;
  });
});

// Connect the user agent
userAgent.start();

// Start a call when "Start Call" is clicked
document.getElementById('callButton').addEventListener('click', () => {
  const target = 'sip:destination@fastmetrics.com'; // Replace with the target SIP address
  userAgent.call(target);
  document.getElementById('status').textContent = 'Status: Calling...';
  document.getElementById('hangupButton').disabled = false;
  document.getElementById('callButton').disabled = true;
});

// Hang up the call when "Hang Up" is clicked
document.getElementById('hangupButton').addEventListener('click', () => {
  userAgent.terminateSessions();
  document.getElementById('status').textContent = 'Status: Call ended';
  document.getElementById('hangupButton').disabled = true;
  document.getElementById('callButton').disabled = false;
});
