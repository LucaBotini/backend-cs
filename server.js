const express = require("express");
const serverless = require("serverless-http");
const app = express();
const cors = require("cors");
app.use(cors());
const path = require("path");
const { MercadoPagoConfig, Preference } = require("mercadopago");

// Credenciais do Mercado Pago
const client = new MercadoPagoConfig({
  accessToken:
    "APP_USR-4177697305152546-041514-471a8c487b3a64e9348acf8362404580-1225363262",
});

const preference = new Preference(client);

// Servir arquivos HTML
app.use(express.static(path.join(__dirname, "htmls")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "htmls", "index.html"));
});

// Rota que cria uma preference e envia o ID pro frontend
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

// Rotas de retorno
app.get("/sucesso", (req, res) => {
  const { payment_id, status } = req.query;
  res.redirect("https://botinicommunity.tech/success");
});

app.get("/falha", (req, res) => {
  res.redirect("https://botinicommunity.tech/fail");
});

app.get("/pendente", (req, res) => {
  res.redirect("https://botinicommunity.tech/loading");
});

app.listen(3000, () => {
  console.log("Servidor rodando");
});

module.exports = serverless(app);
