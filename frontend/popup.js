document.getElementById('processToggle').addEventListener('change', (event) => {
    const isEnabled = event.target.checked;
    chrome.runtime.sendMessage({ type: "processEnabled", enabled: isEnabled });
});

document.getElementById('nudityToggle').addEventListener('change', (event) => {
    const isEnabled = event.target.checked;
    chrome.runtime.sendMessage({ type: "nudityEnabled", enabled: isEnabled });
});
