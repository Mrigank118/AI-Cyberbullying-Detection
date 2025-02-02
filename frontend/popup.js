document.addEventListener("DOMContentLoaded", () => {
    const bullyToggle = document.getElementById("bullyToggle");
    const nudityToggle = document.getElementById("nudityToggle");

    // Load saved states
    chrome.storage.sync.get(["bullyEnabled", "nudityEnabled"], (data) => {
        bullyToggle.checked = data.bullyEnabled ?? false;
        nudityToggle.checked = data.nudityEnabled ?? false;
    });

    // Toggle Cyberbullying Detection
    bullyToggle.addEventListener("change", () => {
        chrome.storage.sync.set({ bullyEnabled: bullyToggle.checked });
    });

    // Toggle Nudity Removal
    nudityToggle.addEventListener("change", () => {
        chrome.storage.sync.set({ nudityEnabled: nudityToggle.checked });
    });
});
document.addEventListener("DOMContentLoaded", () => {
    const bullyToggle = document.getElementById("bullyToggle");
    const nudityToggle = document.getElementById("nudityToggle");

    // Load saved states
    chrome.storage.sync.get(["bullyEnabled", "nudityEnabled"], (data) => {
        bullyToggle.checked = data.bullyEnabled ?? false;
        nudityToggle.checked = data.nudityEnabled ?? false;
    });

    // Toggle Cyberbullying Detection
    bullyToggle.addEventListener("change", () => {
        chrome.storage.sync.set({ bullyEnabled: bullyToggle.checked });
    });

    // Toggle Nudity Removal
    nudityToggle.addEventListener("change", () => {
        chrome.storage.sync.set({ nudityEnabled: nudityToggle.checked });
    });
});
