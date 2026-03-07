// ============================================
// RAZORPAY CONFIGURATION - REAL TEST KEYS
// ============================================

const RAZORPAY_CONFIG = {
    key_id: "rzp_test_SNuZaM0AeAFbn4",
    key_secret: "FyyftO28Sm7d2GpVFMu751x7",
    
    amounts: {
        trail: 5,
        main: 499
    },
    
    currency: "INR",
    
    upi_handles: [
        "@okhdfcbank", "@ybl", "@paytm", "@okaxis",
        "@okicici", "@ptsbi", "@okbob", "@okcan"
    ],
    
    webhook_url: "http://localhost:5000/webhook"
};

Object.freeze(RAZORPAY_CONFIG);
