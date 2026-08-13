document.addEventListener("DOMContentLoaded", () => {

    const chatBox = document.getElementById("chatBox");
    const questionInput = document.getElementById("question");
    const sendButton = document.getElementById("sendButton");
    const clearButton = document.getElementById("clearChat");

    let conversation = [];


    // ==========================================
    // ADD MESSAGE
    // ==========================================

    function addMessage(text, type) {

        const message = document.createElement("div");

        message.className = `chat-message ${type}`;

        const avatar = document.createElement("div");
        avatar.className = "message-avatar";
        avatar.textContent = type === "user" ? "YOU" : "AI";

        const content = document.createElement("div");
        content.className = "message-content";

        content.textContent = text;

        message.appendChild(avatar);
        message.appendChild(content);

        chatBox.appendChild(message);

        chatBox.scrollTop = chatBox.scrollHeight;
    }


    // ==========================================
    // SEND MESSAGE
    // ==========================================

    async function sendMessage() {

        const text = questionInput.value.trim();

        if (!text) return;


        // Show user's message
        addMessage(text, "user");

        questionInput.value = "";


        // Add to conversation
        conversation.push({
            role: "user",
            content: text
        });


        // Disable button
        sendButton.disabled = true;

        sendButton.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i>';


        // Thinking message
        const thinking = document.createElement("div");

        thinking.className =
            "chat-message assistant";

        thinking.id =
            "thinkingMessage";

        thinking.innerHTML = `

            <div class="message-avatar">
                AI
            </div>

            <div class="message-content">

                <i class="fa-solid fa-circle-notch fa-spin"></i>

                Thinking...

            </div>

        `;

        chatBox.appendChild(thinking);

        chatBox.scrollTop =
            chatBox.scrollHeight;


        try {

            const response = await fetch(
                "/api/chat",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        messages: conversation
                    })
                }
            );


            const data =
                await response.json();


            // Remove thinking
            document
                .getElementById("thinkingMessage")
                ?.remove();


            if (!response.ok) {

                throw new Error(
                    data.error ||
                    "AI request failed."
                );

            }


            const answer =
                data.answer;


            // Save AI response
            conversation.push({

                role: "assistant",

                content: answer

            });


            // Show response
            addMessage(
                answer,
                "assistant"
            );


        } catch (error) {

            document
                .getElementById("thinkingMessage")
                ?.remove();


            addMessage(

                "😭 Couldn't connect to the AI. Make sure server.mjs is still running.",

                "assistant"

            );

            console.error(error);

        }


        sendButton.disabled = false;

        sendButton.innerHTML =
            '<i class="fa-solid fa-paper-plane"></i>';

        questionInput.focus();

    }


    // ==========================================
    // SEND BUTTON
    // ==========================================

    sendButton.addEventListener(
        "click",
        sendMessage
    );


    // ==========================================
    // ENTER TO SEND
    // SHIFT + ENTER = NEW LINE
    // ==========================================

    questionInput.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                sendMessage();

            }

        }
    );


    // ==========================================
    // CLEAR CHAT
    // ==========================================

    clearButton.addEventListener(
        "click",
        () => {

            conversation = [];

            chatBox.innerHTML = `

                <div class="welcome-message">

                    <div class="welcome-icon">
                        🤖
                    </div>

                    <h2>
                        What's on your mind?
                    </h2>

                    <p>
                        Ask me anything.
                        Let's figure it out together.
                    </p>

                </div>

            `;

            questionInput.focus();

        }
    );


    // ==========================================
    // QUICK ACTIONS
    // ==========================================

    window.askTutor = function(type) {

        const topics = {

            explain:
                "Explain this topic clearly and simply: ",

            quiz:
                "Create a quiz about: ",

            summary:
                "Give me a useful study summary of: ",

            flashcards:
                "Create study flashcards for: ",

            plan:
                "Create a study plan for: "

        };


        questionInput.value =
            topics[type] || "";

        questionInput.focus();

    };

});