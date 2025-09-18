import fetch from "node-fetch";

// ======= Klaviyo API Keys =======
const PUBLIC_API_KEY = "U3nma2"; // public key for sending metric
const PRIVATE_API_KEY = "pk_acd02017da8f3b5a61f63bfe5494640b63"; // private key to fetch profile/events

// ======= Order / Customer Data =======U3nma2
const orderData = {
  email: "cuuu@yopmail.com", // use a real email
  firstName: "John",
  lastName: "Doe",
  orderId: "ORD123456",
  total: 99.99,
  currency: "USD",
  items: [
    { name: "Product A", sku: "A001", price: 49.99, quantity: 1 },
    { name: "Product B", sku: "B001", price: 25.00, quantity: 2 },
  ],
  orderDate: new Date().toISOString(),
};

// ======= Function to Send Metric =======
async function sendMetric(order) {
  const payload = {
    token: PUBLIC_API_KEY,
    event: "Order Placed",
    customer_properties: {
      $email: order.email,
      $first_name: order.firstName,
      $last_name: order.lastName,
    },
    properties: {
      order_id: order.orderId,
      total: order.total,
      currency: order.currency,
      items: order.items,
      order_date: order.orderDate,
    },
  };

  const response = await fetch("https://a.klaviyo.com/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  console.log("Metric sent successfully:", data);
}

// ======= Function to Wait for Profile & Check Metric =======
async function checkMetricForProfile(email, retries = 5, delay = 5000) {
  for (let i = 0; i < retries; i++) {
    try {
      // Get profile by email
      const profileRes = await fetch(
        `https://a.klaviyo.com/api/profiles/?email=${email}`,
        {
          headers: {
            Authorization: `Klaviyo-API-Key ${PRIVATE_API_KEY}`,
          },
        }
      );

      const profileData = await profileRes.json();

      if (profileData?.data && profileData.data.length > 0) {
        const profileId = profileData.data[0].id;

        // Get recent metrics/events for this profile
        const eventsRes = await fetch(
          `https://a.klaviyo.com/api/metrics/timeline/?profile_id=${profileId}&count=10`,
          {
            headers: {
              Authorization: `Klaviyo-API-Key ${PRIVATE_API_KEY}`,
            },
          }
        );

        const eventsData = await eventsRes.json();
        const triggeredEvent = eventsData.data.find(
          (e) => e.event_name === "Active on Site"
        );

        if (triggeredEvent) {
          console.log(
            "✅ Metric found for user! Flow should have triggered the email."
          );
          return;
        } else {
          console.log(
            `Metric not found yet. Retry ${i + 1} of ${retries}...`
          );
        }
      } else {
        console.log(`Profile not found yet. Retry ${i + 1} of ${retries}...`);
      }
    } catch (err) {
      console.error("Error checking metric:", err);
    }

    // Wait before retrying
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  console.log("⚠️ Metric not found after retries. Check Klaviyo manually.");
}

// ======= Run Script =======
(async () => {
  await sendMetric(orderData);
  await checkMetricForProfile(orderData.email);
})();
