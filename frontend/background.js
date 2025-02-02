let processEnabled = false;  // Default state is 'disabled'

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "processEnabled") {
        // Update the processEnabled state based on the toggle
        processEnabled = request.enabled;
        console.log("Severity detection enabled:", processEnabled);
    }

    if (request.action === "fetchSeverity" && processEnabled) {
        // Proceed with fetching severity only if processEnabled is true
        fetch("http://127.0.0.1:5000/api/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: request.text })
        })
        .then(response => response.json())
        .then(data => sendResponse({ success: true, severity: data.severity }))
        .catch(error => sendResponse({ success: false, error: error.message }));

        return true; // Keeps the response channel open
    } else {
        sendResponse({ success: false, error: "Severity detection is disabled" });
    }
});
