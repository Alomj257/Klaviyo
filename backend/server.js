import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import cors from "cors";
const app = express();
app.use(cors());
app.use(bodyParser.json());

// 🔑 Replace with your real values
const KLAVIYO_API_KEY = "";  // Private API Key
const LIST_ID = "";                 // Klaviyo List ID

// ✅ Subscription endpoint
// app.post("/subscribe", async (req, res) => {
//   try {
//     const { email } = req.body;

//     if (!email) {
//       return res.status(400).json({ success: false, message: "Email is required" });
//     }

//     const payload = {
//       data: {
//         type: "profile-bulk-import-job",
//         attributes: {
//           profiles: {
//             data: [
//               {
//                 type: "profile",
//                 attributes: {
//                   email: email
//                 }
//               }
//             ]
//           }
//         },
//         relationships: {
//           lists: {
//             data: [
//               {
//                 type: "list",
//                 id: LIST_ID
//               }
//             ]
//           }
//         }
//       }
//     };

//     const response = await fetch("https://a.klaviyo.com/api/profile-bulk-import-jobs/", {
//       method: "POST",
//       headers: {
//         "Authorization": `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
//         "revision": "2023-12-15",
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify(payload)
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       console.error("❌ Klaviyo Error:", data);
//       return res.status(400).json({ success: false, error: data });
//     }

//     // ✅ Email will be added immediately to your list
//     return res.json({ success: true, message: "✅ Subscribed successfully!", result: data });

//   } catch (err) {
//     console.error("❌ Server error:", err);
//     return res.status(500).json({ success: false, message: "Server error", error: err.message });
//   }
// });

// app.post("/subscribe", async (req, res) => {
//   try {
//     const { email, firstName, lastName } = req.body;

//     if (!email) {
//       return res.status(400).json({ success: false, message: "Email is required" });
//     }

//     const payload = {
//       data: {
//         type: "profile-bulk-import-job",
//         attributes: {
//           profiles: {
//             data: [
//               {
//                 type: "profile",
//                 attributes: {
//                   email: email,
//                   first_name: firstName || "", // ✅ save first name
//                   last_name: lastName || ""   // ✅ save last name
//                 }
//               }
//             ]
//           }
//         },
//         relationships: {
//           lists: {
//             data: [
//               {
//                 type: "list",
//                 id: LIST_ID
//               }
//             ]
//           }
//         }
//       }
//     };

//     const response = await fetch("https://a.klaviyo.com/api/profile-bulk-import-jobs/", {
//       method: "POST",
//       headers: {
//         "Authorization": `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
//         "revision": "2023-12-15",
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify(payload)
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       console.error("❌ Klaviyo Error:", data);
//       return res.status(400).json({ success: false, error: data });
//     }

//     return res.json({ success: true, message: "✅ Subscribed successfully!", result: data });

//   } catch (err) {
//     console.error("❌ Server error:", err);
//     return res.status(500).json({ success: false, message: "Server error", error: err.message });
//   }
// });

app.post("/subscribe", async (req, res) => {
  try {
    const { email, fullName } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    // Split full name into first + last
    let firstName = "";
    let lastName = "";
    if (fullName) {
      const parts = fullName.trim().split(" ");
      firstName = parts[0];
      lastName = parts.length > 1 ? parts.slice(1).join(" ") : "";
    }

    const payload = {
      data: {
        type: "profile-bulk-import-job",
        attributes: {
          profiles: {
            data: [
              {
                type: "profile",
                attributes: {
                  email: email,
                  first_name: firstName,
                  last_name: lastName
                }
              }
            ]
          }
        },
        relationships: {
          lists: {
            data: [
              {
                type: "list",
                id: LIST_ID
              }
            ]
          }
        }
      }
    };

    const response = await fetch("https://a.klaviyo.com/api/profile-bulk-import-jobs/", {
      method: "POST",
      headers: {
        "Authorization": `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
        "revision": "2023-12-15",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Klaviyo Error:", data);
      return res.status(400).json({ success: false, error: data });
    }

    return res.json({ success: true, message: "✅ Subscribed successfully!", result: data });

  } catch (err) {
    console.error("❌ Server error:", err);
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});



// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
