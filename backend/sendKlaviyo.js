import axios from "axios";

const KLAVIYO_API_KEY = "";

/**
 * Send any event to Klaviyo
 * @param {string} eventName - Name of the event (metric)
 * @param {object} profile - User profile info: { email, first_name }
 * @param {object} properties - Custom properties related to the event
 */
async function sendKlaviyoEvent(eventName, profile, properties = {}) {
  const payload = {
    data: {
      type: "event",
      attributes: {
        metric: { name: eventName },
        properties,
        profile,
        time: new Date().toISOString()
      }
    }
  };

  try {
    await axios.post(
      "https://a.klaviyo.com/api/events/",
      payload,
      {
        headers: {
          Authorization: `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
          "Content-Type": "application/json",
          revision: "2023-02-22"
        }
      }
    );
    console.log(`Event "${eventName}" sent to Klaviyo`);
  } catch (err) {
    console.error(`Error sending "${eventName}" event:`, err.response?.data || err.message);
  }
}

// ✅ Example usage for login event
sendKlaviyoEvent(
  "User Logged In",
  { email: "jahangir.webguru@gmail.com", first_name: "Jahangir" }
);

// ✅ Example usage for order placed
// sendKlaviyoEvent(
//   "Order Place",
//   { email: "fillupseva@gmail.com", first_name: "pack" },
//   { order_id: "rt", total_price: 4998.99, items: [{ name: "Test Product", qty: 1, price: 4998.99 }] }
// );
