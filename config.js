// ============================================
// MASTER CONFIGURATION - सब कुछ यहाँ से कंट्रोल
// ============================================

const CONFIG = {
    // Site Settings
    site: {
        name: "Instagram Premium",
        shortName: "InstaPremium",
        currency: "₹",
        supportEmail: "support@instapremium.in",
        phone: "+91 98765 43210",
        address: "123, Business Park, Andheri East, Mumbai - 400093",
        gstin: "27ABCDE1234F1Z5",
        cin: "U72900MH2024PTC123456"
    },

    // Prices
    prices: {
        followers: {
            per100: 49,
            min: 100,
            max: 10000,
            default: 1000,
            oldPrice: 199
        },
        blueTick: {
            perMonth: 199,
            oldPrice: 999,
            durations: [1, 3, 6, 12]
        },
        likes: {
            per100: 39,
            min: 100,
            max: 5000,
            default: 500,
            oldPrice: 149
        },
        combo: {
            price: 199,
            oldPrice: 499,
            includes: ["1000 Followers", "5000 Likes"]
        }
    },

    // Coupon System
    coupons: {
        enabled: true,
        maxAttempts: 4,
        blockHours: 24,
        validCodes: ["INSTA10", "BLUETICK", "LAUNCH50", "DIWALI", "COMBO50"]
    },

    // Page Redirects
    redirects: {
        home: "index.html",
        coupon: "pages/coupon.html",
        login: "pages/login.html",
        username: "pages/username.html",
        payment: "pages/payment.html",
        success: "pages/success.html",
        terms: "pages/terms.html",
        privacy: "pages/privacy.html",
        refund: "pages/refund.html"
    },

    // Razorpay Config
    razorpay: {
        keyId: "rzp_test_YOUR_KEY_HERE",
        companyName: "InstaPremium",
        description: "Instagram Premium Upgrade",
        image: "/assets/logo.png",
        theme: "#0095f6"
    },

    // Social Links
    social: {
        instagram: "#",
        telegram: "#",
        whatsapp: "#",
        twitter: "#",
        facebook: "#",
        linkedin: "#"
    }
    // config.js में API key add करो
    instagram: {
        apiKey: "G7WFZABL8VP18NV7R1BKFIYRJAR4QGPIHPN5T8I9RADVAUJPQP3EKZ18A6SR1JGFUWSSS7AGU92IQZNG",
        apiUrl: "https://app.scrapingbee.com/api/v1",
        enabled: true
    }
};

// Freeze config
Object.freeze(CONFIG);
