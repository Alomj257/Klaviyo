import axios from "axios";

const KLAVIYO_API_KEY = "";

async function sendLoginEvent(user) {
  const payload = {
    data: {
      type: "event",
      attributes: {
        metric: { name: "6 Month Gold Package welcome" },
        properties: {},
        profile: {
          email: user.email,
          first_name: user.name
        },
        time: new Date().toISOString()
      }
    }
  };

  try {
    const response = await axios.post(
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
    console.log("Login event sent to Klaviyo");
  } catch (err) {
    console.error("Error sending login event:", err.response?.data || err.message);
  }
}

// Example usage
sendLoginEvent({ email: "test@gmail.com", name: "Test User" });
