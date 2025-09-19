// easybill-multi-invoices.js
import axios from "axios";
const EASYBILL_API_TOKEN = "";

// Example customer and multiple orders
const customer = {
  name: "John Doe",
  email: "john.doe@example.com",
};

const orders = [
  {
    orderId: "ORD-1001",
    orderDate: "2025-09-01",
    products: [
      { description: "Product A", quantity: 2, unit_price: 50 },
      { description: "Product B", quantity: 1, unit_price: 120 },
    ],
  },
  {
    orderId: "ORD-1002",
    orderDate: "2025-09-05",
    products: [
      { description: "Product C", quantity: 3, unit_price: 30 },
      { description: "Product D", quantity: 1, unit_price: 200 },
    ],
  },
];

// Create or fetch existing customer
async function createCustomer(customer) {
  try {
    const response = await axios.post(
      "https://api.easybill.de/rest/v1/customers",
      {
        first_name: customer.name.split(" ")[0],
        last_name: customer.name.split(" ")[1] || "",
        email: customer.email,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${EASYBILL_API_TOKEN}`,
        },
      }
    );

    console.log("✅ Customer created:", response.data.id);
    return response.data.id;
  } catch (error) {
    if (error.response?.status === 422) {
      console.log("ℹ️ Customer already exists. Searching by email...");
      const searchRes = await axios.get(
        `https://api.easybill.de/rest/v1/customers?query=${customer.email}`,
        {
          headers: {
            "Authorization": `Bearer ${EASYBILL_API_TOKEN}`,
          },
        }
      );

      if (searchRes.data.items.length > 0) {
        console.log("✅ Existing customer found:", searchRes.data.items[0].id);
        return searchRes.data.items[0].id;
      }
    }

    console.error("❌ Customer API Error:", error.response?.status, error.response?.statusText);
    console.error("📩 Response Data:", JSON.stringify(error.response?.data, null, 2));
    throw error;
  }
}

// Create and send invoice for a single order
async function createAndSendInvoice(customerId, order) {
  try {
    const invoiceData = {
      type: "invoice",
      customer_id: customerId,
      title: `Order ${order.orderId}`,
      introduction: `Invoice for order placed on ${order.orderDate}`,
      items: order.products.map((p) => ({
        description: p.description,
        quantity: p.quantity,
        unit_price: p.unit_price,
      })),
      send_by_email: true, // auto-send invoice to email
    };

    const response = await axios.post(
      "https://api.easybill.de/rest/v1/documents",
      invoiceData,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${EASYBILL_API_TOKEN}`,
        },
      }
    );

    console.log("✅ Invoice created and sent!");
    console.log("   Invoice ID:", response.data.id);
    console.log("   Document Number:", response.data.number);

  } catch (error) {
    console.error("❌ Error creating/sending invoice for", order.orderId);
    if (error.response) {
      console.error("API Status:", error.response.status, error.response.statusText);
      console.error("📩 Response Data:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.error("General Error:", error.message);
    }
  }
}

// Main runner
async function run() {
  try {
    const customerId = await createCustomer(customer);

    for (const order of orders) {
      console.log(`\n📦 Processing ${order.orderId} (${order.orderDate})...`);
      await createAndSendInvoice(customerId, order);
    }
  } catch (err) {
    console.error("❌ Fatal error:", err.message);
  }
}

run();
