const express = require('express');
const router = express.Router();

// Importa la clase Transaction desde el SDK oficial Transbank Webpay Plus
const { WebpayPlus } = require('transbank-sdk');

// Configura la instancia de WebpayPlus (puedes parametrizar con variables de entorno)
const transaction = new WebpayPlus.Transaction();

// POST /api/v1/webpay/create
router.post('/create', async (req, res) => {
  try {
    const { buy_order, session_id, amount, return_url } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Monto inválido' });
    }

    if (!buy_order || !session_id || !return_url) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    // Crear la transacción Webpay Plus
    const response = await transaction.create(
      buy_order,
      session_id,
      amount,
      return_url
    );

    // response debe contener: token, url, etc.
    res.json({ url: response.url, token: response.token });
  } catch (error) {
    console.error('Error en /webpay/create:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
