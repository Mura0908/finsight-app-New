import http.server
import socketserver
import os
from urllib.parse import urlparse, parse_qs

# Set the port to 80 for direct access without port number
PORT = 80

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Handle the custom URL path
        if self.path == '/download.stefano/app-debug.apk':
            # Serve the APK file
            apk_path = os.path.join('app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk')
            if os.path.exists(apk_path):
                self.send_response(200)
                self.send_header('Content-type', 'application/vnd.android.package-archive')
                self.send_header('Content-Disposition', 'attachment; filename="app-debug.apk"')
                self.end_headers()
                
                with open(apk_path, 'rb') as f:
                    self.wfile.write(f.read())
            else:
                self.send_error(404, "APK file not found")
        else:
            # Serve other files normally
            super().do_GET()

# Change to the project directory
os.chdir(os.path.dirname(os.path.abspath(__file__)))

# Start the server
with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
    print(f"Server started at http://localhost:{PORT}")
    print(f"Direct APK access at http://localhost/download.stefano/app-debug.apk")
    print("Press Ctrl+C to stop the server")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped")