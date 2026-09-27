/**
 * Analytics Controller for Concrete Mix Calculator Pro
 * Supports Google Analytics 4 (GA4) & Local Telemetry
 */

const GA_MEASUREMENT_ID = window.GA_MEASUREMENT_ID || 'G-CONCRETEDEMO';

// Initialize GA4 Script asynchronously
(function initGA() {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.info(`[Analytics] Running in local preview mode. Events will log to console.`);
    }

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, {
        page_title: document.title,
        page_location: window.location.href
    });
})();

/**
 * Custom Event Dispatcher
 */
function trackEvent(eventName, eventParams = {}) {
    if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, eventParams);
    }
    // Also log in debug mode
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log(`📊 [Analytics Event] ${eventName}:`, eventParams);
    }
}

// Global Export
window.MixAnalytics = {
    trackEvent,
    trackCalculate: (params) => trackEvent('calculate_mix', params),
    trackPreset: (presetName) => trackEvent('load_preset', { preset: presetName }),
    trackReportPrint: (grade) => trackEvent('print_report', { grade }),
    trackTabSwitch: (tabId) => trackEvent('tab_switch', { target_tab: tabId }),
    trackFaqToggle: (question) => trackEvent('faq_toggle', { question }),
    trackCaseStudy: (studyName) => trackEvent('case_study_click', { study: studyName })
};
