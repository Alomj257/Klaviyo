import axios from "axios";

const KLAVIYO_API_KEY = "";

async function sendOrderPlacedEvent(order) {
  const payload = {
    data: {
      type: "event",
      attributes: {
        metric: { name: "Order Place" },
        properties: {
          order_id: order.id,
          total_price: order.total,
          items: order.items
        },
        profile: {
          email: order.email,
          first_name: order.name
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

    console.log("Event sent to Klaviyo");

  } catch (error) {
    console.error("Error sending event:", error.response?.data || error.message);
  }
}

// Example order data
const orderData = {
  id: "rt",
  total: 4998.99,
  items: [{ name: "Test Product", qty: 1, price: 4998.99 }],
  email: "fillupseva@gmail.com",
  name: "pack"
};

sendOrderPlacedEvent(orderData);
