# Security Policy

## Reporting a Vulnerability

This is a static, client-side showcase project with no server runtime in production (GitHub Pages). Still, if you find a security issue — an exposed secret, a dependency vulnerability, an XSS vector in the forms, or anything else — please do not open a public issue.

Report it privately by emailing the repository owner, or open a GitHub Security Advisory from the repo's Security tab. You'll get a response within 5 business days.

## What We Track

- Dependency vulnerabilities (`npm audit`)
- Secrets accidentally committed to the repository
- Client-side scripting issues in the contact/subscribe forms

## Notes

- The `/api/*` routes are development-only and are removed from the static export during the GitHub Pages build. They are not reachable in production.
- `database.json` contains generated demo data only — no personal information.
- The site does not collect or transmit user data beyond standard email-subscribe entries in local dev mode.
