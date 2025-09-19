import axios from "axios";

const KLAVIYO_API_KEY = "";

async function getMetricId(metricName) {
  try {
    const response = await axios.get("https://a.klaviyo.com/api/metrics/", {
      headers: {
        Authorization: `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
        revision: "2023-02-22"
      }
    });

    const metric = response.data.data.find(m => m.attributes.name === metricName);
    return metric ? metric.id : null;
  } catch (err) {
    console.error("❌ Error fetching metrics:", err.response?.data || err.message);
  }
}

async function getRecentEvents(metricId) {
  try {
    const response = await axios.get(
      `https://a.klaviyo.com/api/metrics/${metricId}/timeline/`,
      {
        headers: {
          Authorization: `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
          revision: "2023-02-22"
        }
      }
    );

    console.log("📩 Recent Events:", JSON.stringify(response.data, null, 2));
  } catch (err) {
    console.error("❌ Error fetching events:", err.response?.data || err.message);
  }
}

(async () => {
  const metricId = await getMetricId("Active on Site");
  if (metricId) {
    console.log("✅ Metric ID for Order Placed:", metricId);
    await getRecentEvents(metricId);
  } else {
    console.log("⚠️ Could not find metric 'Order Placed'.");
  }
})();
