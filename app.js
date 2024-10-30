// DOM Elements
const statusDisplay = document.getElementById("status");
const connectButton = document.getElementById("connect");
const callButton = document.getElementById("call");
const hangupButton = document.getElementById("hangup");

let userAgent;
let session;

// Update status message
function updateStatus(message) {
  statusDisplay.innerText = `Status: ${message}`;
}

// Configure and connect User Agent
function connect() {
  userAgent = new SIP.UA({
    uri: '9999a@fastmetrics.com',
    transportOptions: {
      wsServers: ['wss://uc1sfo.vofm.us:8001']
    },
    authorizationUser: '9999a',
    password: 'CAUYp02y',
    sessionDescriptionHandlerFactoryOptions: {
      constraints: { audio: true, video: false }
    }
  });

  userAgent.on('registered', () => updateStatus("Connected"));
  userAgent.on('unregistered', () => updateStatus("Disconnected"));
  userAgent.on('registrationFailed', () => updateStatus("Registration Failed"));
  userAgent.on('invite', receiveCall);
}

// Make a call
function makeCall() {
  if (!userAgent) {
    updateStatus("Please connect first.");
    return;
  }

  session = userAgent.invite('sip:targetNumber@fastmetrics.com', {
    sessionDescriptionHandlerOptions: {
      constraints: { audio: true, video: false }
    }
  });

  session.on('trackAdded', () => {
    const remoteStream = new MediaStream();
    session.sessionDescriptionHandler.peerConnection.getReceivers().forEach(receiver => {
      remoteStream.addTrack(receiver.track);
    });
    const audioElement = document.createElement('audio');
    document.body.appendChild(audioElement);
    audioElement.srcObject = remoteStream;
    audioElement.play();
  });

  session.on('terminated', () => {
    updateStatus("Call ended");
  });

  updateStatus("Calling...");
}

// Hang up a call
function hangupCall() {
  if (session) {
    session.terminate();
    updateStatus("Call ended");
  } else {
    updateStatus("No active call.");
  }
}

// Receive an incoming call
function receiveCall(incomingSession) {
  session = incomingSession;
  session.accept();

  session.on('trackAdded', () => {
    const remoteStream = new MediaStream();
    session.sessionDescriptionHandler.peerConnection.getReceivers().forEach(receiver => {
      remoteStream.addTrack(receiver.track);
    });
    const audioElement = document.createElement('audio');
    document.body.appendChild(audioElement);
    audioElement.srcObject = remoteStream;
    audioElement.play();
  });

  session.on('terminated', () => {
    updateStatus("Call ended");
  });

  updateStatus("Incoming call...");
}

// Event Listeners
connectButton.addEventListener("click", connect);
callButton.addEventListener("click", makeCall);
hangupButton.addEventListener("click", hangupCall);
