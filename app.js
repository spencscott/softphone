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
async function connect() {
  try {
    userAgent = new SIP.Web.SimpleUser("wss://uc1sfo.vofm.us:8001", {
      aor: 'sip:9999a@fastmetrics.com',
      userAgentOptions: {
        authorizationUsername: '9999a',
        authorizationPassword: 'CAUYp02y'
      },
      media: {
        remote: {
          audio: document.createElement("audio") // audio element for remote audio
        },
        constraints: { audio: true, video: false }
      }
    });

    await userAgent.connect();
    await userAgent.register();

    updateStatus("Connected");
  } catch (error) {
    console.error("Connection error:", error);
    updateStatus("Connection Failed");
  }
}

// Make a call
async function makeCall() {
  if (!userAgent || !userAgent.isConnected()) {
    updateStatus("Please connect first.");
    return;
  }

  try {
    session = await userAgent.call("sip:targetNumber@fastmetrics.com");
    updateStatus("Calling...");
  } catch (error) {
    console.error("Call error:", error);
    updateStatus("Call failed");
  }
}

// Hang up a call
function hangupCall() {
  if (session) {
    session.hangup();
    updateStatus("Call ended");
  } else {
    updateStatus("No active call.");
  }
}

// Event Listeners
connectButton.addEventListener("click", connect);
callButton.addEventListener("click", makeCall);
hangupButton.addEventListener("click", hangupCall);
