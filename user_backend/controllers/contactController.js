const GsmModem = require("node-gsm").Modem;

const modem = new GsmModem();
const modemPort = "COM3"; // Change to your modem port (Windows: COM3, Linux: /dev/ttyUSB0)

// Open modem when server starts
modem.open(modemPort, { baudRate: 115200 })
  .then(() => console.log("GSM Modem connected and ready."))
  .catch(err => console.error("Failed to connect GSM modem:", err));

exports.sendSms = async (req, res) => {
  const { mobile, message } = req.body;

  if (!mobile || !message) {
    return res.status(400).json({ error: "Mobile number and message are required" });
  }

  try {
    const result = await modem.sendSms(mobile, message);
    console.log("SMS sent:", result);
    res.json({ success: true, result });
  } catch (err) {
    console.error("SMS send error:", err);
    res.status(500).json({ error: "Failed to send SMS", details: err });
  }
};
