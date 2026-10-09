# Alphabet Adventure — Technical Documentation

## Overview

Alphabet Adventure is a small server-rendered Flask application for practicing
the English alphabet. Flask renders a single page containing 26 letter cards;
the browser handles card interactions, progress for the current page session,
speech synthesis, and optional musical accompaniment.

The application has no database, user accounts, API, build pipeline, or
third-party browser assets. Learned-letter progress and audio state exist only
in memory in the current browser page and reset when that page is reloaded.

## Architecture

```text
Browser
  GET /
    |
    v
Flask app (app.py)
  index route + fixed A–Z data
    |
    v
Jinja template (templates/index.html)
  HTML + references to local static assets
    |
    +--> CSS (static/css/style.css)
    +--> JavaScript (static/js/app.js)
           |--> Web Speech API (spoken letters and words)
           +--> Web Audio API (generated accompaniment)
```

### Request and rendering flow

1. The browser requests `/`.
2. The `index` route in `app.py` passes the module-level `LETTERS` list to
   `templates/index.html`.
3. Jinja renders the 26 cards and their accessible labels. Flask/Jinja
   autoescaping remains enabled.
4. The template loads the stylesheet and script from Flask's `/static/` route.
5. Browser-side JavaScript adds interaction handlers and updates the page
   without additional server requests.

The only application route is `GET /`. Flask's static-file handler serves the
assets. There are no write routes or persistent user data.

### Browser audio

- Pronunciation uses the browser's Web Speech API (`speechSynthesis` and
  `SpeechSynthesisUtterance`).
- Accompaniment is generated with the Web Audio API (`AudioContext`); no audio
  files or audio service are required.
- Speech and accompaniment can be unavailable or restricted by browser,
  operating-system, or autoplay settings. The accompaniment toggle controls
  generated music; it does not enable or disable speech.
- The browser retains progress in a JavaScript `Set` only for the lifetime of
  the page.

## Components

| Component | Responsibility |
|---|---|
| `app.py` | Creates the Flask application, configures session-cookie options, applies response security headers, defines the fixed alphabet data, and renders the home page. Running this file directly starts Flask's development server with debug disabled. |
| `templates/index.html` | Defines the page structure, controls, progress display, accessible status region, and Jinja loop that renders letter cards. |
| `static/js/app.js` | Implements card selection, keyboard activation, random unlearned-letter selection, progress display, speech playback, and generated accompaniment. |
| `static/css/style.css` | Defines page layout, responsive card grid, colors, focus/hover styles, and reduced-motion styling. |
| `requirements.txt` | Declares Flask as the sole Python application dependency. |
| `README.md` | Provides quick-start instructions and brief deployment/security guidance. |

### Asset source of truth

The template references the files under `static/`; those are the assets Flask
serves to the browser. Root-level `app.js` and `style.css` are also present and
currently duplicate the static assets, but are not referenced by the template.
Keep the served `static/` files in sync if both copies are retained.

## Dependencies and tooling

### Runtime dependencies

- **Python:** Use a Python version supported by the installed Flask 3.x release.
  Python 3.9 or newer is recommended for current Flask 3.x releases.
- **Flask:** `Flask>=3.0,<4.0`, installed from `requirements.txt`.
- **Browser APIs:** Web Speech API and Web Audio API are provided by the
  browser; they are not Python or npm dependencies.

There is no `package.json`, frontend package manager, database, or asset
bundler. The checked-in `package-lock.json` is empty and does not describe
application dependencies. There is no automated test suite or test-runner
configuration in the repository.

## Installation and local development

### Prerequisites

- Python 3.9 or newer, with `venv` and `pip`.
- A modern browser. Speech output requires a browser with speech synthesis and
  an available system voice.

### Linux and macOS

From the repository root:

```sh
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python app.py
```

### Windows PowerShell

```powershell
py -3 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python app.py
```

Open <http://127.0.0.1:5000/>. The app is configured with
`SESSION_COOKIE_SECURE=True`, so session cookies are only sent over HTTPS.
The current application does not create or depend on sessions; if session
features are added, use HTTPS when testing them.

To configure a signing key before introducing session-dependent features, set
`FLASK_SECRET_KEY` to a long, randomly generated value. For example, generate
one locally with:

```sh
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

Set the resulting value in the environment using your operating system's
environment-variable mechanism or deployment secret store. Do not commit the
secret to the repository. The application currently reads this setting but
does not use sessions.

## Deployment

### Production requirements

Do not expose Flask's development server to the public internet. Run the
application with a production WSGI server appropriate for the deployment
platform, and place it behind a trusted HTTPS-terminating reverse proxy.
Production WSGI servers are not included in `requirements.txt`; install and
pin the server selected for your platform as part of deployment.

For example, on a Linux environment where Gunicorn has been installed:

```sh
gunicorn --bind 127.0.0.1:8000 app:app
```

Configure the reverse proxy to forward requests to the WSGI server, serve the
site over HTTPS, and set HSTS only when HTTPS is correctly enforced for the
domain. Keep the WSGI server bound to a private interface or socket rather than
exposing it directly.

### Configuration and security headers

`app.py` sets the following session-cookie options:

- `Secure`
- `HttpOnly`
- `SameSite=Lax`

It also adds response headers for Content Security Policy, MIME-sniffing
protection, framing protection, referrer policy, cross-origin isolation
policies, and browser permissions. The current Content Security Policy permits
same-origin scripts, styles, and connections, and disallows plugins and
framing. If deployment changes the origin or adds third-party assets or
integrations, review and deliberately update the policy rather than broadly
allowing inline code or arbitrary origins.

HSTS is not set by the application; configure it at the HTTPS reverse proxy
after confirming the site's HTTPS setup. The response header hook uses
`setdefault`, so a header supplied upstream or by another Flask component is
not overwritten.

### Operational notes

- The app has one page and no health-check endpoint. A deployment can check
  `GET /` for basic application availability.
- There is no database migration, persistent storage, background worker, or
  scheduled task.
- Learned progress is not shared between devices or preserved after reload.
- Configure process supervision, logs, TLS, and resource limits in the hosting
  platform or reverse proxy.

## Troubleshooting

| Symptom | Checks and actions |
|---|---|
| The page is unavailable at `127.0.0.1:5000` | Confirm the virtual environment is active, dependencies installed, and `python app.py` is still running. Check whether another process already uses port 5000. |
| The page loads without styling or interactions | Confirm `static/css/style.css` and `static/js/app.js` exist in the deployed package and that requests to `/static/css/style.css` and `/static/js/app.js` return successfully. The root-level duplicate files are not loaded by the template. |
| A letter does not speak | Check browser support for speech synthesis, system volume, and available speech voices. Try another supported browser. Browser or operating-system speech settings may block or lack voices. |
| Accompaniment does not play | Check that the accompaniment toggle says “On,” that the browser supports Web Audio, and that audio is not muted or blocked by browser policy. Start playback through a user click or key press. |
| Audio stops unexpectedly | Browser speech or audio playback can be interrupted by a new selection, a browser restriction, or an audio-device change. Try the card again and check the browser console for errors. |
| Progress returns to zero | This is expected after reloading or opening a new page. Progress is stored only in page memory and is not persisted. |
| Session cookies are absent over local HTTP | This is expected for cookies marked `Secure`. The current app does not require session cookies; test future session-dependent behavior over HTTPS. |
| A deployment serves unexpected assets | Check the rendered page's asset URLs and the deployed `static/` directory. The Jinja template uses Flask's `url_for('static', ...)` paths. |
| A change appears not to take effect | Restart the development server after Python changes, reload the browser, and inspect the browser's Network and Console panels. Production asset caching may require cache invalidation when publishing updated static files. |

## Maintenance

When changing the alphabet, update the `LETTERS` records in `app.py` and
preserve the four-value tuple shape consumed by the template. When changing
client-side behavior or styling, update the files under `static/`, because
those are the runtime assets. Consider removing the duplicate root-level
`app.js` and `style.css` or establishing a single source of truth to prevent
the copies from drifting.
