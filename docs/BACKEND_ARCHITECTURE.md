# NestJS Backend Architecture Guide

## Goals
- Enterprise-ready module boundaries.
- Replaceable OAuth provider layer (Google, Microsoft, future providers).
- MFA abstraction for email OTP, phone OTP, and authenticator app (TOTP).
- Secure payment gateway abstraction with webhook signature verification.

## Folder Structure

```text
src/
  app.module.ts
  main.ts
  common/
    constants/
    guards/
    interfaces/
    middleware/
    utils/
  config/
  database/
    database.module.ts
    prisma.service.ts
  modules/
    auth/
      controllers/
      dto/
      mfa/
      oauth/
      services/
    payment/
      controllers/
      dto/
      interfaces/
      services/
```

## Authentication Design
- `OauthOrchestratorService` is a wrapper that dispatches login requests to the selected provider by name.
- Add a new provider by implementing `OauthProvider` and registering it in `AuthModule`.
- MFA starts immediately after OAuth login.
- `MfaService` routes challenges to channel-specific providers (`email`, `phone`, `totp`).

## MFA Extension Pattern
1. Implement `MfaProvider`.
2. Register provider in `AuthModule`.
3. Add channel mapping in `MfaService`.

## Payment Security Pattern
- `PaymentGatewayService` encapsulates payment provider operations.
- HMAC-SHA256 webhook signature verification is done with timing-safe comparison.
- Keep webhook secret in secret manager (Vault/AWS Secret Manager), not hardcoded.

## Best Practices Checklist
- Strict DTO validation using global `ValidationPipe`.
- Request correlation ID middleware for observability.
- Keep business logic in services, controllers thin.
- Use interfaces as anti-corruption layer between modules and vendors.
- Use Prisma as ORM with `DatabaseModule` global provider.

## Cookie-based Authentication & Authorization
- Access tokens are delivered and stored in `HttpOnly` cookies (`access_token`) after MFA verification.
- Authorization is enforced by `JwtCookieAuthGuard`, which reads tokens from cookies and attaches user context.
- Use `SameSite=Strict`, `Secure` in production, and short cookie TTL.

## Secure CORS Policy
- CORS is configured with explicit origin allowlist from `CORS_ORIGINS` environment variable.
- Credentials are enabled so browser cookies can be sent safely from trusted origins only.
- Avoid wildcard origins in production.


## Repository & Entity per Module
- Each domain module owns its own `entities/` and `repositories/` directories.
- `AuthRepository` handles user/MFA challenge persistence boundary for auth use-cases.
- `PaymentRepository` handles payment state persistence boundary for payment use-cases.
- Services must call repositories (not direct DB client) to keep business logic isolated from storage details.
