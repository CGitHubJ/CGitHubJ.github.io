const consentValue = "bookenjenn-cookie-consent-{{ site.privacyUpdate }}";

setTimeout(function checkConsent() {
    try {
        if (!hasLocalStorageConsent()) {
            askForConsent();
        } else {
            // If they already accepted on a previous page load, update Google immediately
            gtag('consent', 'update', {
                'ad_storage': 'granted',
                'ad_user_data': 'granted',
                'ad_personalization': 'granted',
                'analytics_storage': 'granted'
            });
        }
    } catch (error) {
        console.error(error);
    }
}, 500 );

function hasLocalStorageConsent() {
    return localStorage.getItem(consentValue);
}

function askForConsent() {
    console.log("asking for consent");
    const banner = document.getElementById("consent-banner-display");
    if (banner) {
        banner.className = "show-consent-banner";
    }
}

function hideConsentBannerOnAccept() {
    console.log("consent obtained");
    localStorage.setItem(consentValue, true);
    // Google Compliance Update: Signal GA4 that consent is granted
    if (typeof gtag === 'function') {
        gtag('consent', 'update', {
            'ad_storage': 'granted',
            'ad_user_data': 'granted',
            'ad_personalization': 'granted',
            'analytics_storage': 'granted'
        });
    }
    const banner = document.getElementById("consent-banner-display");
    if (banner) {
        banner.className = "hide-consent-banner";
    }
}

function tempHideConsent() {
    const banner = document.getElementById("consent-banner-display");
    if (banner) {
        banner.className = "hide-consent-banner";
    }
}

window.onload = tempHideConsent;