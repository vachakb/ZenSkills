const express = require("express");
const { google } = require("googleapis");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// OAuth2 client setup
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

let tokens = null;

app.get("/login", (req, res) => {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: ["https://www.googleapis.com/auth/calendar.events"],
    });
    res.redirect(authUrl);
  });

// OAuth2 callback
app.get("/oauth2callback", async (req, res) => {
    const code = req.query.code;
    try {
      const { tokens: newTokens } = await oauth2Client.getToken(code);
      tokens = newTokens; // Save tokens
      oauth2Client.setCredentials(tokens); // Set credentials
      res.redirect("http://localhost:3000"); // Redirect to frontend
    } catch (error) {
      console.error("Error during OAuth callback:", error);
      res.status(500).send("Authentication failed.");
    }
  });
  

// Get events
app.get("/events", async (req, res) => {
    if (!tokens) {
      return res.status(401).json({ error: "User not authenticated. Please log in." });
    }
  
    try {
      oauth2Client.setCredentials(tokens);
      const calendar = google.calendar({ version: "v3", auth: oauth2Client });
      const events = await calendar.events.list({
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: "startTime",
      });
      res.status(200).json(events.data.items);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).send("Failed to fetch events.");
    }
  });
  
  app.post("/add-event", async (req, res) => {
    if (!tokens) {
      return res.status(401).json({ error: "User not authenticated. Please log in." });
    }
  
    const { summary, location, description, startTime, endTime } = req.body;

    const formattedStartTime = new Date(startTime).toISOString();
    const formattedEndTime = new Date(endTime).toISOString();
  
    try {
      oauth2Client.setCredentials(tokens);
      const calendar = google.calendar({ version: "v3", auth: oauth2Client });
      const event = {
        summary,
        location,
        description,
        start: { dateTime: formattedStartTime, timeZone: "America/Los_Angeles" },
        end: { dateTime: formattedEndTime, timeZone: "America/Los_Angeles" },
      };
      const response = await calendar.events.insert({
        calendarId: "primary",
        resource: event,
      });
      res.status(201).json(response.data);
    } catch (error) {
      console.error("Error adding event:", error);
      res.status(500).send("Failed to add event.");
    }
  });
  

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
