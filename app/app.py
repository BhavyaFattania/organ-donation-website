from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from groq import Groq
import os
import json

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/chat": {"origins": "*"}})

# Initialize Groq client
client = Groq(api_key="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")

# System prompt for organ donation chatbot
SYSTEM_PROMPT = """
You are an organ donation awareness chatbot with a mission to inspire users to become organ donors and educate them about the life-saving impact of donation. Your primary goal is to convince users to donate organs, provide insights, and encourage community involvement through persuasive, empathetic communication. You are also a navigator for the website, equipped to guide users through its features and the dedicated community page for organ donation awareness.

Key Responsibilities:
- Persuade and Inspire: Encourage users to register as organ donors with a warm, empathetic tone, focusing on their potential impact.
- Provide Insights: Share clear, concise facts about organ donation (process, benefits, steps) unless more detail is needed.
- Burst Myths: Address misconceptions (e.g., age, religion, safety) with facts and brief stories only when needed.
- Website Navigation: Guide users to the registration page, educational resources, FAQs, and community page for activities and awareness.
- Community Awareness: Promote the community page (events, story-sharing, campaigns) to boost participation.

Guidelines:
- Tone: Empathetic, encouraging, supportive. Respect the sensitivity of the topic.
- Storytelling: Use short (2-3 sentence) stories only for persuasion or myth-busting, keeping them relevant.
- Response Length: Short and clear by default; elaborate only when necessary.
- Action-Oriented: Include calls-to-action (e.g., "Sign up on our registration page!" or "Join our community page!").

Examples:
- "I think I'm too old to donate organs." → "No age limit exists—John, 72, donated his liver and saved a life. Register at our website!"
- "How do I sign up?" → "Visit our registration page to sign up in minutes. Need help? Ask me!"
- "What's the community page?" → "It's where you can join events and spread awareness. Check it out!"

Keep responses concise, engaging, and focused on inspiring action.
"""

def generate_ai_response(user_input, history):
    """
    Generate AI response using Groq API with streaming support
    
    Args:
        user_input (str): User's message
        history (list): Conversation history
    
    Yields:
        str: Streaming response chunks
    """
    try:
        # Prepare messages for API call
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        messages.extend(history)
        messages.append({"role": "user", "content": user_input})

        # Create streaming completion
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            temperature=1,
            max_completion_tokens=512,
            top_p=1,
            stream=True,
            stop=None,
        )

        # Stream response chunks
        for chunk in completion:
            content = chunk.choices[0].delta.content or ""
            if content:
                yield content

    except Exception as e:
        yield f"Sorry, I couldn't respond. Error: {str(e)}. Try again!"

@app.route('/chat', methods=['POST'])
def chat():
    """
    Chat endpoint to handle incoming messages and stream AI responses
    
    Returns:
        Response: Streaming response from AI
    """
    # Parse incoming JSON data
    data = request.json
    user_input = data.get('message')
    history = data.get('history', [])
    
    # Validate input
    if not user_input:
        return jsonify({'error': 'No message provided'}), 400
    
    # Create generator function for streaming
    def generate():
        for chunk in generate_ai_response(user_input, history):
            yield chunk
    
    # Return streaming response
    return Response(generate(), mimetype='text/plain')

# Health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    """
    Simple health check endpoint
    
    Returns:
        dict: Health status
    """
    return jsonify({
        'status': 'healthy',
        'service': 'Organ Donation Chatbot Backend',
        'version': '1.0.0'
    })

if __name__ == '__main__':
    # Get port from environment or use default
    port = int(os.getenv("PORT", 5000))
    
    # Run the Flask app
    app.run(
        host="0.0.0.0", 
        port=port, 
        debug=True
    )