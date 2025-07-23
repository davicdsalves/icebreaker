# Icebreaker HTML

A dynamic HTML page for generating icebreaker questions and managing a user list. Perfect for team building activities, social events, or retrospectives where you need engaging conversation starters.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Features

### Core Functionality
- Generate random icebreaker questions from predefined lists or LLM-generated content
- Add users to a user list with comma-separated input
- Select and remove users from the list automatically
- Toggle between light and dark themes
- Cycle through questions with play/pause controls
- Remove displayed questions from the pool

### LLM Integration
- **Dynamic question generation** from external LLM APIs
- **Configurable API endpoint** and authentication
- **Model selection** with popular presets (Claude, GPT, Gemini) or custom models
- **Bilingual prompts** optimized for English and Portuguese
- **Collapsible configuration panel** for clean interface
- **Error handling** with specific messages for common issues
- **30-second timeout** protection for API calls

## Usage

### Basic Setup
1. Open `index.html` in a web browser or host on a web server
2. Use default questions or configure LLM integration for dynamic content

### LLM Configuration
1. Click "LLM Configuration" to expand settings
2. Enter your API endpoint URL
3. Provide your bearer token
4. Select or enter a model name
5. Choose language (English/Portuguese)
6. Click "Load Questions from LLM"

### Query Parameters
- **Users**: `index.html?users=user1,user2,user3`
- **Language**: `index.html?language=pt` (Portuguese) or `language=en` (English, default)

### Controls
- **Play/Pause**: Automatically cycle through questions
- **Remove Question**: Delete current question from pool
- **Add User**: Enter comma-separated usernames
- **Select User**: Pick and remove first user from list
- **Theme Toggle**: Switch between light/dark modes

## LLM Integration Details

### Supported Models
- `claude-sonnet-4-20250514-v1.0` (default)
- `gpt-4.1`
- `gemini-2.5-flash`
- Custom model names supported

### API Requirements
- POST endpoint accepting OpenAI-compatible format
- Bearer token authentication
- JSON response with `choices[0].message.content` structure

### Question Generation
- Generates 40 high-quality icebreaker questions per request
- Avoids basic questions like "what's your favorite color"
- Focuses on experience-sharing and reflection
- Professional yet engaging tone

## Customization

### Static Questions
Modify the `englishQuestions` or `portugueseQuestions` arrays in the JavaScript code.

### Styling
Update CSS variables in the `<style>` section for colors, fonts, and layout.

### LLM Prompts
Edit the `getPrompt()` function to customize question generation behavior.

## Technical Notes

### CORS Considerations
- When running locally (`file://`), use browser CORS extensions or proxy server
- Hosting on web servers (GitHub Pages, etc.) resolves CORS issues
- VPN requirements apply to the user's browser, not the hosting location

### Error Handling
- 405 errors show "invalid model" message
- Network timeouts after 30 seconds
- Malformed responses handled gracefully
- Token and URL validation before API calls

## Browser Compatibility
- Modern browsers with ES5+ support
- jQuery 3.6.0 and Font Awesome 5.15.4 dependencies
- No localStorage usage for maximum compatibility