let processEnabled = false;  // Default state is 'disabled'

// Listen for messages from the background script to change the processEnabled state
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "processEnabled") {
        processEnabled = request.enabled;
        console.log("Content script - Severity detection:", processEnabled ? "Enabled" : "Disabled");
    }
});

// Function to request severity from background.js
async function getSeverity(text) {
    return new Promise(resolve => {
        chrome.runtime.sendMessage({ action: "fetchSeverity", text: text }, response => {
            if (response.success) resolve(response.severity);
            else {
                console.error("❌ API Error:", response.error);
                resolve(null);
            }
        });
    });
}

// Function to update message text color based on severity
async function updateMessagesColor() {
    const messageBubbles = document.querySelectorAll('.msg-s-event-listitem__message-bubble');

    for (const bubble of messageBubbles) {
        const textElement = bubble.querySelector('p.msg-s-event-listitem__body');
        if (!textElement) continue;

        const messageText = textElement.innerText.trim();
        if (!messageText) continue;

        console.log("📩 Extracted:", messageText);

        // Only fetch severity if processEnabled is true
        if (processEnabled) {
            const severity = await getSeverity(messageText);
            if (severity === null) continue;

            // Set text color based on severity (values are between 0-1)
            if (severity >= 0.8) {
                textElement.style.color = 'red';  // High severity
            } else if (severity >= 0.5) {
                textElement.style.color = 'orange';  // Medium severity
            } else {
                textElement.style.color = '';  // Reset to default for low severity
            }
        }
    }
}

// Run every 5 seconds if process is enabled
setInterval(() => {
    if (processEnabled) {
        updateMessagesColor();
    }
}, 5000);
