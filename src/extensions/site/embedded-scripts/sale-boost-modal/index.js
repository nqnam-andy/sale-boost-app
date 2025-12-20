// Parse JSON strings if they are wrapped in quotes
function parseValue(value) {
  if (!value) return "";
  try {
    const parsed = JSON.parse(value);
    const dataParse = typeof parsed === "string" ? parsed : value;
    return dataParse.replaceAll(/\\/g, "");
  } catch {
    return value.replaceAll(/\\/g, "");
  }
}

// Get data from the popup-data element
function getPopupData() {
  const popupDataElement = document.getElementById("popup-data");
  if (!popupDataElement) return null;

  const data = {
    hideOnBackdropClick:
      popupDataElement.getAttribute("data-hide-on-backdrop-click") || "0",
    body: popupDataElement.getAttribute("data-body") || "",
    showCloseButton:
      popupDataElement.getAttribute("data-show-close-button") || "1",
    popupDelay: popupDataElement.getAttribute("data-popup-delay") || "0",
    textColor: popupDataElement.getAttribute("data-text-color") || "#000000",
    buttonColor:
      popupDataElement.getAttribute("data-button-color") || "#c62828",
    link: popupDataElement.getAttribute("data-link") || "",
    header: popupDataElement.getAttribute("data-header") || "",
    buttonLabel: popupDataElement.getAttribute("data-button-label") || "",
    imageLink: popupDataElement.getAttribute("data-image-link") || "",
    imageUrl: popupDataElement.getAttribute("data-image-url") || "",
    visibility: popupDataElement.getAttribute("data-visibility") || "ALL",
    action: popupDataElement.getAttribute("data-action") || "NEW_TAB",
    plan: popupDataElement.getAttribute("data-plan") || "MEDIUM",
  };

  // Parse all values
  return {
    hideOnBackdropClick: parseValue(data.hideOnBackdropClick),
    body: parseValue(data.body),
    showCloseButton: parseValue(data.showCloseButton),
    textColor: parseValue(data.textColor),
    buttonColor: parseValue(data.buttonColor),
    link: parseValue(data.link),
    header: parseValue(data.header),
    buttonLabel: parseValue(data.buttonLabel),
    imageLink: parseValue(data.imageLink),
    imageUrl: parseValue(data.imageUrl),
    visibility: parseValue(data.visibility),
    action: parseValue(data.action),
    plan: parseValue(data.plan),
    popupDelay: data.popupDelay,
  };
}

// Create popup HTML
function createPopupHTML(popupData) {
  const closeButton =
    popupData.showCloseButton === "1"
      ? '<button class="popup-close-button" aria-label="Close">×</button>'
      : "";

  const imageHTML = popupData.imageUrl
    ? `<div class="popup-image-wrapper" ${
        popupData.imageLink ? 'style="cursor: pointer;"' : ""
      }>
            <img src="${escapeHtml(popupData.imageUrl)}" alt="Sale" />
          </div>`
    : "";

  const buttonHTML = popupData.buttonLabel
    ? `<button class="popup-button" style="background-color: ${escapeHtml(
        popupData.buttonColor || "#c62828"
      )}; color: #ffffff;">
            ${escapeHtml(popupData.buttonLabel)}
          </button>`
    : "";

  // Header can contain HTML (like emojis), so we don't escape it
  const headerHTML = popupData.header || "";

  return `
        <div class="popup-overlay">
          <div class="popup-modal">
            ${closeButton}
            ${imageHTML}
            <div class="popup-content" style="color: ${escapeHtml(
              popupData.textColor || "#333333"
            )};">
              <h2 class="popup-header" style="color: ${escapeHtml(
                popupData.textColor || "#000000"
              )};">
                ${headerHTML}
              </h2>
              <p class="popup-body">${escapeHtml(popupData.body)}</p>
              ${buttonHTML}
            </div>
          </div>
        </div>
      `;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Handle close
function handleClose(overlay) {
  if (overlay && overlay.parentNode) {
    overlay.parentNode.removeChild(overlay);
  }
}

// Handle backdrop click
function handleBackdropClick(e, popupData, overlay) {
  if (
    popupData.hideOnBackdropClick === "1" &&
    e.target.classList.contains("popup-overlay")
  ) {
    handleClose(overlay);
  }
}

// Handle button click
function handleButtonClick(popupData, overlay) {
  if (!popupData.link) return;

  if (popupData.action === "NEW_TAB") {
    window.open(popupData.link, "_blank", "noopener,noreferrer");
  } else {
    window.location.href = popupData.link;
  }

  // handleClose(overlay);
}

// Handle image click
function handleImageClick(popupData, overlay) {
  if (!popupData.imageLink) return;

  if (popupData.action === "NEW_TAB") {
    window.open(popupData.imageLink, "_blank", "noopener,noreferrer");
  } else {
    window.location.href = popupData.imageLink;
  }

  handleClose(overlay);
}

// Check if device is mobile based on screen width
function isMobileDevice() {
  return window.innerWidth <= 768;
}

// Check if modal should be shown based on visibility setting
function shouldShowModal(visibility) {
  if (visibility === "ALL") {
    return true;
  }
  if (visibility === "DESKTOP") {
    return !isMobileDevice();
  }
  if (visibility === "MOBILE") {
    return isMobileDevice();
  }
  // Default to showing if visibility value is invalid
  return true;
}

// Initialize popup
function initPopup() {
  const popupData = getPopupData();
  console.log("popupData ===>", { popupData });

  if (!popupData) return;

  // Check visibility setting before showing modal
  if (!shouldShowModal(popupData.visibility)) {
    return;
  }

  const container = document.getElementById("site-popup");
  if (!container) return;

  // Show popup after delay
  const delay = parseInt(popupData.popupDelay) || 0;

  setTimeout(() => {
    container.innerHTML = createPopupHTML(popupData);
    const overlay = container.querySelector(".popup-overlay");
    if (!overlay) return;

    // Close button handler
    const closeButton = overlay.querySelector(".popup-close-button");
    if (closeButton) {
      closeButton.addEventListener("click", () => {
        handleClose(overlay);
      });
    }

    // Backdrop click handler
    overlay.addEventListener("click", (e) => {
      handleBackdropClick(e, popupData, overlay);
    });

    // Button click handler
    const button = overlay.querySelector(".popup-button");
    if (button) {
      button.addEventListener("click", () => {
        handleButtonClick(popupData, overlay);
      });
    }

    // Image click handler
    const imageContainer = overlay.querySelector(".popup-image-wrapper");
    if (imageContainer && popupData.imageLink) {
      imageContainer.addEventListener("click", () => {
        handleImageClick(popupData, overlay);
      });
    }
  }, delay * 1000);
}

// Wait for DOM to be ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPopup);
} else {
  initPopup();
}
