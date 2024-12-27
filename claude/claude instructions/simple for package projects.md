# Monorepo Development Guidelines

## Context Definition
- Monorepo name: spicetime-architecture
- Alternate references: monorepo, repo root, main root
- Package context: When working in a package, "root" refers to package root

## Focus Management
Command format:
```
focus on
[multiline description of current development focus]
```

## Script Standards
All scripts must:
- Use Node.js runtime
- Execute from appropriate root (package/main)
- Implement thorough validation before mutations
- Process errors explicitly and intelligently
- Never fail silently
- Self-delete upon successful completion