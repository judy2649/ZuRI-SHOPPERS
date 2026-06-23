import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { products, categories, regionsData } from "./src/data";

dotenv.config();

// Initialize GoogleGenAI SDK lazily
let aiClient: GoogleGenAI | null = null;
function getAiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY is not defined. AI Assistant features will return mocked responses.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoint for health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // API endpoint for products retrieval (client can also fetch directly, but server route is great to have)
  app.get("/api/products", (req, res) => {
    res.json(products);
  });

  // API endpoint for categories
  app.get("/api/categories", (req, res) => {
    res.json(categories);
  });

  // AI Assistant Chatbot Proxy
  app.post("/api/chat", async (req, res) => {
    const { messages, country, cart } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages format" });
    }

    const activeCountry = country || "Kenya";
    const localDetails = regionsData[activeCountry as keyof typeof regionsData] || regionsData.Kenya;
    const currentCart = cart || [];

    // Construct a rich system instruction summarizing the products, platform, and brand colors
    const miniProductsSummary = products.map(p => {
      const priceStr = activeCountry === "Kenya" 
        ? `${localDetails.symbol} ${p.priceKES.toLocaleString()}` 
        : `${localDetails.symbol} ${p.priceUGX.toLocaleString()}`;
      return `- ID: ${p.id}, Title: ${p.title}, Price: ${priceStr}, Discount: ${p.discount}%, Category: ${p.category}, Brand: ${p.brand}, Stock: ${p.stock}, BestSeller: ${p.isBestSeller ? 'Yes' : 'No'}, Express Shipping: ${p.isExpress ? 'Yes' : 'No'}`;
    }).join("\n");

    const cartSummary = currentCart.map((item: any) => {
      return `- ${item.product.title} (Qty: ${item.quantity})`;
    }).join("\n") || "No items in cart";

    const systemInstruction = `You are "ZURI", the charming and extremely professional AI Personal Shopper at ZURI SHOPPERS, the premiere online shopping store styled like Jumia, serving customers in Kenya and Uganda.

Our Brand Identity:
- Styled like Jumia but themed with our brand colors: Elegant Gold (accent) and Dark Rich Slate/Black.
- Active Country: ${activeCountry}. Standard currency for this user is ${localDetails.currency} (${localDetails.symbol}).
- Delivery: Zuri Shoppers Express provides ultra-fast delivery (doorstep within 24 hours in Nairobi and Kampala!).
- Local Payment: We accept M-Pesa (Kenya), MTN Mobile Money & Airtel Money (Uganda), Credit/Debit Cards, and Secure Cash on Delivery (COD).

Here are the products available on Zuri Shoppers today (with prices already formatted for ${activeCountry}):
${miniProductsSummary}

User's current Shopping Cart:
${cartSummary}

Instructions for your behavior:
1. Be helpful, enthusiastic, and polite. Use slight local East African warmth (e.g. "Karibu!", "Jambo!", or "Welcome to Zuri Shoppers!", "Habari?").
2. Answer queries related to our products, recommend items based on what they are looking for, help them figure out total budgets, compare products, or inform them of active discount codes.
3. If they ask for discounts/promotions, remind them they can use coupon "ZURI10" for 10% off their entire order, or "WELCOME25" for a 25% discount on their first purchase!
4. If they search for a product that is not in the list, state politely that we don't have it in stock yet, but suggest the closest premium alternatives from our catalog or offer to let our procurement team know. Do not hallucinate outside of our stock unless asked for general shopping tips.
5. Keep your responses elegant, clear, formatted in clean Markdown, and concise so it fits nicely in a small sidebar chat drawer.`;

    const formattedContents = messages.map(msg => {
      return {
        role: msg.role === "assistant" ? "model" as const : "user" as const,
        parts: [{ text: msg.text }]
      };
    });

    const client = getAiClient();
    if (!client) {
      // Mock Gemini response if key is missing
      const lastUserMsg = messages[messages.length - 1]?.text || "";
      let mockReply = `Jambo! Welcome to Zuri Shoppers! 🌟 Just to let you know, our server is currently running in trial mode, so I'm giving you a quick automated shopping guide for **${activeCountry}**:\n\n`;

      if (lastUserMsg.toLowerCase().includes("discount") || lastUserMsg.toLowerCase().includes("promo") || lastUserMsg.toLowerCase().includes("coupon")) {
        mockReply += `We have active premium deals today! You can use coupon **ZURI10** to get **10% off** your order, or **WELCOME25** for an amazing **25% off** your first purchase! 🎟️ Is there a specific item you are hoping to apply this to?`;
      } else if (lastUserMsg.toLowerCase().includes("phone") || lastUserMsg.toLowerCase().includes("tecno") || lastUserMsg.toLowerCase().includes("infinix") || lastUserMsg.toLowerCase().includes("samsung")) {
        mockReply += `We have incredible smartphone deals in ${activeCountry} today! 📱\n\n* **Infinix Hot 40i** (256GB, 8GB RAM) for only **${activeCountry === 'Kenya' ? 'KSh 13,499' : 'USh 385,000'}** (Save 15%!)\n* **Tecno Spark 20** (256GB, Gold Accent) for **${activeCountry === 'Kenya' ? 'KSh 16,299' : 'USh 465,000'}**\n* **Samsung Galaxy A35 5G** for **${activeCountry === 'Kenya' ? 'KSh 38,999' : 'USh 1,110,000'}**\n\nWould you like me to add one of these to your cart?`;
      } else if (lastUserMsg.toLowerCase().includes("express") || lastUserMsg.toLowerCase().includes("delivery") || lastUserMsg.toLowerCase().includes("shipping")) {
        mockReply += `At Zuri Shoppers, we offer **Zuri Shoppers Express** shipping! 🚀\n\n* **Nairobi & Thika**: Delivered within 24 hours!\n* **Kampala & Entebbe**: Delivered within 24 hours!\n* Other remote regions take 48-72 hours.\n\nYou can also opt for Pick-up Station saving on shipping costs!`;
      } else if (lastUserMsg.toLowerCase().includes("help") || lastUserMsg.toLowerCase().includes("marhaba") || lastUserMsg.toLowerCase().includes("hello") || lastUserMsg.toLowerCase().includes("hi") || lastUserMsg.toLowerCase().includes("jambo")) {
        mockReply += `Habari gani! How can I help you shop today? I can recommend phones, home appliances (like our signature **Zuri Air Fryer**), beautiful Maasai Shukas, premium Shea butter, and supermarket staples!`;
      } else {
        mockReply += `I'd love to help you find the best prices! You can ask me to search our catalog, recommend active deals, or check item availability. What are you shopping for in ${activeCountry} today?`;
      }

      return res.json({ text: mockReply });
    }

    try {
      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ text: response.text || "I apologize, but I could not formulate a response at this time. How can I help you find products?" });
    } catch (err: any) {
      console.error("Gemini API Error in /api/chat:", err);
      res.status(500).json({ error: "Failed to communicate with AI model", details: err.message });
    }
  });

  // Vite Integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
