import axios from "axios";
import qs from "qs"; // for x-www-form-urlencoded

const KLAVIYO_API_KEY = "pk_bc5f852242cb4abaaea1293e456f385ec2";

async function sendTemplateDirectly(email, templateId) {
  const payload = qs.stringify({
    from_email: "your-verified-email@example.com",
    from_name: "Your Name",
    subject: "Hello from Klaviyo",
    to: JSON.stringify([{ name: "User", email: email }]),
    context: JSON.stringify({ name: "User" })
  });

  try {
    const response = await axios.post(
      `https://a.klaviyo.com/api/v1/email-template/${templateId}/send?api_key=${KLAVIYO_API_KEY}`,
      payload,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json"
        }
      }
    );
    console.log("Template sent directly:", response.data);
  } catch (error) {
    console.error("Error sending template directly:", error.response?.data || error.message);
  }
}

// Example usage
sendTemplateDirectly("fillupseva@gmail.com", "VYgmmX");
