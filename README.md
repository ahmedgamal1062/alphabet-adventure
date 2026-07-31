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

Open `http://127.0.0.1:5000` in a browser. Select a card or press its speaker button to hear its letter and word. The sounds use the browser's built-in speech feature, so no audio files or network connection are needed.
