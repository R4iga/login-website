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
        
        if (apiSettings && apiSettings.apiKey && apiSettings.apiKey.trim() !== '') {
            // Show typing indicator
            addChatbotMessage('Thinking...', 'bot');
            
            try {
                // Try multiple approaches for API call
                let response;
                let apiUrl = 'https://api.openai.com/v1/chat/completions';
                let requestBody = {
                    model: apiSettings.model || 'gpt-3.5-turbo',
                    messages: [
                        { role: 'system', content: 'You are a helpful assistant. Be concise and friendly.' },
                        { role: 'user', content: message }
                    ],
                    temperature: parseFloat(apiSettings.temperature) || 0.7,
                    max_tokens: 300,
                    stream: false
                };
                
                console.log('Making API request to:', apiUrl);
                console.log('Request body:', JSON.stringify(requestBody, null, 2));
                
                // Try direct API call first
                try {
                    response = await fetch(apiUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${apiSettings.apiKey.trim()}`
                        },
                        body: JSON.stringify(requestBody)
                    });
                } catch (directError) {
                    console.log('Direct API call failed, trying CORS proxy...');
                    
                    // Fallback to CORS proxy if direct call fails
                    try {
                        const proxyUrl = 'https://cors-anywhere.herokuapp.com/' + apiUrl;
                        response = await fetch(proxyUrl, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-Requested-With': 'XMLHttpRequest'
                            },
                            body: JSON.stringify({
                                ...requestBody,
                                api_key: apiSettings.apiKey.trim()
                            })
                        });
                    } catch (proxyError) {
                        console.log('CORS proxy also failed, trying alternative...');
                        
                        // Try alternative approach - simulate response for demo
                        throw new Error('CORS/Network error: Unable to connect to OpenAI API due to browser security restrictions.');
                    }
                }
                
                console.log('Response status:', response.status);
                console.log('Response headers:', response.headers);
                
                if (!response.ok) {
                    let errorData;
                    try {
                        errorData = await response.json();
                    } catch (e) {
                        errorData = { error: { message: 'Unable to parse error response' } };
                    }
                    
                    console.error('API Error Details:', {
                        status: response.status,
                        statusText: response.statusText,
                        error: errorData
                    });
                    
                    // Remove typing indicator
                    removeTypingIndicator();
                    
                    // Detailed error handling
                    if (response.status === 401) {
                        addChatbotMessage('❌ Invalid API key. Please check your OpenAI API key in Settings.\n\nTip: Make sure your API key starts with "sk-" and has sufficient credits.', 'bot');
                    } else if (response.status === 429) {
                        addChatbotMessage('⏱️ Rate limit exceeded. Please wait a moment and try again.\n\nTip: Free accounts have lower rate limits.', 'bot');
                    } else if (response.status === 403) {
                        addChatbotMessage('🚫 Access denied. Your API key may not have access to this model.\n\nTip: Check your OpenAI billing and model permissions.', 'bot');
                    } else if (response.status === 400) {
                        addChatbotMessage('⚠️ Bad request. The request format was invalid.\n\nError: ' + (errorData.error?.message || 'Unknown error'), 'bot');
                    } else {
                        addChatbotMessage(`❌ API Error (${response.status}): ${errorData.error?.message || 'Unknown error'}\n\nPlease check your API key and try again.`, 'bot');
                    }
                    return;
                }
                
                let data;
                try {
                    data = await response.json();
                    console.log('API Response:', data);
                } catch (e) {
                    console.error('Failed to parse response:', e);
                    removeTypingIndicator();
                    addChatbotMessage('❌ Invalid response format from API.', 'bot');
                    return;
                }
                
                // Remove typing indicator
                removeTypingIndicator();
                
                if (data.choices && data.choices[0] && data.choices[0].message) {
                    const botResponse = data.choices[0].message.content;
                    addChatbotMessage(botResponse, 'bot');
                } else {
                    addChatbotMessage('❌ Unexpected API response format. No choices returned.', 'bot');
                }
            } catch (error) {
                console.error('Fetch Error Details:', {
                    name: error.name,
                    message: error.message,
                    stack: error.stack
                });
                
                // Remove typing indicator
                removeTypingIndicator();
                
                if (error.name === 'TypeError' && error.message.includes('fetch')) {
                    addChatbotMessage('🌐 Network error. Unable to connect to OpenAI servers.\n\nPlease check:\n• Internet connection\n• Firewall settings\n• API service status', 'bot');
                } else if (error.message.includes('CORS')) {
                    addChatbotMessage('🔒 CORS error. Browser blocked the request.\n\nThis might be a security restriction. Try using a different browser or check your browser settings.', 'bot');
                } else {
                    // If all API attempts fail, provide a helpful simulated response
                    console.log('All API attempts failed, providing simulated response');
                    const simulatedResponses = [
                        `I understand you're asking about: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"\n\nI'm currently having trouble connecting to the OpenAI API, but I'd be happy to help once the connection is restored. Please try again in a moment!`,
                        `That's an interesting question about: "${message}"\n\nI'm experiencing some technical difficulties with the AI service right now. The issue might be:\n• Network connectivity\n• API rate limits\n• Service maintenance\n\nPlease try again shortly!`,
                        `I see you're interested in: "${message}"\n\nUnfortunately, I'm unable to process your request at the moment due to API connectivity issues. This is a temporary problem.\n\nSuggestions:\n• Check your internet connection\n• Verify your API key in Settings\n• Try again in a few minutes`,
                        `Regarding: "${message.substring(0, 30)}${message.length > 30 ? '...' : ''}"\n\nI'm experiencing technical difficulties with the ChatGPT service. This could be due to high demand or temporary service issues.\n\nPlease try again later. In the meantime, you can test your API key in Settings!`
                    ];
                    
                    const randomSimulated = simulatedResponses[Math.floor(Math.random() * simulatedResponses.length)];
                    addChatbotMessage(randomSimulated, 'bot');
                }
            }
        } else {
            const fallbackResponses = [
                "🤖 Hi! I'm a demo chatbot. To use ChatGPT:\n\n1. Go to Settings → API Settings\n2. Enter your OpenAI API key (starts with 'sk-')\n3. Click 'Test API Key' to verify\n4. Save settings\n5. Start chatting!",
                "🔑 ChatGPT not configured yet!\n\nPlease add your OpenAI API key in Settings → API Settings to enable real AI responses.",
                "⚙️ I'd love to help with ChatGPT! Please configure your API key first:\n\nSettings → API Settings → Enter OpenAI API Key",
                "🚀 Ready for ChatGPT! Add your API key in Settings to unlock full AI capabilities."
            ];
            
            const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
            addChatbotMessage(randomResponse, 'bot');
        }
    }
}

function removeTypingIndicator() {
    const messagesContainer = document.getElementById('chatbot-messages');
    const messages = messagesContainer.children;
    if (messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage && lastMessage.textContent === 'Thinking...') {
            messagesContainer.removeChild(lastMessage);
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