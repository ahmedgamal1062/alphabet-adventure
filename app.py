from flask import Flask, render_template


app = Flask(__name__)

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
    app.run(debug=True)
