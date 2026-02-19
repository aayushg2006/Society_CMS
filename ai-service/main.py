import os
# MUST BE ADDED BEFORE IMPORTING GOOGLE.GENERATIVEAI
os.environ["PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION"] = "python"
import json
import time
import tempfile
import requests
from flask import Flask, request, jsonify
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv(dotenv_path="../.env")

app = Flask(__name__)

# Configure Gemini AI
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("WARNING: GEMINI_API_KEY not found in .env file!")
genai.configure(api_key=api_key)

# Use Gemini 1.5 Flash (Excellent for fast video processing)
model = genai.GenerativeModel('gemini-2.5-flash')

@app.route('/verify-video', methods=['POST'])
def verify_video():
    data = request.json
    video_url = data.get('video_url')
    category = data.get('category')
    description = data.get('description', 'No description provided')

    if not video_url or not category:
        return jsonify({"error": "video_url and category are required"}), 400

    temp_file_path = None
    gemini_file = None

    try:
        # 1. Download the video from the URL to a temporary file
        response = requests.get(video_url, stream=True)
        response.raise_for_status()
        
        # Create a temp file to hold the mp4
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as temp_file:
            for chunk in response.iter_content(chunk_size=8192):
                temp_file.write(chunk)
            temp_file_path = temp_file.name

        print(f"Video downloaded to {temp_file_path}. Uploading to Gemini...")

        # 2. Upload the video to Gemini's File API
        gemini_file = genai.upload_file(path=temp_file_path)

        # 3. Wait for the video to be processed by Gemini
        print("Waiting for video processing...")
        while gemini_file.state.name == 'PROCESSING':
            print('.', end='', flush=True)
            time.sleep(2)
            # Refresh the file status
            gemini_file = genai.get_file(gemini_file.name)
            
        if gemini_file.state.name == 'FAILED':
            raise Exception("Gemini failed to process the video.")

        print("\nProcessing complete. Analyzing...")

        # 4. Create the strict prompt for the AI
        prompt = f"""
        You are a strict automated facility manager for a housing society.
        A resident has submitted a video complaint.
        Category: {category}
        Description: {description}
        
        Watch the provided video. Does the video clearly show a real issue related to the Category and Description?
        If it is a recording of a screen, completely unrelated, or obviously fake, reject it.
        
        Respond ONLY in the following valid JSON format:
        {{
            "is_valid": true or false,
            "confidence_score": 1 to 100,
            "ai_reasoning": "Brief 1-sentence explanation of what happens in the video"
        }}
        """

        # 5. Ask Gemini
        ai_response = model.generate_content([prompt, gemini_file])
        
        # Clean the response to ensure it's valid JSON
        clean_json = ai_response.text.replace("```json", "").replace("```", "").strip()
        result = json.loads(clean_json)

        return jsonify(result), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e), "is_valid": False, "ai_reasoning": "Failed to analyze video"}), 500

    finally:
        # 6. CRITICAL: Clean up files so we don't run out of storage
        if gemini_file:
            try:
                genai.delete_file(gemini_file.name)
                print(f"Deleted {gemini_file.name} from Gemini API.")
            except Exception as cleanup_error:
                print(f"Failed to delete from Gemini: {cleanup_error}")
                
        if temp_file_path and os.path.exists(temp_file_path):
            os.remove(temp_file_path)
            print(f"Deleted local temp file {temp_file_path}.")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)