# Setting Up Cline + Jan.ai for God Mode 2.0

## Overview

This guide will help you set up **Cline** (AI coding agent) with **Jan.ai** (local AI models) for $0 AI-powered coding assistance. This setup provides 100% offline capability with 2M+ token context windows.

## Prerequisites

- VS Code, Cursor, or Windsurf installed
- At least 8GB RAM (16GB recommended for larger models)
- 20GB+ free disk space for models

## Step 1: Install Cline Extension

1. **Open your code editor** (VS Code, Cursor, or Windsurf)
2. **Go to Extensions marketplace**
3. **Search for "Cline"**
4. **Click Install**
5. **Restart your editor**

**Verification**: You should see the Cline sidebar icon appear.

## Step 2: Install Jan.ai

1. **Download Jan.ai** from [jan.ai](https://jan.ai)
2. **Run the installer** for your OS (Windows/Mac/Linux)
3. **Open Jan.ai** application
4. **Download a model**:
   - Recommended: **Llama 3.1 8B** (best balance of speed/quality)
   - Alternative: **Mistral 7B** (faster, slightly less capable)
   - Power users: **Llama 3.1 70B** (highest quality, slower)

**Model download time**: ~5-15 minutes depending on internet speed

## Step 3: Start Jan.ai Local Server

1. **Open Jan.ai**
2. **Click Settings** (gear icon)
3. **Enable "Server Mode"**
4. **Note the local server URL**: `http://localhost:1337`
5. **Keep Jan.ai running** in the background

## Step 4: Configure Cline to Use Jan.ai

1. **Open Cline** in your code editor
2. **Click the Settings icon** in Cline sidebar
3. **Select API Provider**: Choose **"OpenAI Compatible"**
4. **Enter these details**:
   - **Base URL**: `http://localhost:1337/v1`
   - **API Key**: `jan` (any value works for local)
   - **Model**: The model you downloaded (e.g., `llama-3.1-8b-instruct`)

5. **Test the connection**: Click "Test API Connection"
   - ✅ Should show "Connected successfully"

## Step 5: Verify Setup

1. **Open a file** in GettUpp Enterprise project
2. **Ask Cline** a simple question: "What is this project about?"
3. **Cline should respond** using your local Jan.ai model
4. **Check Jan.ai** - you should see the API request logged

## Advanced Configuration

### Model Configuration

Jan.ai supports multiple models simultaneously. To switch models:
1. Download additional models in Jan.ai
2. Change the model name in Cline settings

### Context Window

- **Llama 3.1 8B**: 128K tokens (~100K words)
- **Llama 3.1 70B**: 128K tokens
- Can read entire GettUpp codebase in a single prompt

### Performance Tuning

For faster responses:
1. **Jan.ai Settings** → **Performance**
2. **Increase GPU layers** (if you have a GPU)
3. **Reduce context length** if not needed
4. **Use quantized models** (Q4 or Q5 variants)

## Fallback Chain

Cline supports multiple API providers. Configure fallback:

1. **Primary**: Jan.ai (local, $0)
2. **Fallback**: Gemini API (free tier, 1500 req/day)
3. **Last resort**: Claude API (paid)

**To configure**:
- Add multiple API providers in Cline settings
- Cline will automatically fallback if one fails

## Troubleshooting

### "Cannot connect to Jan.ai"

1. **Verify Jan.ai is running**: Check if you see the Jan.ai icon in your system tray
2. **Check server mode** is enabled in Jan.ai settings
3. **Test manually**: Visit `http://localhost:1337` in a browser
   - Should show JSON response

### "Model not found"

1. **Download the model** in Jan.ai first
2. **Wait for download** to complete (check Jan.ai UI)
3. **Use exact model name** from Jan.ai (case-sensitive)

### Slow responses

1. **Check CPU/RAM usage** - close other heavy applications
2. **Try a smaller model** (Mistral 7B instead of Llama 70B)
3. **Use GPU acceleration** if available (Jan.ai settings)

### "Out of memory" errors

1. **Use smaller model** (8B instead of 70B)
2. **Reduce context length** in Jan.ai settings
3. **Close other applications**
4. **Upgrade RAM** if consistently hitting limits

## Using Cline Effectively

### Best Practices

1. **Be specific**: "Update the Turso client to handle connection errors" > "Fix bugs"
2. **Provide context**: Reference file names and line numbers
3. **One task at a time**: Let Cline complete before asking next question
4. **Review suggestions**: Don't blindly accept all changes

### Example Prompts

```
"Add error handling to the Turso client for connection timeouts"

"Refactor the QR delivery worker to use connection pooling"

"Write unit tests for the photo migration script"

"Explain how the per-venue database isolation works"
```

### God Mode 2.0 Context

Cline automatically reads `.clinerules` which contains:
- Project architecture
- Coding standards
- Migration status
- Available commands

So you don't need to re-explain the project every time!

## Cost Comparison

| Solution | Cost/Month | Context | Offline |
|----------|-----------|---------|---------|
| **Jan.ai + Cline** | **$0** | 128K | ✅ Yes |
| Cursor Pro | $20 | 200K | ❌ No |
| GitHub Copilot | $10 | Limited | ❌ No |
| Claude API | ~$30 | 200K | ❌ No |

**Savings**: $30/month = **$360/year** 🎉

## Next Steps

1. ✅ Complete this setup
2. Try asking Cline to help with Phase 3 tasks
3. Experiment with different models
4. Configure fallback to Gemini API for redundancy

## Resources

- [Cline Documentation](https://github.com/cline/cline)
- [Jan.ai Documentation](https://jan.ai/docs)
- [Llama 3.1 Model Card](https://huggingface.co/meta-llama/Meta-Llama-3.1-8B-Instruct)
- GettUpp `.clinerules` for project-specific context

---

**Status**: Ready to use once Jan.ai is running! 🚀
