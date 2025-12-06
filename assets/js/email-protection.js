/**
 * Email protection from spam bots
 * Converts protected email spans into clickable mailto links
 * Security hardened to prevent XSS and injection attacks
 */
(function () {
    'use strict';

    /**
     * Sanitize string to prevent XSS
     * Only allows alphanumeric, dots, hyphens, underscores, and plus signs
     */
    function sanitizeEmailPart(str) {
        if (!str || typeof str !== 'string') {
            return '';
        }
        // Remove any HTML tags and dangerous characters
        // Allow only: letters, numbers, dots, hyphens, underscores, plus
        return str.replace(/[^a-zA-Z0-9.\-_+]/g, '');
    }

    /**
     * Validate email format
     */
    function isValidEmail(email) {
        if (!email || typeof email !== 'string') {
            return false;
        }
        // Basic email validation regex
        const emailRegex = /^[a-zA-Z0-9._\-+]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    /**
     * Safely get text content from element
     */
    function getElementText(element) {
        // Use textContent for security (not innerHTML)
        return element.textContent || element.innerText || '';
    }

    /**
     * Process protected email elements
     */
    function processProtectedEmails() {
        // Find all protected email elements
        const protectedEmails = document.querySelectorAll('.protected-email');

        protectedEmails.forEach(function (element) {
            try {
                // Get and sanitize data attributes
                const user = sanitizeEmailPart(element.getAttribute('data-user'));
                const domain = sanitizeEmailPart(element.getAttribute('data-domain'));
                const tld = sanitizeEmailPart(element.getAttribute('data-tld'));

                // Validate all parts exist
                if (!user || !domain || !tld) {
                    console.warn('Email protection: Missing data attributes');
                    return;
                }

                // Assemble email
                const email = user + '@' + domain + '.' + tld;

                // Validate email format
                if (!isValidEmail(email)) {
                    console.warn('Email protection: Invalid email format:', email);
                    return;
                }

                // Check if parent is already an anchor tag
                if (element.parentElement && element.parentElement.tagName !== 'A') {
                    // Create mailto link
                    const link = document.createElement('a');
                    link.href = 'mailto:' + encodeURI(email);
                    link.className = element.className;

                    // Use textContent for security (prevents XSS)
                    link.textContent = getElementText(element);

                    // Set accessibility label
                    link.setAttribute('aria-label', 'Send email to ' + email);
                    link.setAttribute('rel', 'noopener');

                    // Replace the span with the link
                    if (element.parentNode) {
                        element.parentNode.replaceChild(link, element);
                    }
                }
            } catch (error) {
                console.error('Email protection error:', error);
            }
        });

        // Handle protected email links (when already wrapped in <a>)
        const protectedEmailLinks = document.querySelectorAll('a[data-user][data-domain][data-tld]');

        protectedEmailLinks.forEach(function (link) {
            try {
                // Get and sanitize data attributes
                const user = sanitizeEmailPart(link.getAttribute('data-user'));
                const domain = sanitizeEmailPart(link.getAttribute('data-domain'));
                const tld = sanitizeEmailPart(link.getAttribute('data-tld'));

                // Validate all parts exist
                if (!user || !domain || !tld) {
                    console.warn('Email protection: Missing data attributes in link');
                    return;
                }

                // Assemble email
                const email = user + '@' + domain + '.' + tld;

                // Validate email format
                if (!isValidEmail(email)) {
                    console.warn('Email protection: Invalid email format in link:', email);
                    return;
                }

                // Set href and accessibility
                link.href = 'mailto:' + encodeURI(email);
                link.setAttribute('aria-label', 'Send email to ' + email);
                link.setAttribute('rel', 'noopener');
            } catch (error) {
                console.error('Email protection link error:', error);
            }
        });
    }

    /**
     * Process protected telegram elements
     */
    function processProtectedTelegram() {
        const protectedTelegram = document.querySelectorAll('.protected-telegram');

        protectedTelegram.forEach(function (element) {
            try {
                // Get and sanitize username
                const username = sanitizeEmailPart(element.getAttribute('data-username'));

                if (!username) {
                    console.warn('Telegram protection: Missing username');
                    return;
                }

                // Create link
                const link = document.createElement('a');
                link.href = 'https://t.me/' + encodeURIComponent(username);
                link.className = element.className;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';

                // Use textContent for security
                link.textContent = getElementText(element);

                link.setAttribute('aria-label', 'Telegram ' + username);

                // Replace the span with the link
                if (element.parentNode) {
                    element.parentNode.replaceChild(link, element);
                }

            } catch (error) {
                console.error('Telegram protection error:', error);
            }
        });
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            processProtectedEmails();
            processProtectedTelegram();
        });
    } else {
        // DOM is already ready
        processProtectedEmails();
        processProtectedTelegram();
    }
})();
