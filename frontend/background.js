chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "analyzeText" && message.text) {
      // Send the text to the AI API for analysis
      fetch("http://127.0.0.1:5000/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: message.text }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("[Background] Received data from API:", data);
  
          // Send back the score to highlight text
          chrome.runtime.sendMessage({
            action: "highlightText",
            score: data.score, // Send score instead of severity
            text: message.text,
          });
  
          // Ensure the message port stays open while waiting for the response
          sendResponse({ status: "done", score: data.score }); // Include score in the response
        })
        .catch((error) => {
          console.error("Error calling AI API:", error);
          sendResponse({ status: "error", message: error.message });
        });
  
      // Keep the message channel open for async response
      return true;
    } else {
      console.warn("[Background] Unknown message received:", message.action);
    }
  });