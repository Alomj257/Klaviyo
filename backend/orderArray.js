import axios from "axios";

const KLAVIYO_API_KEY = "pk_bc5f852242cb4abaaea1293e456f385ec2";

async function sendOrderPlacedEvent(order) {
  const payload = {
    data: {
      type: "event",
      attributes: {
        metric: { name: "Order Place" }, // must match your Klaviyo metric
        properties: {
          order_id: order.id,
          total_price: order.total,
          items: order.items // array of multiple products
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
    console.log("Event sent to Klaviyo for order:", order.id);
  } catch (error) {
    console.error("Error sending event:", error.response?.data || error.message);
  }
}

// Example order with multiple items
const orderData = {
  id: "order123",
  total: 8999.99,
  items: [
    { name: "Product 1", qty: 1, price: 1999.99 },
    { name: "Product 2", qty: 2, price: 2999.99 },
    { name: "Product 3", qty: 1, price: 3999.99 }
  ],
  email: "jahangir.webguru@gmail.com",
  name: "John Doe"
};

sendOrderPlacedEvent(orderData);
