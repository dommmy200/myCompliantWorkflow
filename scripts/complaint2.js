
// // Store conversation state
// let currentCaseNumber = null;
// let conversationHistory = [];

// // Generate case number locally (fallback)
// function generateCaseNumber() {
//     const date = new Date();
//     const year = date.getFullYear().toString().slice(-2);
//     const month = (date.getMonth() + 1).toString().padStart(2, '0');
//     const day = date.getDate().toString().padStart(2, '0');
//     const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
//     return `HC${year}${month}${day}-${random}`;
// }

// // Add message to conversation view
// function addMessage(text, sender) {
//     conversationHistory.push({ text, sender });
    
//     const conversationView = document.getElementById('conversationView');
//     const messageDiv = document.createElement('div');
//     messageDiv.className = `message ${sender}`;

//     // Render markdown-style bold (**text**) from AI responses
//     const formatted = escapeHtml(text).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
//     messageDiv.innerHTML = `<div class="message-bubble">${formatted}</div>`;
//     conversationView.appendChild(messageDiv);
    
//     // Scroll to bottom
//     conversationView.scrollTop = conversationView.scrollHeight;
// }

// // Helper to escape HTML
// function escapeHtml(text) {
//     const div = document.createElement('div');
//     div.textContent = text;
//     return div.innerHTML;
// }

// // Show conversation UI and hide initial form fields
// function showConversationUI() {
//     document.getElementById('conversationView').classList.remove('hidden');
//     // Keep form visible but maybe simplify
// }

// // Submit data to webhook
// async function submitToWebhook(data) {
//     const response = await fetch('https://dommmy2000.app.n8n.cloud/webhook/d6cf974e-f6ea-4270-b622-34c85f7c4132', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'x-api-key':    'your-demo-secret-key',
//         },
//         body: JSON.stringify(data)
//     });
//     if (!response.ok) {
//         throw new Error('Webhook error: ' + response.status);
//     }
//     return await response.json();
// }

// // Handle form submission
// document.getElementById('complaintForm').addEventListener('submit', async function(e) {
//     e.preventDefault();
    
//     // Get form values
//     const fullName = document.getElementById('fullName').value;
//     const email = document.getElementById('email').value;
//     const description = document.getElementById('description').value;
    
//     // Validate
//     if (!fullName || !email || !description) {
//         alert('Please fill in all required fields');
//         return;
//     }
    
//     // Show loading
//     const submitBtn = document.getElementById('submitBtn');
//     const loadingIndicator = document.getElementById('loadingIndicator');
//     submitBtn.disabled = true;
//     loadingIndicator.classList.remove('hidden');
    
//     // Prepare data
//     const data = {
//         fullName: fullName,
//         email: email,
//         description: description,
//         caseNumber: currentCaseNumber || generateCaseNumber(),
//         timestamp: new Date().toISOString()
//     };
    
//     // Add conversation context if this is a follow-up
//     if (currentCaseNumber) {
//         data.caseNumber = currentCaseNumber;
//         data.conversationHistory = conversationHistory;
//     }
    
//     try {
//         const response = await submitToWebhook(data);
        
//         if (response.status === 'complete') {
//             // Complaint is complete - show success
//             document.getElementById('formCard').classList.add('hidden');
//             document.getElementById('successCard').classList.remove('hidden');
//             document.getElementById('displayCaseNumber').textContent = response.caseNumber;
            
//         } else if (response.status === 'incomplete') {
//             // Need more information - show conversation UI
//             currentCaseNumber = response.caseNumber;
//             showConversationUI();
            
//             // Add user message to conversation
//             addMessage(description, 'user');
            
//             // Add AI follow-up question
//             const aiMessage = response.aiQuestion || response.message;
//             addMessage(aiMessage, 'ai');
            
//             // Clear description field and update placeholder
//             document.getElementById('description').value = '';
//             document.getElementById('description').placeholder = 'Please provide the requested information...';
            
//             // Update form title to indicate follow-up mode
//             document.querySelector('.header p').textContent = `Case #${currentCaseNumber} - Please provide additional information`;
            
//             // Add a status badge
//             if (!document.querySelector('.status-badge')) {
//                 const statusBadge = document.createElement('div');
//                 statusBadge.className = 'status-badge status-pending';
//                 statusBadge.textContent = '⏳ Awaiting additional information';
//                 document.querySelector('.form-section').insertBefore(statusBadge, document.getElementById('complaintForm'));
//             }
//         }
        
//     } catch (error) {
//         console.error('Error:', error);
//         alert('There was an error submitting your complaint. Please try again.');
//     } finally {
//         submitBtn.disabled = false;
//         loadingIndicator.classList.add('hidden');
//     }
// });

// // Reset function for new complaint
// function resetAndShowForm() {
//     // Reset all state
//     currentCaseNumber = null;
//     conversationHistory = [];
    
//     // Clear conversation view
//     const conversationView = document.getElementById('conversationView');
//     conversationView.innerHTML = '';
//     conversationView.classList.add('hidden');
    
//     // Reset form
//     document.getElementById('complaintForm').reset();
//     document.getElementById('description').placeholder = 'Please include these details if possible:\n• Incident Date: [YYYY-MM-DD]\n• Facility: [name and location]\n• Complaint Type: [misdiagnosis/medication error/surgical/administrative]\n• Reported Severity: [low/medium/high]\n\nThen describe what happened in detail...';
    
//     // Reset header
//     document.querySelector('.header p').textContent = 'Report malpractice in health and administrative services';
    
//     // Remove status badge if exists
//     const statusBadge = document.querySelector('.status-badge');
//     if (statusBadge) statusBadge.remove();
    
//     // Show form card, hide success card
//     document.getElementById('formCard').classList.remove('hidden');
//     document.getElementById('successCard').classList.add('hidden');
    
//     // Clear any stored data
//     localStorage.removeItem('complaint_caseNumber');
//     localStorage.removeItem('complaint_history');
// }

// // Optional: Save state to localStorage for recovery on page refresh
// function saveState() {
//     if (currentCaseNumber) {
//         localStorage.setItem('complaint_caseNumber', currentCaseNumber);
//         localStorage.setItem('complaint_history', JSON.stringify(conversationHistory));
//     }
// }

// function loadState() {
//     const savedCaseNumber = localStorage.getItem('complaint_caseNumber');
//     if (savedCaseNumber) {
//         currentCaseNumber = savedCaseNumber;
//         const savedHistory = localStorage.getItem('complaint_history');
//         if (savedHistory) {
//             conversationHistory = JSON.parse(savedHistory);
//             showConversationUI();
//             conversationHistory.forEach(msg => {
//                 addMessage(msg.text, msg.sender);
//             });
//             // Update UI to indicate follow-up mode
//             document.querySelector('.header p').textContent = `Case #${currentCaseNumber} - Continue your complaint`;
//         }
//     }
// }

// // Auto-save on page unload
// window.addEventListener('beforeunload', saveState);

// // Load saved state on page load
// loadState();
document.addEventListener('DOMContentLoaded', function () {
    // ── TEMP: disable persistence until bug is fixed ──
    const PERSISTENCE_ENABLED = false;


    // ── Conversation state ─────────────────────────────
    let currentCaseNumber = null;
    let conversationHistory = [];

    // ── Case number generator ──────────────────────────
    function generateCaseNumber() {
        const date   = new Date();
        const year   = date.getFullYear().toString().slice(-2);
        const month  = (date.getMonth() + 1).toString().padStart(2, '0');
        const day    = date.getDate().toString().padStart(2, '0');
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `SSCS-${year}${month}${day}-${random}`;
    }
    // ── Render message to DOM only (no history push) ──
    function renderMessage(text, sender) {
        const conversationView = document.getElementById('conversationView');
        const messageDiv       = document.createElement('div');
        messageDiv.className   = `message ${sender}`;
        const formatted        = escapeHtml(text)
                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        messageDiv.innerHTML   = `<div class="message-bubble">${formatted}</div>`;
        conversationView.appendChild(messageDiv);
        conversationView.scrollTop = conversationView.scrollHeight;
    }

    // ── Add message to conversation view ──────────────
    function addMessage(text, sender) {
        conversationHistory.push({ text, sender }); // track
        renderMessage(text, sender); // render
        // const conversationView = document.getElementById('conversationView');
        // const messageDiv       = document.createElement('div');
        // messageDiv.className   = `message ${sender}`;

        // // Render markdown-style bold (**text**) from AI responses
        // const formatted = escapeHtml(text).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // messageDiv.innerHTML = `<div class="message-bubble">${formatted}</div>`;
        // conversationView.appendChild(messageDiv);
        // conversationView.scrollTop = conversationView.scrollHeight;
    }

    // ── Escape HTML ────────────────────────────────────
    function escapeHtml(text) {
        const div     = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ── Show conversation UI ───────────────────────────
    function showConversationUI() {
        document.getElementById('conversationView').classList.remove('hidden');
    }

    // ── Send to n8n webhook ────────────────────────────
    async function submitToWebhook(data) {
        const response = await fetch('https://dommmy2000.app.n8n.cloud/webhook/dee3fe95-c5c6-4bc0-9c7c-0c103f6093da', {
            method:  'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key':    '417a831bb736ca08b866773e9df8b3c6e278937333e960cfe84dbc7a41e7c57a',
            },
            body: JSON.stringify(data),
        });
        // ── Debug: log raw response before parsing ─────
        const rawText = await response.text();
        console.log('Raw webhook response:', rawText);

        if (!rawText || rawText.trim() === '') {
            throw new Error('n8n returned an empty response');
        }

        try {
            return JSON.parse(rawText);
        } catch (e) {
            console.error('JSON parse failed. Raw response was:', rawText);
            throw new Error('Invalid JSON from webhook: ' + rawText.substring(0, 200));
        }
        // if (!response.ok) {
        //     throw new Error('Webhook error: ' + response.status);
        // }

        // return await response.json();
    }

    // ── Handle webhook response ────────────────────────
    function handleResponse(response, userMessage) {
        if (response.status === 'complete') {
            // ── Done — show success card ───────────────
            document.getElementById('formCard').classList.add('hidden');
            document.getElementById('successCard').classList.remove('hidden');
            document.getElementById('displayCaseNumber').textContent = response.caseNumber;
            saveState();

        } else if (response.status === 'incomplete') {
            // ── AI has follow-up question ──────────────
            currentCaseNumber = response.caseNumber || currentCaseNumber;
            showConversationUI();

            // Show user message in conversation
            if (userMessage) addMessage(userMessage, 'user');

            // Show AI question in conversation
            const aiMessage = response.aiQuestion || response.message || '';
            if (aiMessage) addMessage(aiMessage, 'ai');

            // Update UI for follow-up mode
            document.getElementById('description').value  = '';
            document.getElementById('description').placeholder = 'Type your answer here...';
            document.querySelector('.header p').textContent =
                `Case #${currentCaseNumber} — Please answer the question above`;

            // Add status badge (once only)
            if (!document.querySelector('.status-badge')) {
                const badge       = document.createElement('div');
                badge.className   = 'status-badge status-pending';
                badge.textContent = '⏳ Awaiting additional information';
                document.querySelector('.form-section')
                        .insertBefore(badge, document.getElementById('complaintForm'));
            }

            saveState();
        }
    }

    // ── Initial + follow-up form submission ───────────
    document.getElementById('complaintForm').addEventListener('submit', async function (e) {
        e.preventDefault();

        const fullName    = document.getElementById('fullName').value.trim();
        const email       = document.getElementById('email').value.trim();
        const description = document.getElementById('description').value.trim();

        if (!fullName || !email || !description) {
            alert('Please fill in all required fields.');
            return;
        }

        // ── Show loading ───────────────────────────────
        const submitBtn       = document.getElementById('submitBtn');
        const loadingEl       = document.getElementById('loadingIndicator');
        submitBtn.disabled    = true;
        loadingEl.classList.remove('hidden');

        // ── Build payload ──────────────────────────────
        const isFollowUp = !!currentCaseNumber;

        const data = {
            caseNumber:   currentCaseNumber || generateCaseNumber(),
            timestamp:    new Date().toISOString(),
            fullName:     fullName,
            email:        email,
            description:  description,
            isFollowUp:   isFollowUp,
        };

        // Store case number after first generation
        if (!currentCaseNumber) currentCaseNumber = data.caseNumber;

        // Include conversation history for context
        if (isFollowUp) {
            data.conversationHistory = conversationHistory;
        }

        try {
            const response = await submitToWebhook(data);
            console.log('n8n response:', response);
            handleResponse(response, description);

        } catch (error) {
            console.error('Submission error:', error);
            alert('There was an error submitting your complaint. Please try again.');

        } finally {
            submitBtn.disabled = false;
            loadingEl.classList.add('hidden');
        }
    });

    // ── Reset for new complaint ────────────────────────
    function resetAndShowForm() {
        currentCaseNumber = null;
        conversationHistory = [];

        clearState(); // ← use the helper

        const conversationView = document.getElementById('conversationView');
        conversationView.innerHTML = '';
        conversationView.classList.add('hidden');

        document.getElementById('complaintForm').reset();
        document.getElementById('description').placeholder =
            'Please include these details if possible:\n• Incident Date: [YYYY-MM-DD]\n• Facility: [name and location]\n• Complaint Type: [misdiagnosis/medication error/surgical/administrative]\n• Reported Severity: [low/medium/high]\n\nThen describe what happened in detail...';

        document.querySelector('.header p').textContent =
            'Report malpractice in health and administrative services';

        const badge = document.querySelector('.status-badge');
        if (badge) badge.remove();

        document.getElementById('formCard').classList.remove('hidden');
        document.getElementById('successCard').classList.add('hidden');

        // localStorage.removeItem('complaint_caseNumber');
        // localStorage.removeItem('complaint_history');
    }

    // ── LoadState function ───────────────
    function loadState() {
        if (!PERSISTENCE_ENABLED) return;
        const savedCase = localStorage.getItem('complaint_caseNumber');
        if (!savedCase) return;

        // ── Validate saved state isn't stale ──────────
        const savedTime = localStorage.getItem('complaint_timestamp');
        const now = Date.now();
        const oneHour = 60 * 60 * 1000;

        if (savedTime && (now - parseInt(savedTime)) > oneHour) {
            // State is older than 1 hour — clear it
            localStorage.removeItem('complaint_caseNumber');
            localStorage.removeItem('complaint_history');
            localStorage.removeItem('complaint_timestamp');
            return;
        }

        currentCaseNumber  = savedCase;
        const savedHistory = localStorage.getItem('complaint_history');

        if (savedHistory) {
            try {
                conversationHistory = JSON.parse(savedHistory);
            } catch (e) {
                conversationHistory = [];
                return;
            }

            // ── Only restore if there's actual history ─
            if (conversationHistory.length === 0) return;

            showConversationUI();

            // ── Clear view before re-adding ────────────
            const view = document.getElementById('conversationView');
            view.innerHTML = '';

            conversationHistory.forEach(msg => renderMessage(msg.text, msg.sender));
            document.querySelector('.header p').textContent =
                `Case #${currentCaseNumber} — Continue your complaint`;
        }
    }
    // ── Clear all saved state ──────────────────────────
    function clearState() {
        localStorage.removeItem('complaint_caseNumber');
        localStorage.removeItem('complaint_history');
        localStorage.removeItem('complaint_timestamp');
    }

    // ── SaveState includes timestamp ──────────
    function saveState() {
        if (!PERSISTENCE_ENABLED) return;
        if (currentCaseNumber) {
            localStorage.setItem('complaint_caseNumber', currentCaseNumber);
            localStorage.setItem('complaint_history',    JSON.stringify(conversationHistory));
            localStorage.setItem('complaint_timestamp',  Date.now().toString());
        }
    }
});
// function loadState() {
//     const savedCase = localStorage.getItem('complaint_caseNumber');
//     if (!savedCase) return;

//     currentCaseNumber   = savedCase;
//     const savedHistory  = localStorage.getItem('complaint_history');

//     if (savedHistory) {
//         conversationHistory = JSON.parse(savedHistory);
//         showConversationUI();
//         conversationHistory.forEach(msg => addMessage(msg.text, msg.sender));
//         document.querySelector('.header p').textContent =
//             `Case #${currentCaseNumber} — Continue your complaint`;
//     }
// }

// Comment this out for now
// window.addEventListener('beforeunload', saveState);
// loadState();