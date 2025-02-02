chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fetchSeverity") {
        fetch("http://127.0.0.1:5000/api/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: request.text })
        })
        .then(response => response.json())
        .then(data => sendResponse({ success: true, severity: data.severity }))
        .catch(error => sendResponse({ success: false, error: error.message }));

        return true; // Keeps the response channel open
    }
});
