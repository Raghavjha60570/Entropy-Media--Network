import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(cors());
app.use(express.json());

app.post("/api/lead", async (req, res) => {
  try {
    const { name, email, company, budget, message, intent } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    // Send auto-response email to client (log HTML and set headers to avoid threading)
    const autoResponseHtml = `
        <div style="font-family:Arial, sans-serif; line-height:1.6;">
          <h2>Hi ${name},</h2>

          <p>Thank you for reaching out to Entropy Mediaworks.</p>

          <p>To move forward, please book your Distribution Strategy Call using the link below:</p>

          <p style="margin:30px 0;">
            <a href="https://calendly.com/rjha9277/grow-your-leads-with-linkedin-cold-outreach"
               style="
                 background:#7c3aed;
                 color:white;
                 padding:14px 22px;
                 text-decoration:none;
                 border-radius:8px;
                 font-weight:bold;
                 display:inline-block;">
              Book My Strategy Call
            </a>
          </p>

          <p>This session will help us evaluate your distribution system and identify structured growth opportunities.</p>

          <br/>
          <p>Looking forward to it.</p>
          <p><strong>— Ranjana Jha</strong><br/>Founder, Entropy Mediaworks</p>
        </div>
      `;

    console.log('Sending auto-response to', email);
    console.log(autoResponseHtml);

    // Add headers to reduce chance of being threaded as a reply (prevents old quoted content)
    await resend.emails.send({
      from: "Entropy Mediaworks <onboarding@resend.dev>",
      to: email,
      subject: "Book Your Distribution Strategy Call 🚀",
      headers: {
        "In-Reply-To": "",
        "References": "",
        // generate a simple unique message-id
        "Message-ID": `<${Date.now()}@entropymediaworks>`
      },
      html: autoResponseHtml
    });


  

    res.status(200).json({ success: true });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});