const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fetch = require("node-fetch");

admin.initializeApp();

exports.discordToken = functions.https.onRequest(async (req, res) => {
  const discordToken = req.body.discord_access_token;

  const userRes = await fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${discordToken}` }
  });

  if (!userRes.ok) {
    return res.status(401).send("Discord 인증 실패");
  }

  const user = await userRes.json();

  // Firebase Custom Token 발급
  const firebaseToken = await admin.auth().createCustomToken(user.id);

  res.json({ firebaseToken });
});
