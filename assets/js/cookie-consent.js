const consentKey = "bookenjenn-cookie-consent-2026-23-08";

const CONSENT_ACCEPTED = "accepted";
const CONSENT_REJECTED = "rejected";

function updateGoogleConsent(status) {
    if (typeof gtag !== "function") {
        return;
    }

    gtag("consent", "update", {
        ad_storage: status,
        ad_user_data: status,
        ad_personalization: status,
        analytics_storage: status
    });
}

function setDeniedByDefault() {
    hideConsentBanner()
    if (typeof gtag !== "function") {
        return;
    }

    gtag("consent", "default", {
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        analytics_storage: "denied",
        wait_for_update: 500
    });
}

function checkConsent() {
    try {
        const consent = localStorage.getItem(consentKey);
        if (consent === CONSENT_ACCEPTED) {
            updateGoogleConsent("granted");
            hideConsentBanner();
        } else if (consent === CONSENT_REJECTED) {
            updateGoogleConsent("denied");
            hideConsentBanner();
        } else {
            setDeniedByDefault();
            setTimeout(askForConsent, 2600)
        }
    } catch (error) {
        console.error("Unable to read consent:", error);
        askForConsent();
    }
}

function askForConsent() {
    const banner = document.getElementById("consent-banner-display");

    if (banner) {
        banner.classList.add("show-consent-banner");
        banner.classList.remove("hide-consent-banner");
    }
}

function saveConsent(value) {
    try {
        localStorage.setItem(consentKey, value);
    } catch (error) {
        console.error("Unable to save consent:", error);
    }

    updateGoogleConsent(
        value === CONSENT_ACCEPTED ? "granted" : "denied"
    );

    hideConsentBanner();
}

function hideConsentBannerOnAccept() {
    console.log("consent obtained");

    saveConsent(CONSENT_ACCEPTED);
}

function hideConsentBannerOnReject() {
    console.log("consent rejected");

    saveConsent(CONSENT_REJECTED);
}

function hideConsentBanner() {
    const banner = document.getElementById("consent-banner-display");

    if (banner) {
        banner.classList.add("hide-consent-banner");
        banner.classList.remove("show-consent-banner");
    }
}

checkConsent();
