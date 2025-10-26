const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || '';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Store conversation history
let conversationHistory = [];

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'AI Agent System is running' });
});

// Get conversation history
app.get('/api/conversation', (req, res) => {
    res.json({ history: conversationHistory });
});

// Clear conversation history
app.delete('/api/conversation', (req, res) => {
    conversationHistory = [];
    res.json({ message: 'Conversation history cleared' });
});

// Chat with AI agent
app.post('/api/chat', async (req, res) => {
    try {
        const { message, model = 'llama2' } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Add user message to history
        conversationHistory.push({
            role: 'user',
            content: message,
            timestamp: new Date().toISOString()
        });

        let aiResponse = '';

        if (N8N_WEBHOOK_URL) {
            // Use n8n workflow if configured
            const n8nResp = await axios.post(N8N_WEBHOOK_URL, { message, model }, { timeout: 300000 });
            // n8n response format expected: { success, response, model, timestamp }
            aiResponse = n8nResp?.data?.response || n8nResp?.data?.result || '';
            if (!aiResponse) {
                throw new Error('Empty response from n8n workflow');
            }
        } else {
            // Check if Ollama is available
            try {
                const context = conversationHistory
                    .slice(-10)
                    .map(msg => `${msg.role}: ${msg.content}`)
                    .join('\n');

                const ollamaResp = await axios.post(`${OLLAMA_URL}/api/generate`, {
                    model: model,
                    prompt: context + '\nassistant:',
                    stream: false,
                    options: {
                        temperature: 0.7,
                        top_p: 0.9,
                        max_tokens: 1000
                    }
                }, { timeout: 5000 });
                aiResponse = ollamaResp.data.response;
            } catch (ollamaError) {
                // Ollama not available - return a helpful message
                aiResponse = "I'm currently running in demo mode without an AI backend. To enable full AI responses, please configure either Ollama or n8n integration. You can find setup instructions in the project README.";
            }
        }

        // Add AI response to history
        conversationHistory.push({
            role: 'assistant',
            content: aiResponse,
            timestamp: new Date().toISOString()
        });

        res.json({
            response: aiResponse,
            model: model,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error handling /api/chat:', error.message);
        res.status(500).json({
            error: 'Failed to get response from AI agent',
            details: error.message
        });
    }
});

// Get available models from Ollama
app.get('/api/models', async (req, res) => {
    try {
        const response = await axios.get(`${OLLAMA_URL}/api/tags`, { timeout: 3000 });
        res.json({ models: response.data.models || [] });
    } catch (error) {
        console.error('Error fetching models:', error.message);
        // Return a default model when Ollama is not available
        res.json({ 
            models: [{ name: 'demo-mode', size: 0, modified_at: new Date().toISOString() }] 
        });
    }
});

// Execute task endpoint (for n8n integration)
app.post('/api/task', async (req, res) => {
    try {
        const { task, context, model = 'llama2' } = req.body;
        
        if (!task) {
            return res.status(400).json({ error: 'Task is required' });
        }

        const prompt = `Task: ${task}\n${context ? `Context: ${context}\n` : ''}Please provide a detailed response:`;

        const response = await axios.post(`${OLLAMA_URL}/api/generate`, {
            model: model,
            prompt: prompt,
            stream: false,
            options: {
                temperature: 0.3,
                top_p: 0.9,
                max_tokens: 2000
            }
        });

        res.json({
            result: response.data.response,
            task: task,
            model: model,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error executing task:', error.message);
        res.status(500).json({
            error: 'Failed to execute task',
            details: error.message
        });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        error: 'Internal server error',
        details: error.message
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not found',
        message: `Route ${req.originalUrl} not found`
    });
});

app.listen(PORT, () => {
    console.log(`AI Agent System running on port ${PORT}`);
    console.log(`Frontend available at: http://localhost:${PORT}`);
    console.log(`API available at: http://localhost:${PORT}/api`);
    console.log(`Ollama URL: ${OLLAMA_URL}`);
    if (N8N_WEBHOOK_URL) {
        console.log(`Using n8n workflow: ${N8N_WEBHOOK_URL}`);
    } else {
        console.log('n8n workflow not configured (set N8N_WEBHOOK_URL to enable).');
    }
});

module.exports = app;