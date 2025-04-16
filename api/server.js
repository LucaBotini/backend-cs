const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const path = require("path");
const { MercadoPagoConfig, Preference } = require("mercadopago");

const app = express();
app.use(cors());

const client = new MercadoPagoConfig({
  accessToken:
    "APP_USR-4177697305152546-041514-471a8c487b3a64e9348acf8362404580-1225363262",
});
console.log(client.accessToken);

const preference = new Preference(client);

// Corrigir caminho estático para HTML
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

app.get("/preference", async (req, res) => {
  try {
    const result = await preference.create({
      body: {
        items: [
          {
            title: "[btn] Code Support PREMIUM",
            quantity: 1,
            unit_price: 40,
          },
        ],
        back_urls: {
          success: "/sucesso",
          failure: "/falha",
          pending: "/pendente",
        },
        auto_return: "approved",
      },
    });

    res.json({ id: result.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar preferência" });
  }
});

app.get("/sucesso", (req, res) => {
  res.redirect("https://botinicommunity.tech/success");
});

app.get("/falha", (req, res) => {
  res.redirect("https://botinicommunity.tech/fail");
});

app.get("/pendente", (req, res) => {
  res.redirect("https://botinicommunity.tech/loading");
});

module.exports = serverless(app);
