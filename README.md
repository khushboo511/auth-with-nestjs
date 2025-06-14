# 📄 Secure Chat Application - Backend BRD (Business Requirements Document)

## 📘 Overview
A secure enterprise chat application supporting:
- One-to-one and group messaging
- End-to-end encryption (E2EE)
- File sharing with optional encryption
- Presence tracking and real-time communication
- Optimized for <1000 users in a small enterprise

---

## 🎯 Goals
- Deliver a secure, fast, and reliable internal messaging system
- Ensure complete privacy via client-side encryption
- Maintain FIFO message delivery and offline support

---

## 🧠 Core Features

| #  | Feature                  | Description |
|----|--------------------------|-------------|
| 1  | Authentication           | Signup/Login with JWT. Store public keys for encryption. |
| 2  | End-to-End Encryption    | Clients encrypt with recipient’s public key. Server stores ciphertext only. |
| 3  | Real-time Messaging      | WebSocket gateway using NestJS and Redis Pub/Sub. |
| 4  | Presence Management      | Redis for tracking online/offline status. |
| 5  | Group Chat               | Groups with members and roles. Messages broadcast to group. |
| 6  | File Sharing             | Files uploaded to S3/CDN. Optionally E2EE. Metadata stored. |
| 7  | Search                   | Client-side search only via Fuse.js. Server offers paginated APIs. |
| 8  | Rate Limiting            | Redis keys with TTL to detect and block spamming. |
| 9  | Offline Delivery         | Store undelivered messages. Deliver in FIFO when recipient reconnects. |
| 10 | Message Forwarding       | Create new message with copied ciphertext and metadata. |

---

## 🏗️ Tech Stack

| Component       | Technology        |
|------------------|-------------------|
| Backend          | NestJS (Node.js)  |
| User DB          | PostgreSQL        |
| Message & File DB| MongoDB           |
| Realtime Pub/Sub | Redis             |
| Encryption       | Client-side E2EE  |
| File Storage     | S3 / Cloudinary   |
| Rate Limiting    | Redis             |
| Optional Queue   | RabbitMQ (notifications, retries) |

---

## 🗃️ Data Models

### PostgreSQL (Users)
```sql
User {
  id
  email
  password
  publicKey
  createdAt
}
```

### MongoDB (Messages, Groups, Files)
```json
Message {
  chatId,
  senderId,
  receiverId / groupId,
  ciphertext,
  timestamp,
  status
}

Group {
  id,
  name,
  members: [],
  roles: {}
}

File {
  ownerId,
  fileType,
  url,
  chatId,
  timestamp
}
```

### Redis (In-memory)
- `presence:userId = online/offline`
- `rate:userId:chatId = count (TTL 5s)`
- `activeSockets:groupId = [socketIds]`

---

## 🗓️ Weekly Development Milestones

| Week | Backend Focus |
|------|---------------|
| 1    | Auth system, key generation/storage, JWT setup |
| 2    | WebSocket setup, JWT handshake, 1:1 chat logic |
| 3    | Redis Pub/Sub, Message storage, Presence logic |
| 4    | Group chat creation, message routing, MongoDB schemas |
| 5    | File sharing (S3 CDN), metadata APIs, optional E2EE for files |
| 6    | Pagination, search prep, rate limiting, cleanup, testing |

---

## 📌 Notes
- All message encryption/decryption happens **only on client**.
- Backend only stores and routes encrypted data.
- RabbitMQ is optional and used for background tasks (retries, notifications).
- Redis ensures fast ephemeral storage for presence and rate control.

---

## 🔐 Security Checklist
- ✅ JWT Auth with refresh tokens
- ✅ Public/Private keypair for each user
- ✅ No plaintext messages stored
- ✅ Rate limiting & spam protection

---

## 📦 Future Enhancements
- Push notifications using FCM/Expo
- Typing indicators
- Message read receipts
- Admin/moderator dashboard

---

> © 2025 Secure Chat Team — Backend Architecture and Roadmap
