/* =========================================================
   AI STUDY ASSISTANT
   ========================================================= */

const messages = document.getElementById("messages");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const clearBtn = document.getElementById("clearChat");
const uploadBtn = document.getElementById("uploadBtn");
const fileInput = document.getElementById("fileInput");
const micBtn = document.getElementById("micBtn");


/* =========================================================
   LOCAL STORAGE
   ========================================================= */

const CHAT_KEY = "aiPlannerChatHistory";

const STUDY_KEY = "aiPlannerStudySessions";


/* =========================================================
   LOAD CHAT
   ========================================================= */

function loadChat() {

    const saved = localStorage.getItem(CHAT_KEY);

    if (!saved) return;

    try {

        const chat = JSON.parse(saved);

        messages.innerHTML = "";

        chat.forEach(item => {

            addMessage(
                item.text,
                item.sender,
                false
            );

        });

    } catch (error) {

        console.log("Chat history could not be loaded.");

    }
}


/* =========================================================
   SAVE CHAT
   ========================================================= */

function saveChat() {

    const chat = [];

    document
        .querySelectorAll(".message")
        .forEach(message => {

            const bubble =
                message.querySelector(".bubble");

            if (!bubble) return;

            chat.push({

                text: bubble.innerHTML,

                sender:
                    message.classList.contains("user")
                        ? "user"
                        : "bot"

            });

        });

    localStorage.setItem(
        CHAT_KEY,
        JSON.stringify(chat)
    );
}


/* =========================================================
   ADD MESSAGE
   ========================================================= */

function addMessage(text, sender = "bot", save = true) {

    const wrapper =
        document.createElement("div");

    wrapper.className =
        `message ${sender}`;


    if (sender === "bot") {

        wrapper.innerHTML = `

            <div class="avatar">
                <i class="fa-solid fa-robot"></i>
            </div>

            <div class="bubble">
                ${text}
            </div>

        `;

    } else {

        wrapper.innerHTML = `

            <div class="bubble">
                ${text}
            </div>

        `;

    }


    messages.appendChild(wrapper);

    messages.scrollTop =
        messages.scrollHeight;


    if (save) {
        saveChat();
    }
}


/* =========================================================
   SEND MESSAGE
   ========================================================= */

function sendMessage() {

    const text =
        userInput.value.trim();

    if (!text) return;


    addMessage(
        escapeHTML(text),
        "user"
    );


    userInput.value = "";


    showTyping();


    setTimeout(() => {

        removeTyping();

        const response =
            generateResponse(text);

        addMessage(
            response,
            "bot"
        );

    }, 600);

}


/* =========================================================
   ENTER KEY
   ========================================================= */

userInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            event.preventDefault();

            sendMessage();

        }

    }
);


sendBtn.addEventListener(
    "click",
    sendMessage
);


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


/* =========================================================
   TYPING
   ========================================================= */

function showTyping() {

    const typing =
        document.createElement("div");

    typing.id = "typing";

    typing.className = "message bot";

    typing.innerHTML = `

        <div class="avatar">
            <i class="fa-solid fa-robot"></i>
        </div>

        <div class="bubble">
            <span>Thinking</span> ···
        </div>

    `;

    messages.appendChild(typing);

    messages.scrollTop =
        messages.scrollHeight;
}


function removeTyping() {

    const typing =
        document.getElementById("typing");

    if (typing) {
        typing.remove();
    }

}


/* =========================================================
   RESPONSE ENGINE
   ========================================================= */

function generateResponse(input) {

    const text =
        input.toLowerCase();


    /* GREETINGS */

    if (
        text.includes("hello") ||
        text.includes("hi") ||
        text.includes("hey")
    ) {

        return `
            <strong>Hey! 👋</strong>
            <p>
                Ready to study?
                Tell me the subject or topic
                you're working on.
            </p>
        `;

    }


    /* DBMS */

    if (
        text.includes("dbms") ||
        text.includes("database")
    ) {

        return `
            <strong>DBMS 📚</strong>

            <p>
                DBMS stands for
                <b>Database Management System</b>.
                It is software used to create,
                store, organize and manage data.
            </p>

            <p>
                Important DBMS topics include:
            </p>

            <ul>
                <li>Normalization</li>
                <li>SQL</li>
                <li>Transactions</li>
                <li>ER Model</li>
                <li>Keys</li>
                <li>Joins</li>
            </ul>

            <p>
                If you're preparing for an exam,
                I can quiz you on any of these.
            </p>
        `;

    }


    /* NORMALIZATION */

    if (
        text.includes("normalization") ||
        text.includes("normalisation")
    ) {

        return `
            <strong>DBMS Normalization 🧠</strong>

            <p>
                Normalization is the process of
                organizing database tables to reduce
                redundancy and improve data integrity.
            </p>

            <p>
                The commonly studied normal forms are:
            </p>

            <ul>
                <li><b>1NF</b> — Atomic values</li>
                <li><b>2NF</b> — Removes partial dependency</li>
                <li><b>3NF</b> — Removes transitive dependency</li>
                <li><b>BCNF</b> — Stronger form of 3NF</li>
            </ul>

            <p>
                Want me to give you a
                normalization quiz?
            </p>
        `;

    }


    /* JAVA */

    if (
        text.includes("java")
    ) {

        return `
            <strong>Java ☕</strong>

            <p>
                Java is an object-oriented,
                class-based programming language.
            </p>

            <p>Important topics:</p>

            <ul>
                <li>OOP</li>
                <li>Inheritance</li>
                <li>Polymorphism</li>
                <li>Exception Handling</li>
                <li>Collections</li>
                <li>Multithreading</li>
            </ul>
        `;

    }


    /* PYTHON */

    if (
        text.includes("python")
    ) {

        return `
            <strong>Python 🐍</strong>

            <p>
                Python is a high-level,
                general-purpose programming language.
            </p>

            <p>
                Important areas include:
            </p>

            <ul>
                <li>Functions</li>
                <li>Lists</li>
                <li>Dictionaries</li>
                <li>Classes</li>
                <li>File Handling</li>
                <li>Exception Handling</li>
            </ul>
        `;

    }


    /* OS */

    if (
        text.includes("operating system") ||
        text === "os"
    ) {

        return `
            <strong>Operating Systems 💻</strong>

            <p>
                An operating system manages the
                hardware and software resources
                of a computer.
            </p>

            <p>Important topics:</p>

            <ul>
                <li>Processes</li>
                <li>Threads</li>
                <li>Scheduling</li>
                <li>Deadlocks</li>
                <li>Memory Management</li>
                <li>File Systems</li>
            </ul>
        `;

    }


    /* STUDY PLAN */

    if (
        text.includes("study plan") ||
        text.includes("study schedule") ||
        text.includes("timetable")
    ) {

        return createTimetable();

    }


    /* EXAM */

    if (
        text.includes("exam") ||
        text.includes("test")
    ) {

        return `
            <strong>Exam Strategy 🎯</strong>

            <p>
                Try this approach:
            </p>

            <ol>
                <li>List the topics you need to cover.</li>
                <li>Start with high-weight topics.</li>
                <li>Study in focused sessions.</li>
                <li>Practice questions after each topic.</li>
                <li>Revise difficult topics again.</li>
            </ol>

            <p>
                Tell me your subject and how many
                days are left and I'll create a plan.
            </p>
        `;

    }


    /* DEFAULT */

    return `
        <strong>Let's work on that 🤖</strong>

        <p>
            I can help with subjects such as
            <b>DBMS, Java, Python, Operating Systems,
            Data Structures and Computer Networks.</b>
        </p>

        <p>
            Try asking:
        </p>

        <ul>
            <li>"Explain normalization"</li>
            <li>"Give me a DBMS quiz"</li>
            <li>"Make a Java study plan"</li>
            <li>"Explain operating systems"</li>
        </ul>
    `;

}


/* =========================================================
   QUICK ACTIONS
   ========================================================= */

document
    .querySelectorAll("[data-action]")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                quickAction(
                    button.dataset.action
                );

            }
        );

    });


function quickAction(action) {

    switch (action) {

        case "quiz":

            addMessage(
                "Generate a DBMS quiz for me.",
                "user"
            );

            setTimeout(() => {

                addMessage(
                    createQuiz(),
                    "bot"
                );

            }, 400);

            break;


        case "summary":

            addMessage(
                "Summarize my study notes.",
                "user"
            );

            setTimeout(() => {

                addMessage(
                    createSummary(),
                    "bot"
                );

            }, 400);

            break;


        case "flashcards":

            addMessage(
                "Create flashcards for DBMS.",
                "user"
            );

            setTimeout(() => {

                addMessage(
                    createFlashcards(),
                    "bot"
                );

            }, 400);

            break;


        case "timetable":

            addMessage(
                "Create a study timetable.",
                "user"
            );

            setTimeout(() => {

                addMessage(
                    createTimetable(),
                    "bot"
                );

            }, 400);

            break;


        case "explain":

            addMessage(
                "Explain DBMS normalization.",
                "user"
            );

            setTimeout(() => {

                addMessage(
                    generateResponse("normalization"),
                    "bot"
                );

            }, 400);

            break;

    }

}


/* =========================================================
   QUIZ
   ========================================================= */

function createQuiz() {

    return `
        <strong>🧠 DBMS Quick Quiz</strong>

        <p><b>1.</b> What does DBMS stand for?</p>

        <p>
            A) Data Backup Management System<br>
            B) Database Management System<br>
            C) Database Memory System<br>
            D) Data Management Software
        </p>

        <p><b>2.</b> Which normal form removes partial dependency?</p>

        <p>
            A) 1NF<br>
            B) 2NF<br>
            C) 3NF<br>
            D) BCNF
        </p>

        <p><b>3.</b> Which language is commonly used to interact
        with relational databases?</p>

        <p>
            A) HTML<br>
            B) CSS<br>
            C) SQL<br>
            D) XML
        </p>

        <p>
            Reply with your answers like:
            <b>1-B, 2-B, 3-C</b>
        </p>
    `;

}


/* =========================================================
   SUMMARY
   ========================================================= */

function createSummary() {

    return `
        <strong>📚 DBMS Revision Summary</strong>

        <ul>
            <li>
                DBMS manages and organizes databases.
            </li>

            <li>
                A primary key uniquely identifies
                a record.
            </li>

            <li>
                Foreign keys establish relationships
                between tables.
            </li>

            <li>
                Normalization reduces redundancy.
            </li>

            <li>
                SQL is used to query and manipulate
                relational databases.
            </li>
        </ul>

        <p>
            Use these points for quick revision.
        </p>
    `;

}


/* =========================================================
   FLASHCARDS
   ========================================================= */

function createFlashcards() {

    return `
        <strong>🃏 DBMS Flashcards</strong>

        <p>
            <b>Card 1 — What is a Primary Key?</b><br>
            A field that uniquely identifies a record.
        </p>

        <p>
            <b>Card 2 — What is Normalization?</b><br>
            Organizing data to reduce redundancy.
        </p>

        <p>
            <b>Card 3 — What is SQL?</b><br>
            Structured Query Language used to interact
            with relational databases.
        </p>

        <p>
            <b>Card 4 — What is a Foreign Key?</b><br>
            A field that references a key in another table.
        </p>
    `;

}


/* =========================================================
   TIMETABLE
   ========================================================= */

function createTimetable() {

    return `
        <strong>🗓️ Suggested Study Timetable</strong>

        <p>
            <b>08:00 – 08:45</b><br>
            DBMS — Normalization
        </p>

        <p>
            <b>10:00 – 10:45</b><br>
            Java — Collections
        </p>

        <p>
            <b>02:00 – 02:45</b><br>
            Python — Functions
        </p>

        <p>
            <b>05:00 – 05:45</b><br>
            Operating Systems — Memory Management
        </p>

        <p>
            <b>08:00 – 08:30</b><br>
            Quick Revision + Practice Questions
        </p>
    `;

}


/* =========================================================
   CLEAR CHAT
   ========================================================= */

clearBtn.addEventListener(
    "click",
    function() {

        if (
            !confirm(
                "Clear your complete chat history?"
            )
        ) {
            return;
        }

        localStorage.removeItem(CHAT_KEY);

        messages.innerHTML = "";

        addMessage(`
            <strong>Chat cleared 👋</strong>

            <p>
                What would you like to study today?
            </p>
        `);

    }
);


/* =========================================================
   FILE UPLOAD
   ========================================================= */

uploadBtn.addEventListener(
    "click",
    () => fileInput.click()
);


fileInput.addEventListener(
    "change",
    function() {

        const file = this.files[0];

        if (!file) return;


        addMessage(
            `📎 Uploaded: <b>${escapeHTML(file.name)}</b>`,
            "user"
        );


        if (
            file.type === "text/plain" ||
            file.name.endsWith(".txt") ||
            file.name.endsWith(".md")
        ) {

            const reader =
                new FileReader();


            reader.onload = function(event) {

                const text =
                    event.target.result;


                localStorage.setItem(
                    "uploadedStudyMaterial",
                    text
                );


                addMessage(`
                    <strong>Study material loaded 📚</strong>

                    <p>
                        I saved the text locally.
                        You can now ask me to summarize
                        or revise the uploaded material.
                    </p>
                `);

            };


            reader.readAsText(file);

        } else {

            addMessage(`
                <strong>File received 📎</strong>

                <p>
                    I can store the file selection,
                    but browser-only JavaScript cannot
                    reliably extract PDF content without
                    a PDF processing library/backend.
                </p>

                <p>
                    For now, paste the important text
                    into the chat for analysis.
                </p>
            `);

        }

    }
);


/* =========================================================
   VOICE INPUT
   ========================================================= */

let recognition = null;


if (
    "webkitSpeechRecognition" in window ||
    "SpeechRecognition" in window
) {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    recognition =
        new SpeechRecognition();


    recognition.continuous = false;

    recognition.interimResults = false;

    recognition.lang = "en-IN";


    recognition.onstart = function() {

        micBtn.classList.add(
            "recording"
        );

    };


    recognition.onend = function() {

        micBtn.classList.remove(
            "recording"
        );

    };


    recognition.onresult = function(event) {

        userInput.value =
            event.results[0][0].transcript;

    };


    recognition.onerror = function() {

        micBtn.classList.remove(
            "recording"
        );

    };

}


micBtn.addEventListener(
    "click",
    function() {

        if (!recognition) {

            alert(
                "Voice input is not supported in this browser."
            );

            return;

        }

        recognition.start();

    }
);


/* =========================================================
   STUDY SESSION TRACKING
   ========================================================= */

function addStudySession(
    subject,
    minutes
) {

    const sessions =
        JSON.parse(
            localStorage.getItem(
                STUDY_KEY
            )
        ) || [];


    sessions.push({

        subject: subject,

        minutes: Number(minutes),

        date: new Date().toISOString()

    });


    localStorage.setItem(
        STUDY_KEY,
        JSON.stringify(sessions)
    );

}


/* =========================================================
   INITIALIZATION
   ========================================================= */

loadChat();


console.log(
    "AI Study Assistant loaded successfully."
);