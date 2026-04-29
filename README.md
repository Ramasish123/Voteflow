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
- **Pure Frontend Architecture:** A robust client-side state management system tracks user context without the need for a complex backend, making it incredibly fast and easy to deploy.
- **Scenario Simulators:** Easily simulate different real-world conditions (e.g., missing registration vs. voting day) to see how the guidance adapts.

---

## 🧠 Architecture & Logic

VoteFlow is built on a decoupled, intelligent architecture:

1. **State Management (`app.js`):** A centralized `userState` object tracks critical context entirely within the browser (`isRegistered`, `hasVoterID`, `electionStage`).
2. **Dynamic UI Rendering:** The decision engine evaluates the state and injects the appropriate actionable cards into the UI.
3. **AI Integration (`chat.js` & `chatUI.js`):** The floating assistant injects the `userState` directly into its hidden system prompts, allowing it to know exactly what you need before you even ask.

---

## 🛠 Tech Stack

- **Frontend:** HTML5, Vanilla CSS (Custom Design System), JavaScript (ES6)
- **AI / LLM:** Groq API (`llama-3.3-70b-versatile`)
- **Architecture:** Client-Side State Management, Event-Driven UI
- **Deployment:** Pure static frontend (ready for GitHub Pages, Netlify, Vercel)

---

## 📂 Installation / Run Locally

Getting VoteFlow up and running is incredibly simple.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/voteflow.git
   cd voteflow
   ```

2. **Launch the Application:**
   Simply open `index.html` in your favorite web browser. No complex build steps or local server required! 

---

## 🎯 Hackathon Highlights for Judges

- **No Hardcoded Fragility:** The AI assistant features a robust `try/catch` fallback mechanism. If rate limits are hit or the API goes down, it switches to offline mode seamlessly.
- **Prompt Engineering:** The system uses invisible system prompts injected with real-time app state to ensure the LLM doesn't hallucinate irrelevant election advice.
- **Clean Architecture:** Strict separation of concerns (UI manipulation vs. State management vs. AI logic).
- **Beautiful UI/UX:** A custom-built, modern interface with smooth micro-interactions, CSS grids, and premium dashboard aesthetics.

---

## 🤝 Contribution

We welcome contributions! If you'd like to help make voting more accessible, please feel free to fork the repository, submit a pull request, or open an issue for discussion.

---

## 📸 Screenshots

<img width="1710" height="1112" alt="Screenshot 2026-04-29 at 2 37 19 PM" src="https://github.com/user-attachments/assets/a1887ae0-18f4-4d54-be13-3b2cff08a4f4" />
<img width="1710" height="1112" alt="Screenshot 2026-04-29 at 2 50 47 PM" src="https://github.com/user-attachments/assets/fdd2c4a6-8100-4c2c-a228-9f6bccb3688a" />
<img width="1710" height="1112" alt="image" src="https://github.com/user-attachments/assets/881d9c86-b7b2-41d0-b9a0-f8584de559f0" />
<img width="1710" height="1112" alt="Screenshot 2026-04-29 at 2 37 57 PM" src="https://github.com/user-attachments/assets/e55c7df5-bdfb-4dd5-952f-98b2e68d8e9e" />


---
## 📄 License

This project is licensed under the [MIT License](LICENSE).
