# Security review

**Review date:** 2026-10-09

**Scope:** Flask app, Jinja template, static assets, and declared dependencies.

No exploitable vulnerabilities were identified in the reviewed application. The following table summarizes the security risks reviewed and their status.

| Vulnerability | Severity | File Changed | Fix |
|---|---|---|---|
| Flask interactive debugger exposure | High | `app.py` | Disabled debug mode with `app.run(debug=False)`. Use a production WSGI server for public deployments. |
| Missing browser security headers | Medium | `app.py` | Added Content Security Policy, anti-framing, MIME-sniffing, referrer, permissions, and cross-origin policy headers. |
| Content Security Policy allowed inline styles | Medium | `app.py`, `templates/index.html`, `style.css`, `static/css/style.css` | Removed `'unsafe-inline'` from the policy and moved card colors to local CSS selectors. |
| Insecure session-cookie settings or hard-coded signing secret | Low | `app.py`, `README.md` | Configured `Secure`, `HttpOnly`, and `SameSite=Lax` cookies; read `FLASK_SECRET_KEY` from the environment instead of hard-coding a secret. The app currently creates no sessions. |
| Cross-site scripting from user-generated content | Not applicable | None | The app accepts no user-submitted content. Jinja autoescaping is enabled, and the rendered alphabet data is a fixed server-side list. |
| Cross-site request forgery (CSRF) | Not applicable | None | The app has no forms or state-changing routes. Add CSRF tokens if such functionality is introduced. |
| Missing authentication or authorization | Not applicable | None | The app has no authentication system or protected resources; its learning page is intentionally public. |
| SQL injection | Not applicable | None | The app has no database or SQL queries. |
| Known vulnerable dependencies | None found | None | `pip-audit -r requirements.txt` reported no known vulnerabilities in the resolved dependency set on the review date. Re-run dependency auditing regularly. |
| Missing HTTPS / HSTS for public deployment | Low (deployment hardening) | `README.md` | Documented that public deployments should use HTTPS, a production WSGI server, and HSTS at the trusted TLS-terminating reverse proxy. |

## Verification

- Flask test-client checks verified the app and static assets return successfully with the configured security headers.
- Verified session-cookie flags, Jinja autoescaping, and rejection of POST requests to the read-only route.
- `pip-audit -r requirements.txt` reported no known vulnerabilities.
- Python compilation, JavaScript syntax checks, and `git diff --check` passed.
