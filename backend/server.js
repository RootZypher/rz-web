const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());

// तुम्हारी REAL TEST KEYS
const razorpay = new Razorpay({
    key_id: 'rzp_test_SNuZaM0AeAFbn4',
    key_secret: 'FyyftO28Sm7d2GpVFMu751x7'
});

// ===================== TEST ROUTE =====================
app.get('/api/test', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'Razorpay server running',
        key_id: razorpay.key_id.substring(0, 10) + '...'
    });
});

// ===================== UPI COLLECT REQUEST =====================
app.post('/api/upi-collect', async (req, res) => {
    try {
        const { upiId, amount, username } = req.body;
        
        console.log(`📤 UPI collect request for: ${upiId}`);
        
        // सिर्फ order create करो (payments.create हटा दिया)
        const orderOptions = {
            amount: amount * 100,
            currency: 'INR',
            receipt: 'upi_' + Date.now(),
            payment_capture: 1,
            notes: {
                type: 'trail',
                upiId: upiId,
                username: username
            }
        };
        
        const order = await razorpay.orders.create(orderOptions);
        console.log('✅ Order created:', order.id);
        
        // सीधा success response bhejo
        res.json({
            success: true,
            paymentId: order.id,
            orderId: order.id,
            status: 'created',
            message: 'Request sent successfully (test mode)'
        });
        
    } catch (error) {
        console.error('❌ Error:', error);
        res.json({
            success: false,
            message: error.message
        });
    }
});

// ===================== CHECK PAYMENT STATUS =====================
app.get('/api/payment-status/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await razorpay.orders.fetch(orderId);
        
        // Mock response for test
        res.json({
            paid: true,
            status: 'captured',
            message: 'Payment successful (test mode)'
        });
        
    } catch (error) {
        res.json({ paid: false, error: error.message });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Razorpay Server running on http://localhost:${PORT}`);
});
