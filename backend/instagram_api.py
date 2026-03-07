from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json
import re

app = Flask(__name__)
CORS(app)

API_KEY = "G7WFZABL8VP18NV7R1BKFIYRJAR4QGPIHPN5T8I9RADVAUJPQP3EKZ18A6SR1JGFUWSSS7AGU92IQZNG"
SCRAPINGBEE_URL = "https://app.scrapingbee.com/api/v1"

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'server': 'running'})

@app.route('/api/instagram/<username>', methods=['GET'])
def get_instagram_profile(username):
    try:
        username = username.replace('@', '').strip()
        print(f"🔍 Fetching profile for: {username}")
        
        # ScrapingBee parameters for Instagram
        params = {
            'api_key': API_KEY,
            'url': f'https://www.instagram.com/{username}/',
            'premium_proxy': 'true',
            'stealth_proxy': 'true',
            'render_js': 'true',
            'json_response': 'true'
        }
        
        response = requests.get(SCRAPINGBEE_URL, params=params, timeout=30)
        print(f"📊 Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            
            # Extract OpenGraph data
            opengraph = data.get('metadata', {}).get('opengraph', [])
            dublincore = data.get('metadata', {}).get('dublincore', [])
            
            profile_data = {}
            
            # Parse OpenGraph data
            if opengraph and len(opengraph) > 0:
                og = opengraph[0]
                profile_data['profile_pic'] = og.get('og:image', '')
                profile_data['full_name'] = og.get('og:title', '').replace(' (@' + username + ')', '')
                
                # Parse followers/following/posts from description
                description = og.get('og:description', '')
                # Extract numbers using regex
                followers_match = re.search(r'([0-9,]+)\s*Followers?', description, re.IGNORECASE)
                following_match = re.search(r'([0-9,]+)\s*Following?', description, re.IGNORECASE)
                posts_match = re.search(r'([0-9,]+)\s*Posts?', description, re.IGNORECASE)
                
                profile_data['followers'] = int(followers_match.group(1).replace(',', '')) if followers_match else 0
                profile_data['following'] = int(following_match.group(1).replace(',', '')) if following_match else 0
                profile_data['posts'] = int(posts_match.group(1).replace(',', '')) if posts_match else 0
            
            # Parse Dublin Core for bio
            if dublincore and len(dublincore) > 0:
                dc = dublincore[0]
                elements = dc.get('elements', [])
                for elem in elements:
                    if elem.get('name') == 'description':
                        bio_text = elem.get('content', '')
                        # Extract bio after username
                        if 'on Instagram: "' in bio_text:
                            bio = bio_text.split('on Instagram: "')[-1].rstrip('"')
                            profile_data['biography'] = bio
                        else:
                            profile_data['biography'] = bio_text
            
            profile_data['username'] = username
            profile_data['is_verified'] = False  # Can be detected from page
            profile_data['is_private'] = False
            profile_data['source'] = 'scrapingbee_real'
            
            print(f"✅ Data fetched for @{username}: {profile_data.get('followers', 0)} followers")
            return jsonify(profile_data)
        else:
            print(f"❌ API Error: {response.text}")
            return jsonify({'error': 'Failed to fetch profile'}), 500
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/test', methods=['GET'])
def test():
    return jsonify({'status': 'ok', 'message': 'API is working'})

if __name__ == '__main__':
    print("🚀 Instagram API Server Starting...")
    print("📍 http://localhost:5000")
    print("📌 Endpoints:")
    print("   - GET /api/health")
    print("   - GET /api/test")
    print("   - GET /api/instagram/[username]")
    app.run(host='0.0.0.0', port=5000, debug=True)
