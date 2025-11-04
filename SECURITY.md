# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Currently, the following versions are supported:

| Version | Supported          |
| ------- | ------------------ |
| main    | :white_check_mark: |
| 0.1.0   | :x:                |

## Reporting a Vulnerability

The Minecraft Server Status team takes security bugs seriously. We appreciate your efforts to responsibly disclose your findings.

### How to Report

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to: **[security contact - update with actual email]**

Include the following information:
- Type of vulnerability
- Full paths of source file(s) related to the manifestation of the vulnerability
- Location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

### What to Expect

After you submit a report:

1. **Acknowledgment**: We will acknowledge receipt of your vulnerability report within 48 hours
2. **Communication**: We will send you regular updates about our progress
3. **Validation**: We will work to validate the vulnerability
4. **Fix Development**: If confirmed, we will work on a fix
5. **Disclosure**: We will coordinate the disclosure with you

### Preferred Languages

We prefer all communications to be in English.

## Disclosure Policy

- Security vulnerabilities will be disclosed as soon as a fix is available
- We will credit you in the security advisory (unless you prefer to remain anonymous)
- We ask that you do not publicly disclose the vulnerability until we've had a chance to fix it

## Security Update Process

1. The security issue is received and assigned to a handler
2. The problem is confirmed and affected versions are determined
3. Code is audited to find any similar problems
4. Fixes are prepared for all supported versions
5. Releases are made and security advisory is published

## Best Practices for Users

To ensure you're using this project securely:

1. **Keep Updated**: Always use the latest version
2. **Environment Variables**: Never commit `.env` files to version control
3. **Secrets Management**: Use proper secret management for production deployments
4. **Access Control**: Limit access to production environments
5. **Monitoring**: Monitor your application for suspicious activity
6. **Dependencies**: Regularly update dependencies for security patches

## Security Features

This project includes several security features:

- **Rate Limiting**: IP-based and hostname-based rate limiting
- **CAPTCHA**: Optional Cloudflare Turnstile integration
- **Input Validation**: Server address and parameter validation
- **Environment Variables**: Secure configuration management
- **HTTPS**: SSL/TLS support in production

## Known Security Considerations

- This application makes external requests to Minecraft servers
- User input is validated before processing
- Rate limiting helps prevent abuse
- CAPTCHA protection is optional but recommended for production

## Scope

The following are **in scope** for vulnerability reports:

- Authentication bypass
- SQL injection
- Cross-site scripting (XSS)
- Cross-site request forgery (CSRF)
- Remote code execution (RCE)
- Server-side request forgery (SSRF)
- Broken authentication
- Sensitive data exposure
- Security misconfiguration
- Injection flaws

The following are **out of scope**:

- Denial of service attacks
- Social engineering
- Physical attacks
- Issues in dependencies (report those upstream)
- Issues requiring physical access to the server
- Recently disclosed zero-day vulnerabilities

## Bug Bounty

We currently do not offer a bug bounty program. However, we deeply appreciate responsible disclosure and will publicly acknowledge your contribution (with your permission).

## Comments on This Policy

If you have suggestions on how this process could be improved, please submit a pull request or open an issue.

---

**Thank you for helping keep Minecraft Server Status and our users safe!**
