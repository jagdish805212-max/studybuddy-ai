# 🎓 StudyBuddy AI — AI Assistant for Your Friend

> **Study smarter. Stress less.**  
> A personalized, privacy-friendly AI study companion designed to help students organize tasks, generate optimized study schedules, and stay focused.

---

## ✨ Features

- 🤖 **Personalized AI Profile**: Customize for student name, academic course, and daily available study hours.
- 📝 **Interactive Task Management**: Add, track, complete, and delete assignments with automatic urgency tracking (*Due Today*, *Due Tomorrow*, *Overdue*).
- ⚡ **Dynamic AI Recommendation**: Real-time hero card analyzing deadline pressure and task priority weights to recommend the best next task.
- 🎯 **AI Study Planner**: Formulates tailored 45-minute focus blocks and 15-minute breaks with science-backed study tips (Pomodoro, Active Recall, Spaced Repetition).
- 💬 **Contextual AI Chat Assistant**: Ask study schedule questions, get quick prompts (*"What should I study first?"*, *"Study tips"*, *"Schedule help"*), and receive encouragement.
- 🔒 **Privacy Focused**: Operates entirely in the browser using `localStorage` — no personal data is uploaded to external servers.

---

## 🚀 Quick Start

### Option 1: Direct in Browser
Simply double-click or open **`index.html`** in any web browser (Chrome, Edge, Firefox, Safari).

### Option 2: Local HTTP Server (PowerShell)
Run the included lightweight PowerShell server:
```powershell
powershell -ExecutionPolicy Bypass -File .\server.ps1 -Port 5500
```
Then visit: [http://localhost:5500](http://localhost:5500)

---

## 📁 Project Structure

```text
StudyBuddy AI/
├── index.html       # Semantic HTML5 app structure and UI components
├── style.css        # Responsive styling, modern cards, and Indigo design system
├── script.js        # Core logic: profile, task management, planner, and AI chatbot
├── server.ps1       # Lightweight local HTTP server script
└── README.md        # Project documentation
```

---

## 🛠️ Built With

- **HTML5 & CSS3** (Vanilla, CSS Variables, Flexbox & Grid)
- **JavaScript (ES6+)**
- **Google Fonts** (Plus Jakarta Sans)
- **Local Storage API**
