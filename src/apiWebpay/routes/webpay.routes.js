const express = require('express');
const router = express.Router();
const { WebpayPlus, Options } = require('transbank-sdk');

// ✅ Crear configuración manual con Options
const commerceCode = '597055555532'; // Código de comercio de prueba
const apiKey = '597055555532'; // API Key de prueba
const integrationUrl = 'https://webpay3gint.transbank.cl';

const options = new Options(commerceCode, apiKey, integrationUrl);
const transaction = new WebpayPlus.Transaction(options);

router.post('/create', async (req, res) => {
  try {
    let { buy_order, session_id, amount, return_url } = req.body;

    // Validaciones mínimas
    if (!buy_order || !session_id || !return_url || !amount) {
      return res.status(400).json({ error: 'Faltan datos requeridos o monto inválido' });
    }

    buy_order = String(buy_order);
    session_id = String(session_id);
    return_url = String(return_url);
    amount = Number(amount);

    if (amount <= 0) {
      return res.status(400).json({ error: 'El monto debe ser mayor a 0' });
    }

    const response = await transaction.create(
      buy_order,
      session_id,
      amount,
      return_url
    );

    res.json({
      url: response.url,
      token: response.token
    });
  } catch (error) {
    console.error('Error en /webpay/create:', error);
    res.status(500).json({ error: 'Error interno al crear la transacción' });
  }
});

module.exports = router;
