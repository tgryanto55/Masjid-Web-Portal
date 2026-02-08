# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2026-02-09

### Added
- **Root Configuration**: Added `package.json` to root for unified command execution (`npm run install-all`, `dev`, `start`).
- **Concurrent Execution**: Implemented `concurrently` to run Frontend and Backend simultaneously.
- **Documentation**: Added comprehensive READMEs for Root, Frontend, and Backend with clear setup and run instructions.
- **Build Artifacts**: Generated production builds for Frontend (`/Frontend/dist`) and Backend (`/Backend/dist`).
- **Hybrid Image Storage**: Implemented file-based storage for Event posters (Multer) and Base64 for smaller images (QRIS, Profile).
- **Frontend Features**:
  - Glassmorphism UI design with Tailwind CSS v4.
  - Prayer Times widget with countdown.
  - Events management (CRUD) with image upload.
  - Financial management (Infaq/Expense) with charts and pagination.
  - Donation info with QRIS and Copy-to-Clipboard.
- **Backend Features**:
  - Express.js API with TypeScript.
  - Sequelize ORM with MySQL.
  - JWT Authentication and Helmet security.
  - Rate limiting and compression.

### Changed
- **Configuration**: moved Tailwind configuration to `src/index.css` (Tailwind v4 standard).
- **API Configuration**: Clarified API Base URL handling in `src/services/api.ts`.
- **Project Structure**: Organized into clear `Frontend` and `Backend` directories with a root coordinator.

### Fixed
- **Frontend Build**: Resolved linting errors (`unused imports`, `unused state`) in `ManageFinace.tsx` and `Events.tsx`.
- **Documentation**: Corrected `tailwind.config.js` references to point to `src/index.css`.
- **Backend README**: Clarified absence of `preview` script for Backend.
