


const API_KEY = 'AIzaSyAKjTVUz9Filpdey8KNDyVkDHeWa1g4pT8';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

const chatmessages = document.getElementById('messages');
const userinput = document.getElementById('user-input');
const sendbutton = document.getElementById('send-button');

async function generateResponse(prompt) {
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            content: [
                {
                    parts: [
                        {
                            text: prompt
                        }
                    ]
                }
            ]
        })
    });

    if (!response.ok) {
        throw new Error('Failed to generate response');
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

function cleanMarkdown(text) {
    return text
        .replace(/#{1,6}\s?/g, '')
        .replace(/\*\*/g, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

function addmessage(message, isUser) {
    const messageelement = document.createElement('div');
    messageelement.classList.add("message");
    messageelement.classList.add(isUser ? 'user-message' : 'bot-message');

    const profileImage = document.createElement('img');
    profileImage.classList.add('profile-image');
    profileImage.src = isUser ? 'user.jpg' : 'bot.jpg';
    profileImage.alt = isUser ? 'user' : 'bot';

    const messageContent = document.createElement('div');
    messageContent.classList.add('message-content');
    messageContent.textContent = message;

    messageelement.appendChild(profileImage);
    messageelement.appendChild(messageContent);
    chatmessages.appendChild(messageelement);

    chatmessages.scrollTop = chatmessages.scrollHeight;
}

async function handleUserInput() {
    const userMessage = userinput.value.trim();

    if (userMessage) {
        addmessage(userMessage, true);
        userinput.value = '';

        sendbutton.disabled = true;
        userinput.disabled = true;

        try {
            const botmessage = await generateResponse(userMessage);
            addmessage(cleanMarkdown(botmessage), false);
        } catch (error) {
            console.error('Error:', error);
            addmessage('Sorry, I encountered an error. Please try again.', false);
        } finally {
            sendbutton.disabled = false;
            userinput.disabled = false;
            userinput.focus();
        }
    }
}

sendbutton.addEventListener('click', handleUserInput);
userinput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleUserInput();
    }
});
