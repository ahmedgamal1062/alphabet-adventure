import os

from flask import Flask, render_template


app = Flask(__name__)
app.config.update(
    SECRET_KEY=os.environ.get("FLASK_SECRET_KEY"),
    SESSION_COOKIE_SECURE=True,
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",
)


@app.after_request
def add_security_headers(response):
    response.headers.setdefault(
        "Content-Security-Policy",
        "default-src 'self'; base-uri 'self'; object-src 'none'; "
        "frame-ancestors 'none'; form-action 'self'; script-src 'self'; "
        "style-src 'self'; img-src 'self' data:; connect-src 'self'",
    )
    response.headers.setdefault("X-Content-Type-Options", "nosniff")
    response.headers.setdefault("X-Frame-Options", "DENY")
    response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
    response.headers.setdefault("Cross-Origin-Opener-Policy", "same-origin")
    response.headers.setdefault("Cross-Origin-Resource-Policy", "same-origin")
    response.headers.setdefault(
        "Permissions-Policy",
        "camera=(), geolocation=(), microphone=()",
    )
    return response


LETTERS = [
    ("A", "Apple", "🍎", "a bright red apple"),
    ("B", "Bear", "🐻", "a friendly brown bear"),
    ("C", "Cat", "🐱", "a smiling orange cat"),
    ("D", "Dog", "🐶", "a playful puppy"),
    ("E", "Elephant", "🐘", "a gentle elephant"),
    ("F", "Fish", "🐟", "a colorful fish"),
    ("G", "Grapes", "🍇", "a bunch of purple grapes"),
    ("H", "House", "🏠", "a cozy house"),
    ("I", "Ice cream", "🍦", "a sweet ice cream cone"),
    ("J", "Jellyfish", "🪼", "a floating jellyfish"),
    ("K", "Kite", "🪁", "a kite flying in the wind"),
    ("L", "Lion", "🦁", "a friendly lion"),
    ("M", "Moon", "🌙", "a glowing moon"),
    ("N", "Nest", "🪺", "a bird nest"),
    ("O", "Octopus", "🐙", "a happy octopus"),
    ("P", "Panda", "🐼", "a cute panda"),
    ("Q", "Queen", "👑", "a shiny queen crown"),
    ("R", "Rainbow", "🌈", "a colorful rainbow"),
    ("S", "Sun", "☀️", "a smiling sun"),
    ("T", "Tiger", "🐯", "a striped tiger"),
    ("U", "Umbrella", "☂️", "a bright umbrella"),
    ("V", "Violin", "🎻", "a wooden violin"),
    ("W", "Whale", "🐳", "a blue whale"),
    ("X", "Xylophone", "🎼", "a musical xylophone"),
    ("Y", "Yarn", "🧶", "a ball of soft yarn"),
    ("Z", "Zebra", "🦓", "a striped zebra"),
]


@app.route("/")
def index():
    return render_template("index.html", letters=LETTERS)


if __name__ == "__main__":
    app.run(debug=False)
