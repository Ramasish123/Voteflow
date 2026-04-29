// chatUI.js - Handles DOM interactions for the floating chat
const ChatUI = {
  container: null,
  toggleBtn: null,
  closeBtn: null,
  form: null,
  input: null,
  log: null,

  init() {
    this.container = document.getElementById('floating-chat-container');
    this.toggleBtn = document.getElementById('chat-toggle-btn');
    this.closeBtn = document.getElementById('close-chat');
    this.form = document.getElementById('floating-chat-form');
    this.input = document.getElementById('floating-chat-input');
    this.log = document.getElementById('floating-chat-log');

    if (!this.container) return;

    this.toggleBtn.addEventListener('click', () => this.toggleChat());
    this.closeBtn.addEventListener('click', () => this.toggleChat());
    
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
    
    // Welcome message
    this.addMessage('assistant', "Hi! I'm your intelligent election assistant. How can I help you today?");
  },

  toggleChat() {
    this.container.classList.toggle('floating-chat-collapsed');
    if (!this.container.classList.contains('floating-chat-collapsed')) {
      this.input.focus();
    }
  },

  handleSubmit() {
    const rawText = this.input.value.trim();
    const text = this.sanitizeInputForSubmit(rawText);

    if (!text) {
      this.input.style.border = "1px solid var(--red)";
      setTimeout(() => { this.input.style.border = ""; }, 500);
      return;
    }
    
    this.input.value = '';
    this.addMessage('user', text);
    
    // Call ChatLogic
    if (typeof ChatLogic !== 'undefined') {
      ChatLogic.sendMessage(text);
    }
  },

  addMessage(role, text) {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${role}`;
    bubble.innerHTML = `<p>${this.escapeHtml(text)}</p>`;
    this.log.appendChild(bubble);
    this.scrollToBottom();
    return bubble;
  },

  showTyping() {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble assistant typing`;
    bubble.innerHTML = `<p>Typing...</p>`;
    this.log.appendChild(bubble);
    this.scrollToBottom();
    return bubble;
  },

  updateMessage(bubble, text) {
    bubble.classList.remove('typing');
    bubble.innerHTML = `<p>${this.escapeHtml(text)}</p>`;
    this.scrollToBottom();
  },

  removeMessage(bubble) {
    if (bubble && bubble.parentNode) {
      bubble.parentNode.removeChild(bubble);
    }
  },

  scrollToBottom() {
    this.log.scrollTop = this.log.scrollHeight;
  },

  setLoading(isLoading) {
    this.input.disabled = isLoading;
    const btn = this.form.querySelector('button');
    btn.disabled = isLoading;
    if (isLoading) {
      btn.style.opacity = '0.5';
    } else {
      btn.style.opacity = '1';
      this.input.focus();
    }
  },

  escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  },

  sanitizeInputForSubmit(input) {
    if (!input) return "";
    return input
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
};

document.addEventListener('DOMContentLoaded', () => {
  ChatUI.init();
});
