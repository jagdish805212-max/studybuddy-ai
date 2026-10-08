// ==========================================================================
// StudyBuddy AI — Interactive Engine & AI Study Assistant
// ==========================================================================

// Initial sample data if storage is empty
const DEFAULT_PROFILE = {
    name: "Alex",
    course: "Computer Science",
    hours: 4
};

const DEFAULT_TASKS = [
    {
        id: "task-1",
        name: "Mathematics: Calculus Problem Set",
        deadline: getRelativeDate(1), // Tomorrow
        difficulty: "High",
        completed: false
    },
    {
        id: "task-2",
        name: "Data Structures: Binary Search Trees Review",
        deadline: getRelativeDate(2), // In 2 days
        difficulty: "Medium",
        completed: false
    },
    {
        id: "task-3",
        name: "Read Chapter 4: Operating System Scheduling",
        deadline: getRelativeDate(4), // In 4 days
        difficulty: "Low",
        completed: false
    }
];

// State
let profile = { name: "", course: "", hours: 4 };
let tasks = [];

// Helper to calculate relative date YYYY-MM-DD
function getRelativeDate(daysFromNow) {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    return d.toISOString().split("T")[0];
}

// Format date for readable display
function formatReadableDate(dateString) {
    if (!dateString) return "No deadline";
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateString);
    target.setHours(0, 0, 0, 0);

    const diffDays = Math.round((target - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return `Overdue (${Math.abs(diffDays)}d ago)`;
    } else if (diffDays === 0) {
        return "Due Today 🔥";
    } else if (diffDays === 1) {
        return "Due Tomorrow ⚡";
    } else {
        return `Due in ${diffDays} days (${target.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })})`;
    }
}

// --------------------------------------------------------------------------
// Initialization
// --------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    loadProfile();
    loadTasks();
    updateHeroRecommendation();
});

// --------------------------------------------------------------------------
// Profile Management
// --------------------------------------------------------------------------
function loadProfile() {
    const saved = localStorage.getItem("studybuddy_profile");
    if (saved) {
        try {
            profile = JSON.parse(saved);
        } catch (e) {
            profile = { ...DEFAULT_PROFILE };
        }
    } else {
        profile = { ...DEFAULT_PROFILE };
        localStorage.setItem("studybuddy_profile", JSON.stringify(profile));
    }

    const nameInput = document.getElementById("studentName");
    const courseInput = document.getElementById("course");
    const hoursInput = document.getElementById("studyHours");

    if (nameInput) nameInput.value = profile.name || "";
    if (courseInput) courseInput.value = profile.course || "";
    if (hoursInput) hoursInput.value = profile.hours || 4;
}

function saveProfile() {
    const nameInput = document.getElementById("studentName");
    const courseInput = document.getElementById("course");
    const hoursInput = document.getElementById("studyHours");
    const messageEl = document.getElementById("profileMessage");

    const name = nameInput.value.trim();
    const course = courseInput.value.trim();
    const hours = parseInt(hoursInput.value, 10);

    if (!name) {
        showMessage(messageEl, "Please enter your friend's name.", "error");
        return;
    }
    if (!hours || hours < 1 || hours > 24) {
        showMessage(messageEl, "Please enter a valid study duration (1-24 hours).", "error");
        return;
    }

    profile = {
        name: name,
        course: course || "General Studies",
        hours: hours
    };

    localStorage.setItem("studybuddy_profile", JSON.stringify(profile));
    showMessage(messageEl, `✨ Profile saved for ${profile.name}!`, "success");
    updateHeroRecommendation();
}

function showMessage(el, text, type) {
    if (!el) return;
    el.textContent = text;
    el.className = type;
    setTimeout(() => {
        el.textContent = "";
        el.className = "";
    }, 3500);
}

// --------------------------------------------------------------------------
// Tasks Management
// --------------------------------------------------------------------------
function loadTasks() {
    const saved = localStorage.getItem("studybuddy_tasks");
    if (saved) {
        try {
            tasks = JSON.parse(saved);
        } catch (e) {
            tasks = [...DEFAULT_TASKS];
        }
    } else {
        tasks = [...DEFAULT_TASKS];
        localStorage.setItem("studybuddy_tasks", JSON.stringify(tasks));
    }
    renderTasks();
}

function saveTasksToStorage() {
    localStorage.setItem("studybuddy_tasks", JSON.stringify(tasks));
    renderTasks();
    updateHeroRecommendation();
}

function addTask() {
    const taskNameInput = document.getElementById("taskName");
    const deadlineInput = document.getElementById("deadline");
    const difficultySelect = document.getElementById("difficulty");

    const name = taskNameInput.value.trim();
    const deadline = deadlineInput.value || getRelativeDate(1);
    const difficulty = difficultySelect.value || "Medium";

    if (!name) {
        alert("Please enter a task or assignment name.");
        taskNameInput.focus();
        return;
    }

    const newTask = {
        id: "task-" + Date.now(),
        name: name,
        deadline: deadline,
        difficulty: difficulty,
        completed: false
    };

    tasks.unshift(newTask);
    saveTasksToStorage();

    // Reset inputs
    taskNameInput.value = "";
    deadlineInput.value = "";
    difficultySelect.value = "Medium";
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasksToStorage();
}

function toggleTask(id) {
    tasks = tasks.map(t => {
        if (t.id === id) {
            return { ...t, completed: !t.completed };
        }
        return t;
    });
    saveTasksToStorage();
}

function renderTasks() {
    const taskListEl = document.getElementById("taskList");
    if (!taskListEl) return;

    if (tasks.length === 0) {
        taskListEl.innerHTML = `
            <div class="empty-state">
                <p>🎉 No tasks scheduled yet! Add an assignment or topic above to get started.</p>
            </div>
        `;
        return;
    }

    taskListEl.innerHTML = tasks.map(task => {
        const difficultyClass = `badge-${task.difficulty.toLowerCase()}`;
        const readableDeadline = formatReadableDate(task.deadline);
        const isOverdue = readableDeadline.includes("Overdue");

        return `
            <div class="task-item ${task.completed ? 'completed' : ''}" id="${task.id}">
                <div class="task-left">
                    <input 
                        type="checkbox" 
                        class="task-checkbox" 
                        ${task.completed ? 'checked' : ''} 
                        onchange="toggleTask('${task.id}')"
                        title="Mark as completed"
                    >
                    <div class="task-details">
                        <div class="task-title">${escapeHTML(task.name)}</div>
                        <div class="task-meta">
                            <span class="badge ${isOverdue ? 'badge-overdue' : 'badge-date'}">
                                📅 ${readableDeadline}
                            </span>
                            <span class="badge ${difficultyClass}">
                                ${task.difficulty} Priority
                            </span>
                        </div>
                    </div>
                </div>
                <div class="task-actions">
                    <button class="delete-btn" onclick="deleteTask('${task.id}')" title="Delete Task">
                        🗑️
                    </button>
                </div>
            </div>
        `;
    }).join("");
}

// --------------------------------------------------------------------------
// AI Recommendation in Hero Section
// --------------------------------------------------------------------------
function updateHeroRecommendation() {
    const recText = document.getElementById("heroRecommendationText");
    const badge = document.getElementById("heroPriorityBadge");
    if (!recText || !badge) return;

    const pending = tasks.filter(t => !t.completed);

    if (pending.length === 0) {
        recText.textContent = `${profile.name || 'Your friend'} is completely caught up! All study tasks are finished.`;
        badge.textContent = "✅ All Clear";
        badge.style.background = "var(--success-bg)";
        badge.style.color = "var(--success)";
        return;
    }

    // Sort by urgency: overdue/near deadlines first, then high difficulty
    const prioritized = [...pending].sort((a, b) => {
        const dateA = new Date(a.deadline || "2099-01-01");
        const dateB = new Date(b.deadline || "2099-01-01");
        if (dateA - dateB !== 0) return dateA - dateB;

        const weight = { "High": 3, "Medium": 2, "Low": 1 };
        return (weight[b.difficulty] || 0) - (weight[a.difficulty] || 0);
    });

    const topTask = prioritized[0];
    const target = new Date(topTask.deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);
    const diff = Math.round((target - today) / (1000 * 60 * 60 * 24));

    let dueDesc = "due soon";
    if (diff < 0) dueDesc = "past due!";
    else if (diff === 0) dueDesc = "due today!";
    else if (diff === 1) dueDesc = "due tomorrow.";
    else dueDesc = `due in ${diff} days.`;

    recText.textContent = `${profile.name ? profile.name + ' has' : 'You have'} "${topTask.name}" ${dueDesc}`;

    if (diff <= 1 || topTask.difficulty === "High") {
        badge.textContent = "🔥 High Priority";
        badge.style.background = "var(--danger-bg)";
        badge.style.color = "var(--danger)";
    } else {
        badge.textContent = "⚡ Recommended Next";
        badge.style.background = "var(--primary-light)";
        badge.style.color = "var(--primary)";
    }
}

// --------------------------------------------------------------------------
// AI Study Planner
// --------------------------------------------------------------------------
function generatePlan() {
    const planEl = document.getElementById("aiPlan");
    if (!planEl) return;

    const pendingTasks = tasks.filter(t => !t.completed);
    const student = profile.name || "your friend";
    const hours = profile.hours || 3;

    // Loading animation
    planEl.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
            <span class="spinner"></span>
            <strong>Analyzing ${student}'s ${pendingTasks.length} pending tasks & ${hours} study hours...</strong>
        </div>
    `;

    setTimeout(() => {
        if (pendingTasks.length === 0) {
            planEl.innerHTML = `
                <div class="plan-header">
                    <h4>🎉 Free Time Ahead!</h4>
                    <span class="plan-badge">Relaxation Day</span>
                </div>
                <p>No active tasks found. Great time for ${student} to read ahead, practice active recall, or enjoy well-deserved rest.</p>
            `;
            return;
        }

        // Sort tasks
        const sorted = [...pendingTasks].sort((a, b) => {
            const dateA = new Date(a.deadline || "2099-01-01");
            const dateB = new Date(b.deadline || "2099-01-01");
            if (dateA - dateB !== 0) return dateA - dateB;
            const diffWeight = { "High": 3, "Medium": 2, "Low": 1 };
            return (diffWeight[b.difficulty] || 0) - (diffWeight[a.difficulty] || 0);
        });

        // Allocate hours into blocks
        let blocksHTML = "";
        const availableSlots = Math.min(hours, 6);
        let startHour = 16; // 4:00 PM standard study start

        for (let i = 0; i < availableSlots; i++) {
            const task = sorted[i % sorted.length];
            const startTime = `${startHour + i}:00`;
            const endTime = `${startHour + i}:45`;
            const breakTime = `${startHour + i}:45 - ${startHour + i + 1}:00`;

            blocksHTML += `
                <div class="plan-block">
                    <div class="plan-time">${startTime} - ${endTime}</div>
                    <div class="plan-desc">
                        <strong>Session ${i + 1}: ${escapeHTML(task.name)}</strong>
                        <p>Focus Block (${task.difficulty} Priority). Review core formulas & practice questions. Followed by a 15-min hydration & brain break (${breakTime}).</p>
                    </div>
                </div>
            `;
        }

        const tips = [
            "Use the Pomodoro Technique: 45 minutes of complete focus without phone notifications, then a 15-minute screen-free break.",
            "Active Recall method: Close your notes after 20 minutes and write down everything you remember on a blank sheet.",
            "Spaced Repetition: Spend the first 10 minutes reviewing key definitions from yesterday before diving into new problems.",
            "Sleep consolidation: Aim for 7-8 hours of sleep tonight so the hippocampus solidifies today's study memories."
        ];
        const randomTip = tips[Math.floor(Math.random() * tips.length)];

        planEl.innerHTML = `
            <div class="plan-header">
                <h4>🎯 Personalized Study Plan for ${escapeHTML(student)}</h4>
                <span class="plan-badge">${hours} Hours Allocated</span>
            </div>
            <div class="plan-blocks">
                ${blocksHTML}
            </div>
            <div class="plan-tip">
                <span>💡</span>
                <div>
                    <strong>AI Study Tip:</strong> ${randomTip}
                </div>
            </div>
        `;
    }, 700);
}

// --------------------------------------------------------------------------
// AI Chat Assistant
// --------------------------------------------------------------------------
function askAI(customQuery = null) {
    const input = document.getElementById("userQuestion");
    const message = customQuery || (input ? input.value.trim() : "");
    if (!message) return;

    if (input) input.value = "";

    // Append User Message
    addChatMessage(message, "user");

    // Scroll chat to bottom
    scrollToBottom();

    // Show temporary thinking state
    const thinkingId = "thinking-" + Date.now();
    addChatMessage("Thinking...", "bot", thinkingId);
    scrollToBottom();

    setTimeout(() => {
        const thinkingEl = document.getElementById(thinkingId);
        if (thinkingEl) thinkingEl.remove();

        const response = generateAIResponse(message);
        addChatMessage(response, "bot");
        scrollToBottom();
    }, 600);
}

function handleEnter(e) {
    if (e.key === "Enter") {
        askAI();
    }
}

function addChatMessage(text, sender, id = null) {
    const messagesEl = document.getElementById("messages");
    if (!messagesEl) return;

    const div = document.createElement("div");
    div.className = `${sender} message`;
    if (id) div.id = id;
    
    if (sender === "bot") {
        div.innerHTML = `🤖 ${formatBotText(text)}`;
    } else {
        div.textContent = text;
    }

    messagesEl.appendChild(div);
}

function scrollToBottom() {
    const messagesEl = document.getElementById("messages");
    if (messagesEl) {
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }
}

function formatBotText(str) {
    // Basic bold markdown parser
    return escapeHTML(str)
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
}

function generateAIResponse(query) {
    const q = query.toLowerCase();
    const student = profile.name || "your friend";
    const course = profile.course || "the course";
    const hours = profile.hours || 4;
    const pending = tasks.filter(t => !t.completed);

    // 1. Task/priority query
    if (q.includes("what should i study") || q.includes("where do i start") || q.includes("first") || q.includes("priority")) {
        if (pending.length === 0) {
            return `Great news! ${student} has no pending tasks right now. You can use this time to revise previous topics in **${course}** or rest!`;
        }
        const top = pending[0];
        return `Based on deadlines and difficulty, I recommend ${student} focuses on **"${top.name}"** first! It's marked as **${top.difficulty} Priority** and is ${formatReadableDate(top.deadline)}. Starting with the hardest or closest deadline reduces anxiety right away.`;
    }

    // 2. Schedule & Hours query
    if (q.includes("schedule") || q.includes("hours") || q.includes("plan") || q.includes("routine")) {
        return `${student} has **${hours} study hours** scheduled for **${course}**. I suggest dividing this into ${Math.min(hours, 4)} focused 45-minute blocks with 15-minute breaks. Click the **"✨ Generate AI Plan"** button above to generate a full minute-by-minute breakdown!`;
    }

    // 3. Stress / Feeling overwhelmed
    if (q.includes("stress") || q.includes("overwhelm") || q.includes("tired") || q.includes("anxious") || q.includes("help me")) {
        return `Take a deep breath! Studying for ${course} can be intense, but breaking it down makes it easy. \n\n1. Pick just **one single task**.\n2. Set a timer for 20 minutes without checking your phone.\n3. Drink water and take a quick 5-minute stretch.\n\nYou've got this!`;
    }

    // 4. Study techniques / tips
    if (q.includes("technique") || q.includes("tip") || q.includes("focus") || q.includes("memor") || q.includes("how to study")) {
        return `Here are the top 3 study techniques recommended for ${course}:\n\n• **Active Recall:** Test yourself before looking at answers.\n• **Feynman Technique:** Explain the concept in simple words as if teaching someone else.\n• **Pomodoro (45/15):** 45 minutes laser focus, 15 minutes rest.`;
    }

    // 5. Tasks summary
    if (q.includes("how many tasks") || q.includes("tasks") || q.includes("assignments") || q.includes("summary")) {
        const completed = tasks.filter(t => t.completed).length;
        return `${student} currently has **${pending.length} pending tasks** and **${completed} completed tasks** in ${course}. Keep up the great momentum!`;
    }

    // 6. Greetings
    if (q.includes("hello") || q.includes("hi") || q.includes("hey")) {
        return `Hello! I'm StudyBuddy AI, dedicated to helping ${student} excel in ${course}. How can I assist with tasks, deadlines, or schedules today?`;
    }

    // Default intelligent response
    return `That's a great study question for ${course}! To get the best out of your sessions, keep your daily goal realistic within your **${hours} available hours**. Try breaking "${pending[0] ? pending[0].name : 'your current topic'}" into small 20-minute chunks. Need help prioritizing or planning a specific topic?`;
}

// --------------------------------------------------------------------------
// Quick Chip Assistant Trigger
// --------------------------------------------------------------------------
function sendQuickPrompt(text) {
    const input = document.getElementById("userQuestion");
    if (input) input.value = text;
    askAI(text);
}

// Utility: Escape HTML
function escapeHTML(str) {
    if (!str) return "";
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
