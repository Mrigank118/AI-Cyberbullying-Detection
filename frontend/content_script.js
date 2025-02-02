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

// Function to update message colors
async function updateMessagesColor() {
    const messageBubbles = document.querySelectorAll('.msg-s-event-listitem__message-bubble');

    for (const bubble of messageBubbles) {
        const textElement = bubble.querySelector('p.msg-s-event-listitem__body');
        if (!textElement) continue;

        const messageText = textElement.innerText.trim();
        if (!messageText) continue;

        console.log("📩 Extracted:", messageText);

        const severity = await getSeverity(messageText);
        if (severity === null) continue;

        let color = severity >= 8 ? 'red' : severity >= 5 ? 'orange' : 'green';
        bubble.style.backgroundColor = color;
    }
}

// Run every 5 seconds
setInterval(updateMessagesColor, 5000);
