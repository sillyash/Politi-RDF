from flask import Flask, request, jsonify, make_response
import requests
import logging

logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)

# Enable CORS for all routes
@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response

@app.route('/proxy/<path:url>', methods=['GET', 'POST', 'OPTIONS'])
def proxy(url):
    # Construct the target URL
    target_url = f"http://localhost:7200/{url}"

    # Handle OPTIONS requests for CORS preflight
    if request.method == 'OPTIONS':
        response = make_response('', 204)
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        return response

    # Forward the request to the target server
    if request.method == 'POST':
        resp = requests.post(target_url, data=request.data, headers=request.headers)
    elif request.method == 'GET':
        resp = requests.get(target_url, headers=request.headers)
    else:
        return make_response('Method not allowed', 405)

    # Return the response from the target server
    response = make_response(resp.content, resp.status_code)
    response.headers.update(resp.headers)
    return response

if __name__ == '__main__':
    app.run(port=5000)
