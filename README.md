# 🗳️ VoteFlow — Your Election Journey Simplified

> A Smart, Context-Aware Decision Engine & AI Assistant empowering citizens to navigate the election process with confidence.

---

## 🚀 Overview

**VoteFlow** isn't just a static information page; it is a dynamic, context-aware **Decision Engine**. We transform complex election procedures into a streamlined, guided journey—adapting in real-time to your specific registration status, ID availability, and the current stage of the election. 

By integrating a state-of-the-art **Frontend AI Chat Assistant** powered by Groq, VoteFlow ensures that first-time voters and general citizens always have personalized, instant, and accurate answers, ensuring their voice is heard without the hassle.

---

## ✨ Key Features

- **Smart Decision Engine:** Real-time adaptation. The UI dynamically changes depending on whether you are registered, have an ID, or what stage the election is currently in.
- **Context-Aware AI Assistant:** A floating in-page AI Chatbot powered by **Groq** (`llama-3.3-70b-versatile`). It reads your current state to provide hyper-personalized, step-by-step guidance.
- **Offline Fallback System:** Built for resilience. If the AI API connection fails, the assistant seamlessly degrades to a local FAQ-mapping system without crashing.
- **Full-Stack Simulation Backend:** A lightweight Express/Node.js API manages and synchronizes user state, giving a true full-stack feel.
- **Scenario Simulators:** Easily simulate different real-world conditions (e.g., missing registration vs. voting day) to see how the guidance adapts.

---

## 🧠 Architecture & Logic

VoteFlow is built on a decoupled, intelligent architecture:

1. **State Management (`server.js` & `app.js`):** A centralized `userState` object tracks critical context (`isRegistered`, `hasVoterID`, `electionStage`).
2. **Dynamic UI Rendering:** The decision engine evaluates the state and injects the appropriate actionable cards into the UI.
3. **AI Integration (`chat.js` & `chatUI.js`):** The floating assistant injects the `userState` directly into its hidden system prompts, allowing it to know exactly what you need before you even ask.

---

## 🛠 Tech Stack

- **Frontend:** HTML5, Vanilla CSS (Custom Design System), JavaScript (ES6)
- **Backend API:** Node.js, Express, CORS
- **AI / LLM:** Groq API (`llama-3.3-70b-versatile`)
- **Architecture:** Client-Server State Synchronization, Event-Driven UI

---

## 📂 Installation / Run Locally

Getting VoteFlow up and running is incredibly simple.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/voteflow.git
   cd voteflow
   ```

2. **Install Backend Dependencies:**
   ```bash
   npm install
   ```

3. **Start the Backend Server:**
   ```bash
   npm start
   # Starts the Express API on http://localhost:3000
   ```

4. **Launch the Application:**
   Open `index.html` in your favorite web browser. 

---

## 🎯 Hackathon Highlights for Judges

- **No Hardcoded Fragility:** The AI assistant features a robust `try/catch` fallback mechanism. If rate limits are hit or the API goes down, it switches to offline mode seamlessly.
- **Prompt Engineering:** The system uses invisible system prompts injected with real-time app state to ensure the LLM doesn't hallucinate irrelevant election advice.
- **Clean Architecture:** Strict separation of concerns (UI manipulation vs. API logic vs. State management).
- **Beautiful UI/UX:** A custom-built, modern interface with smooth micro-interactions, CSS grids, and premium dashboard aesthetics.

---

## 🤝 Contribution

We welcome contributions! If you'd like to help make voting more accessible, please feel free to fork the repository, submit a pull request, or open an issue for discussion.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
