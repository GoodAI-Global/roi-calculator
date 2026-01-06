# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Security Model

This is a **client-side only** application:

- All calculations run in the browser
- No data is transmitted to any server
- No user data is stored or persisted
- No authentication or authorization required
- No API keys or secrets in the codebase

## Reporting a Vulnerability

If you discover a security vulnerability, please report it by:

1. **Email**: security@goodai.com
2. **Subject**: `[SECURITY] roi-calculator: <brief description>`

Please include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### Response Timeline

- **Acknowledgment**: Within 48 hours
- **Initial Assessment**: Within 7 days
- **Resolution Target**: Within 30 days for critical issues

### What to Expect

- We will acknowledge receipt of your report
- We will investigate and validate the issue
- We will work on a fix and coordinate disclosure
- We will credit you in the release notes (unless you prefer anonymity)

## Security Best Practices

When contributing:

1. **No secrets in code** — Never commit API keys, tokens, or credentials
2. **Sanitize inputs** — All user inputs are sanitized before use
3. **No eval()** — Dynamic code execution is prohibited
4. **No innerHTML** — Use React's JSX for rendering
5. **Dependency updates** — Keep dependencies current via Dependabot

## Known Limitations

- PDF export uses client-side rendering (html2canvas) which may have limitations
- Scenario data is stored in React state only (lost on page refresh)
- No Content Security Policy headers (static site deployment dependent)
