let currentConversation = null;
let conversations = [];

document.addEventListener('DOMContentLoaded', function() {
    setupPage();
    
    loadConversations();
    loadUsersForNewConversation();
    
    const searchInput = document.getElementById('search-conversations');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterConversations(this.value);
        });
    }
    
    const messageInput = document.getElementById('message-input');
    if (messageInput) {
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    const newConversationForm = document.getElementById('new-conversation-form');
    if (newConversationForm) {
        newConversationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            createNewConversation();
        });
    }
    
    const chatbotInput = document.getElementById('chatbot-input');
    if (chatbotInput) {
        chatbotInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendToChatbot();
            }
        });
    }
});

function loadConversations() {
    const username = localStorage.getItem('username');
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const currentUser = users.find(u => u.username === username);
    
    if (currentUser) {
        conversations = JSON.parse(localStorage.getItem('conversations_' + currentUser.id)) || [];
        displayConversations();
    }
}

function displayConversations() {
    const conversationsList = document.getElementById('conversations-list');
    conversationsList.innerHTML = '';
    
    conversations.forEach(conv => {
        const convElement = document.createElement('div');
        convElement.className = 'conversation-item';
        convElement.onclick = () => selectConversation(conv.id);
        
        const lastMessage = conv.messages[conv.messages.length - 1];
        const preview = lastMessage ? lastMessage.text.substring(0, 30) + '...' : 'No messages';
        
        convElement.innerHTML = `
            <div style="font-weight: bold;">${conv.participant}</div>
            <div style="font-size: 12px; opacity: 0.7;">${preview}</div>
            <div style="font-size: 10px; opacity: 0.5;">${new Date(conv.lastUpdated).toLocaleTimeString()}</div>
        `;
        
        conversationsList.appendChild(convElement);
    });
}

function filterConversations(searchTerm) {
    const filtered = conversations.filter(conv => 
        conv.participant.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const conversationsList = document.getElementById('conversations-list');
    conversationsList.innerHTML = '';
    
    filtered.forEach(conv => {
        const convElement = document.createElement('div');
        convElement.className = 'conversation-item';
        convElement.onclick = () => selectConversation(conv.id);
        
        const lastMessage = conv.messages[conv.messages.length - 1];
        const preview = lastMessage ? lastMessage.text.substring(0, 30) + '...' : 'No messages';
        
        convElement.innerHTML = `
            <div style="font-weight: bold;">${conv.participant}</div>
            <div style="font-size: 12px; opacity: 0.7;">${preview}</div>
            <div style="font-size: 10px; opacity: 0.5;">${new Date(conv.lastUpdated).toLocaleTimeString()}</div>
        `;
        
        conversationsList.appendChild(convElement);
    });
}

function selectConversation(conversationId) {
    currentConversation = conversations.find(conv => conv.id === conversationId);
    
    if (currentConversation) {
        document.querySelectorAll('.conversation-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const selectedItem = Array.from(document.querySelectorAll('.conversation-item')).find(item => {
            return item.onclick && item.onclick.toString().includes(conversationId);
        });
        if (selectedItem) {
            selectedItem.classList.add('active');
        }
        
        const chatHeader = document.getElementById('chat-header');
        const chatInput = document.getElementById('chat-input');
        
        if (chatHeader) chatHeader.innerHTML = `<h3>${currentConversation.participant}</h3>`;
        if (chatInput) chatInput.style.display = 'block';
        
        displayMessages();
    }
}

function displayMessages() {
    const messagesContainer = document.getElementById('chat-messages');
    messagesContainer.innerHTML = '';
    
    currentConversation.messages.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${message.sender === 'me' ? 'sent' : 'received'}`;
        messageElement.innerHTML = `
            <div>${message.text}</div>
            <div style="font-size: 10px; opacity: 0.7; margin-top: 5px;">${new Date(message.timestamp).toLocaleTimeString()}</div>
        `;
        messagesContainer.appendChild(messageElement);
    });
    
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const messageText = messageInput.value.trim();
    
    if (messageText && currentConversation) {
        const newMessage = {
            sender: 'me',
            text: messageText,
            timestamp: new Date().toISOString()
        };
        
        currentConversation.messages.push(newMessage);
        currentConversation.lastUpdated = new Date().toISOString();
        
        saveConversations();
        displayMessages();
        
        messageInput.value = '';
        
        simulateReply();
    }
}

function simulateReply() {
    setTimeout(() => {
        const replies = [
            "That's interesting! Tell me more.",
            "I understand what you mean.",
            "Thanks for sharing that with me.",
            "How does that make you feel?",
            "That's a great point!",
            "I see what you're saying.",
            "Absolutely! I agree.",
            "That makes sense to me."
        ];
        
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        
        const replyMessage = {
            sender: 'other',
            text: randomReply,
            timestamp: new Date().toISOString()
        };
        
        currentConversation.messages.push(replyMessage);
        currentConversation.lastUpdated = new Date().toISOString();
        
        saveConversations();
        displayMessages();
    }, 1000 + Math.random() * 2000);
}

function saveConversations() {
    const username = localStorage.getItem('username');
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const currentUser = users.find(u => u.username === username);
    
    if (currentUser) {
        localStorage.setItem('conversations_' + currentUser.id, JSON.stringify(conversations));
        displayConversations();
    }
}

function loadUsersForNewConversation() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const username = localStorage.getItem('username');
    const recipientSelect = document.getElementById('recipient');
    
    users.forEach(user => {
        if (user.username !== username) {
            const option = document.createElement('option');
            option.value = user.username;
            option.textContent = user.username;
            recipientSelect.appendChild(option);
        }
    });
}

function startNewConversation() {
    document.getElementById('new-conversation-modal').classList.add('show');
}

function closeNewConversationModal() {
    document.getElementById('new-conversation-modal').classList.remove('show');
    document.getElementById('new-conversation-form').reset();
}

function createNewConversation() {
    const recipient = document.getElementById('recipient').value;
    const firstMessage = document.getElementById('first-message').value.trim();
    
    if (recipient && firstMessage) {
        const newConversation = {
            id: Date.now(),
            participant: recipient,
            messages: [
                {
                    sender: 'me',
                    text: firstMessage,
                    timestamp: new Date().toISOString()
                }
            ],
            lastUpdated: new Date().toISOString()
        };
        
        conversations.unshift(newConversation);
        saveConversations();
        selectConversation(newConversation.id);
        closeNewConversationModal();
    }
}

function toggleChatbot() {
    const chatbotWindow = document.getElementById('chatbot-window');
    chatbotWindow.classList.toggle('show');
}

async function sendToChatbot() {
    const input = document.getElementById('chatbot-input');
    const message = input.value.trim();
    
    if (message) {
        addChatbotMessage(message, 'user');
        input.value = '';
        
        const username = localStorage.getItem('username');
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const currentUser = users.find(u => u.username === username);
        
        let apiSettings = null;
        if (currentUser) {
            apiSettings = JSON.parse(localStorage.getItem('apiSettings_' + currentUser.id)) || {};
        }
        
        if (apiSettings && apiSettings.apiKey) {
            try {
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiSettings.apiKey}`
                    },
                    body: JSON.stringify({
                        model: apiSettings.model || 'gpt-3.5-turbo',
                        messages: [
                            { role: 'user', content: message }
                        ],
                        temperature: apiSettings.temperature || 0.7
                    })
                });
                
                const data = await response.json();
                
                if (data.choices && data.choices[0]) {
                    const botResponse = data.choices[0].message.content;
                    addChatbotMessage(botResponse, 'bot');
                } else {
                    addChatbotMessage('Sorry, I encountered an error with the API.', 'bot');
                }
            } catch (error) {
                addChatbotMessage('Error connecting to ChatGPT API. Please check your API key.', 'bot');
            }
        } else {
            const fallbackResponses = [
                "I'm a demo chatbot. To use ChatGPT, please add your API key in Settings.",
                "This is a simulated response. Configure your OpenAI API key in Settings for real responses.",
                "I'd love to help! Add your ChatGPT API key in Settings to enable full functionality."
            ];
            
            const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
            addChatbotMessage(randomResponse, 'bot');
        }
    }
}

function addChatbotMessage(message, sender) {
    const messagesContainer = document.getElementById('chatbot-messages');
    const messageElement = document.createElement('div');
    messageElement.className = `${sender}-message`;
    messageElement.textContent = message;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}