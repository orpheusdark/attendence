# Secure Attendance System

Enterprise-grade attendance platform for universities, colleges, coaching institutes, and training organizations.

## Architecture

- `apps/api` - Node.js, Express, MongoDB, Redis, Socket.IO, BullMQ
- `apps/web` - React, Vite, TypeScript, Tailwind, ShadCN-style UI
- `apps/mobile` - Expo React Native, TypeScript, NativeWind
- `packages/shared` - shared types, validators, and utilities

## Security posture

- JWT access and refresh tokens with device session tracking
- AES-256 QR payload encryption and signed session binding
- Rolling QR sessions, geofencing, reverse verification, BLE confirmation hooks
- Fraud scoring, audit logging, immutable event records, and anomaly signals

## Run locally

1. Copy `.env.example` to `.env`
2. Start MongoDB and Redis or run `docker compose up -d mongo redis`
3. Install dependencies in each package
4. Run the API, web, and mobile apps from their package scripts

## Notes

This repository is scaffolded to support future additions like face recognition, NFC/RFID, ERP/LMS integrations, and blockchain-backed audit trails without changing core domain boundaries.