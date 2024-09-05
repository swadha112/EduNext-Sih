from flask import Flask, jsonify, request
import re
import urllib.parse
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)

# Replace with your actual SerpAPI key
serpapi_api_key = "5ad21298a4582514fab6ea04eca448994fc1b9ab0dc3e88ce76588bcd28d5b52"

# Extract the 6-digit pincode from the address
def extract_pincode(address):
    pincode_match = re.search(r'\b\d{6}\b', address)
    return pincode_match.group() if pincode_match else None

# Function to search for career counselors via SerpAPI (Google API)
def search_web(query, num_results=5):
    params = {
        "engine": "google",
        "q": query,
        "num": num_results,
        "api_key": serpapi_api_key
    }

    response = requests.get("https://serpapi.com/search", params=params)
    results = response.json()
    return [{"url": result["link"], "snippet": result.get("snippet", ""), "title": result.get("title", "")} for result in results.get("organic_results", [])]

# Fetch the content of the search results page
def fetch_content(url):
    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        for script in soup(["script", "style"]):
            script.decompose()
        text = soup.get_text()
        lines = (line.strip() for line in text.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        text = '\n'.join(chunk for chunk in chunks if chunk)
        return text
    except requests.RequestException as e:
        return f"Error fetching content: {str(e)}"

# Generate a Google Maps search link based on the location
def generate_maps_link(location):
    encoded_location = urllib.parse.quote(location)
    return f"https://www.google.com/maps/search/?api=1&query={encoded_location}"

# Flask route to handle career counselor search
@app.route('/api/counselors', methods=['POST'])
def get_counselors():
    address = request.json.get('address')

    # Ensure address is provided
    if not address:
        return jsonify({"error": "Address is required."}), 400

    pincode = extract_pincode(address)
    
    # Return an error if the pincode is not found in the address
    if not pincode:
        return jsonify({"error": "Invalid address. Pincode not found."}), 400

    # Search for career counselors based on the pincode
    query = f"career counsellors near {pincode}"
    search_results = search_web(query, num_results=5)
    contents = []

    # Fetch content and Google Maps link for each search result
    for result in search_results:
        content = fetch_content(result['url'])
        maps_link = generate_maps_link(f"{result['title']} {pincode}")
        contents.append({
            "url": result['url'],
            "content": content,
            "title": result['title'],
            "maps_link": maps_link
        })

    return jsonify(contents)

if __name__ == '__main__':
    app.run(port=5000, debug=True)



