// Translation API configuration
const API_CONFIG = {
  baseURL: 'https://api.mymemory.translated.net/get',
  timeout: 10000
};

// Debounce function to prevent excessive API calls
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// Show notification with auto-hide
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
    color: white;
    padding: 16px 24px;
    border-radius: 4px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    z-index: 1000;
    animation: slideIn 0.3s ease-in-out;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-in-out';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Main translation function with error handling
async function translateText() {
  try {
    // Get DOM elements
    const inputElement = document.getElementById('inputText');
    const fromLangElement = document.getElementById('fromLang');
    const toLangElement = document.getElementById('toLang');
    const outputElement = document.getElementById('outputText');
    const translateBtn = document.querySelector('[onclick="translateText()"]');

    // Validate inputs
    if (!inputElement || !fromLangElement || !toLangElement || !outputElement) {
      showNotification('Error: Required HTML elements not found', 'error');
      console.error('Missing required DOM elements');
      return;
    }

    const text = inputElement.value.trim();
    const from = fromLangElement.value;
    const to = toLangElement.value;

    // Input validation
    if (!text) {
      showNotification('Please enter text to translate', 'error');
      return;
    }

    if (!from || !to) {
      showNotification('Please select both languages', 'error');
      return;
    }

    if (from === to) {
      showNotification('Source and target languages must be different', 'error');
      return;
    }

    // Disable button and show loading state
    if (translateBtn) {
      translateBtn.disabled = true;
      translateBtn.textContent = 'Translating...';
    }

    outputElement.innerHTML = '<span style="color: #999;">Loading...</span>';

    // Fetch translation with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

    const response = await fetch(
      `${API_CONFIG.baseURL}?q=${encodeURIComponent(text)}&langpair=${from}|${to}`,
      { signal: controller.signal }
    );

    clearTimeout(timeoutId);

    // Handle HTTP errors
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Handle API response errors
    if (data.responseStatus !== 200) {
      throw new Error(data.responseDetails || 'Translation failed');
    }

    // Handle empty translation
    if (!data.responseData || !data.responseData.translatedText) {
      showNotification('Could not translate the text. Please try again.', 'error');
      outputElement.textContent = '';
      return;
    }

    // Display translated text (use textContent for security)
    outputElement.textContent = data.responseData.translatedText;
    showNotification('Translation completed successfully', 'success');

    // Log translation for debugging
    console.log(`Translated from ${from} to ${to}: ${text.substring(0, 50)}...`);

  } catch (error) {
    // Handle different error types
    if (error.name === 'AbortError') {
      showNotification('Translation request timed out. Please try again.', 'error');
    } else if (error instanceof TypeError) {
      showNotification('Network error. Please check your connection.', 'error');
    } else {
      showNotification(`Error: ${error.message}`, 'error');
    }
    
    console.error('Translation error:', error);
    document.getElementById('outputText').textContent = '';

  } finally {
    // Re-enable button
    const translateBtn = document.querySelector('[onclick="translateText()"]');
    if (translateBtn) {
      translateBtn.disabled = false;
      translateBtn.textContent = 'Translate';
    }
  }
}

// Copy text with enhanced feedback
async function copyText() {
  try {
    const outputElement = document.getElementById('outputText');
    
    if (!outputElement) {
      showNotification('Error: Output element not found', 'error');
      return;
    }

    const text = outputElement.textContent.trim();

    if (!text) {
      showNotification('Nothing to copy. Translate something first.', 'error');
      return;
    }

    // Use modern Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      showNotification('Copied to clipboard!', 'success');
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      showNotification('Copied to clipboard!', 'success');
    }

  } catch (error) {
    showNotification('Failed to copy text', 'error');
    console.error('Copy error:', error);
  }
}

// Clear all fields
function clearFields() {
  try {
    document.getElementById('inputText').value = '';
    document.getElementById('outputText').textContent = '';
    showNotification('Fields cleared', 'info');
  } catch (error) {
    console.error('Clear error:', error);
  }
}

// Swap languages
function swapLanguages() {
  try {
    const fromLang = document.getElementById('fromLang');
    const toLang = document.getElementById('toLang');

    if (!fromLang || !toLang) {
      showNotification('Error: Language elements not found', 'error');
      return;
    }

    const temp = fromLang.value;
    fromLang.value = toLang.value;
    toLang.value = temp;

    showNotification('Languages swapped', 'info');
  } catch (error) {
    console.error('Swap error:', error);
  }
}

// Auto-translate with debounce (optional feature)
const debouncedTranslate = debounce(translateText, 500);

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('Translation app initialized');
  
  // Add enter key support for translation
  const inputText = document.getElementById('inputText');
  if (inputText) {
    inputText.addEventListener('keypress', function(event) {
      if (event.key === 'Enter' && event.ctrlKey) {
        translateText();
      }
    });
  }
});
  
