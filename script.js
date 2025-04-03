document.addEventListener("DOMContentLoaded", () => {
      const chatMessages = document.getElementById("chat-messages");
      const userInput = document.getElementById("user-input");
      const sendButton = document.getElementById("send-button");

      function addMessage(content, isUser = false) {
            const messageDiv = document.createElement("div");
            messageDiv.className = isUser ? "message user-message" : "message bot-message";

            const avatar = document.createElement("div");
            avatar.className = "avatar";

            const avatarImg = document.createElement("img");
            avatarImg.src = isUser ? "/chatbot3.0/assets/user.png" : "/chatbot3.0/assets/ai.png";
            avatar.appendChild(avatarImg);

            const messageContent = document.createElement("div");
            messageContent.className = "message-content";
            messageContent.textContent = content;

            messageDiv.appendChild(avatar);
            messageDiv.appendChild(messageContent);
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
      }

      sendButton.addEventListener("click", () => handleSendMessage());
      userInput.addEventListener("keypress", (e) => { if (e.key === "Enter") handleSendMessage(); });

      async function handleSendMessage() {
            const message = userInput.value.trim();
            if (!message) return;

            addMessage(message, true); // Show user message
            userInput.value = "";

            const typingIndicator = document.createElement("div");
            typingIndicator.className = "message bot-message";
            typingIndicator.innerHTML = `<div class="avatar"><img src="/chatbot3.0/assets/ai.png" alt="Bot"></div>
                                <div class="message-content">Typing...</div>`;
            chatMessages.appendChild(typingIndicator);
            chatMessages.scrollTop = chatMessages.scrollHeight;

            try {
                  const API_KEY = "AIzaSyBI3QuFGA7zTCx34-89YNq7Pq4sDJHOw8I"; // Replace with actual Gemini API key
                  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
                        method: "POST",
                        headers: {
                              "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                              contents: [
                                    {
                                          role: "user",
                                          parts: [{ text: message }]
                                    }
                              ]
                        })

                  });

                  if (!response.ok) throw new Error(`API request failed with status ${response.status}`);

                  const data = await response.json();

                  if (!data || !data.candidates || !data.candidates[0]?.content?.parts[0]?.text) {
                        throw new Error("Invalid response format");
                  }

                  const botMessage = data.candidates[0].content.parts[0].text.trim();

                  chatMessages.removeChild(typingIndicator);
                  addMessage(botMessage, false);

            } catch (error) {
                  console.error("API Error:", error);
                  chatMessages.removeChild(typingIndicator);
                  addMessage("Oops! Something went wrong. Please try again.", false);
            }
      }

});