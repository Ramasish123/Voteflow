// chat.js - Logic for AI Communication using Groq (Frontend only)
const ChatLogic = {
  async sendMessage(message) {
    ChatUI.setLoading(true);
    const typingBubble = ChatUI.showTyping();
    
    const contextStr = this.getContext();
    
    try {
      const reply = await this.callGroqAPI(message, contextStr);
      ChatUI.updateMessage(typingBubble, reply);
    } catch (error) {
      console.error("AI API Error:", error);
      ChatUI.removeMessage(typingBubble);
      const fallbackReply = this.getFallbackReply(message, contextStr);
      ChatUI.addMessage('assistant', "⚠️ Connection error. Using offline fallback:\n\n" + fallbackReply);
    } finally {
      ChatUI.setLoading(false);
    }
  },

  getContext() {
    // Try to get from window object if exposed, else read DOM
    if (window.voteFlowState) {
       return JSON.stringify(window.voteFlowState);
    }
    // Fallback: Read from DOM inputs if available
    const isReg = document.getElementById("isRegistered")?.value || "false";
    const hasId = document.getElementById("hasVoterID")?.value || "false";
    const stage = document.getElementById("electionStage")?.value || "unknown";
    return `User isRegistered=${isReg}, hasVoterID=${hasId}, electionStage=${stage}.`;
  },

  async callGroqAPI(userMessage, context) {
    const url = "/api/chat";
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: userMessage,
        context: context
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(`API error: ${errData.error || response.statusText}`);
    }

    const data = await response.json();
    return data.reply;
  },

  getFallbackReply(message, context) {
    const q = message.toLowerCase();
    const isReg = context.includes('"isRegistered":true') || context.includes("isRegistered=true");
    
    if (q.includes("register")) {
      return isReg ? "You are already registered! Check your Voter ID." : "You can register online through the official portal with proof of age and address.";
    }
    if (q.includes("vote") || q.includes("day")) {
      return "On voting day, go to your designated polling booth and bring your accepted Voter ID.";
    }
    if (q.includes("id") || q.includes("document")) {
      return "You need a valid accepted ID to vote, like a Voter Card, Passport, or Aadhar.";
    }
    return `To better help you, please enter an API key above. Offline advice: Make sure you track your registration status and voting date!`;
  }
};
