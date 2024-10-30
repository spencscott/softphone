// Replace these with your SIP credentials
const sipConfig = {
  uri: 'sip:9999a@fastmetrics.com',
  authorizationUser: '9999a',
  password: 'CAUYp02y',
  transportOptions: {
    wsServers: 'wss://uc1sfo.vofm.us:8001',
    traceSip: true,
  },
  registrarServer: 'sip:fastmetrics.com',
};

// Create the SIP User Agent
const userAgent = new SIP.UserAgent({
  uri: sipConfig.uri,
  transportOptions: sipConfig.transportOptions,
  authorizationUsername: sipConfig.authorizationUser,
  authorizationPassword: sipConfig.password,
  registrarServer: sipConfig.registrarServer,
});

// Store the session object globally to manage calls
let session;

// Start Call
function startCall() {
  const options = {
    sessionDescriptionHandlerOptions: {
      constraints: {
        audio: true,
        video: false,
      },
    },
  };

  session = userAgent.invite('sip:destination_number@fastmetrics.com', options);

  session.on('trackAdded', () => {
    const remoteStream = new MediaStream();
    session.sessionDescriptionHandler.peerConnection
      .getReceivers()
      .forEach(receiver => {
        remoteStream.addTrack(receiver.track);
      });
    document.getElementById('remoteAudio').srcObject = remoteStream;
  });
}

// End Call
function endCall() {
  if (session) {
    session.bye();
    session = null;
  }
}

// Connect the User Agent
userAgent.start().then(() => {
  console.log("SIP.js User Agent Registered");
}).catch(error => {
  console.error("Registration Error: ", error);
});
