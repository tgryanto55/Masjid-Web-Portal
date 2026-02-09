# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.1] - 2026-02-09

### Added
- **Smart Batching**: New `/public-data` endpoint in Backend to consolidate multiple public requests into a single call, reducing network overhead by 80%.
- **Floating Glassmorphism Footer**: Redesigned the public footer as a detached, blurred "pod" to match the modern navbar aesthetic.
- **Hero & Header Blending**: Implemented smooth gradient transitions between hero sections and content, eliminating sharp visual borders.
- **Immersive Hero Sections**: Full-viewport hero sections for Home and About pages for a more premium visual experience.
- **Improved Security**: Added `.env.example` and consolidated `.gitignore` to prevent sensitive data exposure.
- **Documentation**: Enhanced all `README.md` files with unified setup instructions and cross-references.

### Changed
- **Floating Navbar Refinement**: Adjusted public content layout to eliminate overlaps and ensure consistent width across all pages.
- **Improved Alignment**: Vertically centered hero content on Home and About pages.
- **Enhanced Spacing**: Increased header heights for Events, Donation, and Contact pages for better legibility.
- **Login Page Fix**: Resolved layout overlap between the floating navbar and the Admin Login form.
- **Stability Tuning**: Increased backend rate limit to 2000 and optimized frontend polling interval to 30 seconds to prevent periodic disconnects.
- **Git Configuration**: Consolidated subdirectory `.gitignore` rules into the root folder.
- **Backend Architecture**: Added explicit ignore for `Backend/src/uploads/` to keep repository clean of test media.

### Fixed
- **Connection Stability**: Resolved issues where frontend would periodically lose connection to the backend due to rate limiting.
- **Layout Overlaps**: Fixed several instances of content being obscured by the floating navbar.
- **Security Audit**: Removed `.env` and `node_modules` from Git tracking in the Backend component.

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
