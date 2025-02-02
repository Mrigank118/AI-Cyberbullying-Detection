// Color coding based on toxicity score
const highlightColors = {
  green: "rgba(0, 255, 0, 0.3)",     // Green for safe (low toxicity)
  yellow: "rgba(255, 255, 0, 0.5)",  // Yellow for moderate toxicity
  red: "rgba(255, 0, 0, 0.5)",       // Red for high toxicity
  pink: "rgb(255, 255, 255)",        // Pink for all extracted texts
};

// Function to determine color category based on toxicity score
function getSeverityColor(score) {
  if (score > 0.9) return 'red';        // High toxicity
  if (score > 0.8 && score < 0.7) return 'yellow'; // Moderate toxicity
  if (score > 0.7 && score < 0.6) return 'green';  // Low toxicity
}

// Track the number of red-highlighted messages in each thread
const redMessageCounts = new Map();

console.log("[LinkedIn Harassment Detector] Content script loaded successfully!");

// Function to extract and send text to the background script
function extractAndSendText() {
  console.log("[extractAndSendText] Running text extraction...");

  const messageElements = document.querySelectorAll(".msg-s-event-listitem__body, .msg-s-message-group__message");
  console.log(`[extractAndSendText] Found ${messageElements.length} message elements.`);

  messageElements.forEach((messageElement, index) => {
    const text = messageElement.innerText.trim();
    console.log(`[extractAndSendText] Processing message #${index + 1}: "${text}"`);

    // Skip processing if the message already has a background color
    if (messageElement.style.backgroundColor && messageElement.style.backgroundColor !== highlightColors.pink) {
      console.log(`[extractAndSendText] Message #${index + 1} is already colored. Skipping.`);
      return;
    }

    // Apply pink background to all extracted texts
    messageElement.style.backgroundColor = highlightColors.pink;
    messageElement.style.borderRadius = "5px";
    messageElement.style.padding = "5px";
    messageElement.style.display = "inline-block"; // Ensures layout stays correct

    if (text) {
      chrome.runtime.sendMessage({ action: "analyzeText", text }, (response) => {
        if (chrome.runtime.lastError) {
          console.error("[extractAndSendText] Error sending message:", chrome.runtime.lastError);
        } else {
          console.log("[extractAndSendText] Message sent successfully.", response);

          // Ensure response contains a valid toxicity score
          if (response && response.score !== undefined) {
            const severityColor = getSeverityColor(response.score); // Convert score to color category
            console.log(`[extractAndSendText] Severity color: ${severityColor}`);

            // Override pink background with toxicity-based color
            messageElement.style.backgroundColor = highlightColors[severityColor];

            // Change text color for contrast
            messageElement.style.color = severityColor === 'red' ? 'white' : 'black';
            messageElement.style.fontWeight = "bold";

            // Track red-highlighted messages
            if (severityColor === 'red') {
              const threadContainer = messageElement.closest(".thread-detail-jump-target");
              if (threadContainer) {
                const threadId = threadContainer.id || threadContainer.dataset.threadId;
                if (!threadId) {
                  console.warn("[extractAndSendText] Thread ID not found.");
                  return;
                }

                // Increment the red message count for this thread
                const currentCount = redMessageCounts.get(threadId) || 0;
                redMessageCounts.set(threadId, currentCount + 1);

                // If 5 or more red messages, mark the thread
                if (currentCount + 1 >= 5) {
                  markThreadAsToxic(threadContainer);
                }
              }
            }
          } else {
            console.warn("[extractAndSendText] No valid score received in response.");
          }
        }
      });
    } else {
      console.warn(`[extractAndSendText] Skipped empty message #${index + 1}`);
    }
  });
}

// Function to mark a thread as toxic
function markThreadAsToxic(threadContainer) {
  console.log("[markThreadAsToxic] Marking thread as toxic.");

  // Add a label or exclamation mark to the thread container
  const warningLabel = document.createElement("span");
  warningLabel.textContent = "⚠️ TOXIC THREAD";
  warningLabel.style.color = "red";
  warningLabel.style.fontWeight = "bold";
  warningLabel.style.marginLeft = "10px";
  warningLabel.style.fontSize = "14px";

  // Append the label to the thread container
  threadContainer.appendChild(warningLabel);
}

// Function to highlight text based on severity color
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("[onMessage] Received message:", message);

  if (message.action === "highlightText") {
    const { severityColor, text } = message;
    console.log(`[onMessage] Highlighting text: "${text}" with color: "${severityColor}"`);

    const messageElements = document.querySelectorAll(".msg-s-event-listitem__body, .msg-s-message-group__message");

    messageElements.forEach((messageElement, index) => {
      const messageText = messageElement.innerText.trim();

      // Use `includes` for flexible matching
      if (messageText.includes(text)) {
        console.log(`[onMessage] Match found in message #${index + 1}. Applying highlight.`);

        // Apply background color & keep original styles intact
        messageElement.style.backgroundColor = highlightColors[severityColor];
        messageElement.style.borderRadius = "5px";
        messageElement.style.padding = "5px";
        messageElement.style.display = "inline-block"; // Ensures layout stays correct

        // Change text color for contrast
        messageElement.style.color = severityColor === 'red' ? 'white' : 'black';
        messageElement.style.fontWeight = "bold";
      } else {
        console.log(`[onMessage] No match found in message #${index + 1}.`);
      }
    });

    sendResponse({ status: "highlighted", text, severityColor });
  } else {
    console.warn("[onMessage] Unknown action received:", message.action);
  }
});

// Run the text extraction every 5 seconds
console.log("[LinkedIn Harassment Detector] Starting text extraction loop...");
setInterval(() => {
  console.log("[setInterval] Triggering text extraction...");
  extractAndSendText();
}, 5000);