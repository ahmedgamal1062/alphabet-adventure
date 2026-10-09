# Alphabet Adventure

A responsive Flask web app that helps children learn A–Z through colorful cards, playful illustrations, and spoken letter/word sounds.

## Run locally

```powershell
cd alphabet-adventure
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

Open `http://127.0.0.1:5000` in a browser. Select a card or press its speaker button to hear its letter and word. The speech uses the browser's built-in speech feature. A gentle melody plays alongside each pronunciation and stops when the speech ends; use the accompaniment button to turn it off or back on. The melody is generated in the browser, so no audio files or network connection are needed.

The app disables Flask's interactive debugger, configures secure session-cookie attributes, and sends browser security headers, including a Content Security Policy. `FLASK_SECRET_KEY` is read from the environment for signed sessions; set a long random value before adding any session-dependent features. For public deployment, run it behind a production WSGI server (not Flask's development server) and terminate HTTPS at a trusted reverse proxy. Configure HSTS at that HTTPS proxy.
