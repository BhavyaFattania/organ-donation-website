from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from groq import Groq
import os
from dotenv import load_dotenv
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
# Enable CORS for all origins and methods on all routes
CORS(app, origins="*", allow_headers=["Content-Type"])

# Initialize Groq client
api_key = os.getenv("GROQ_API_KEY")  # Fetch API key
if not api_key:
    print("WARNING: GROQ_API_KEY environment variable not set")

client = Groq(api_key=api_key) if api_key else None

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
        if not client:
            # If no API key is set, generate a fallback response
            yield "I'm here to help with organ donation questions, but I'm currently in offline mode. Please ensure the API key is properly configured. In the meantime, you can visit https://notto.abdm.gov.in/ to learn more about organ donation."
            return

        # Debug output to help diagnose issues
        print(f"Processing user input: {user_input}")
        print(f"History length: {len(history)}")
        
        # Prepare messages for API call
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        
        # Add history messages (convert 'system' role to 'assistant' if needed)
        for msg in history:
            role = msg.get("role", "")
            content = msg.get("content", "")
            
            if not role or not content:
                continue
                
            if role == "system":
                role = "assistant"  # Normalize roles
            
            messages.append({"role": role, "content": content})
        
        # Add current user message
        messages.append({"role": "user", "content": user_input})

        # Print out messages being sent to API for debugging
        print(f"Sending {len(messages)} messages to API")
        
        # Create streaming completion
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            temperature=0.7,
            max_tokens=512,  # Fixed parameter name from max_completion_tokens to max_tokens
            top_p=1,
            stream=True,
        )

        # Stream response chunks
        empty_response = True
        for chunk in completion:
            content = chunk.choices[0].delta.content
            if content:
                empty_response = False
                yield content
        
        # If we got no content at all
        if empty_response:
            yield "I'm sorry, I couldn't generate a response. Please try asking something else about organ donation."

    except Exception as e:
        print(f"Error generating response: {str(e)}")
        yield f"Sorry, I couldn't respond. Error: {str(e)}. Please try again later."

@app.route('/chat', methods=['POST'])
def chat():
    """
    Chat endpoint to handle incoming messages and stream AI responses
    
    Returns:
        Response: Streaming response from AI
    """
    try:
        # Parse incoming JSON data
        data = request.get_json(silent=True)
        if not data:
            print("No JSON data received")
            return jsonify({'error': 'No data provided'}), 400
            
        user_input = data.get('message')
        history = data.get('history', [])
        
        # Validate input
        if not user_input:
            print("No message provided in request")
            return jsonify({'error': 'No message provided'}), 400
        
        # Print received data for debugging
        print(f"Received message: {user_input}")
        print(f"History entries: {len(history)}")
        
        # Create generator function for streaming
        def generate():
            for chunk in generate_ai_response(user_input, history):
                yield chunk
        
        # Return streaming response
        return Response(generate(), mimetype='text/plain')
    except Exception as e:
        print(f"Error in chat endpoint: {str(e)}")
        return jsonify({'error': str(e)}), 500

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

# Add a test endpoint to verify API key is working
@app.route('/test-api', methods=['GET'])
def test_api():
    """
    Test the Groq API connection
    
    Returns:
        dict: API connection status
    """
    if not client:
        return jsonify({
            'status': 'error',
            'message': 'GROQ_API_KEY not configured'
        }), 500
    
    try:
        # Simple test call to Groq API
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": "Hello"}],
            max_tokens=5,  # Fixed parameter name from max_completion_tokens to max_tokens
        )
        return jsonify({
            'status': 'success',
            'message': 'API connection working'
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'API error: {str(e)}'
        }), 500

if __name__ == '__main__':
    # Get port from environment or use default
    port = int(os.getenv("PORT", 5000))
    
    print(f"Starting server on port {port}")
    print(f"API key configured: {bool(api_key)}")
    
    # Run the Flask app
    app.run(
        host="0.0.0.0", 
        port=port, 
        debug=True
    )