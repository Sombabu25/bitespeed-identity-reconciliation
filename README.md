# Bitespeed Identity Reconciliation API

This project is a backend API built for the **Bitespeed Backend Task**.
It reconciles customer identities by linking contacts based on shared **email** and **phone numbers**.

The API ensures that all related contacts are grouped under a **primary contact**, while additional contacts are stored as **secondary contacts**.

---

## Tech Stack

* Node.js
* Express.js
* TypeScript
* Prisma ORM
* MySQL

---

## API Endpoint

### Identify Contact

POST `/identify`

This endpoint identifies and links contacts based on email and/or phone number.

#### Request Body

```json
{
  "email": "example@test.com",
  "phoneNumber": "1234567890"
}
```

#### Response Format

```json
{
  "contact": {
    "primaryContactId": 1,
    "emails": [
      "example@test.com"
    ],
    "phoneNumbers": [
      "1234567890"
    ],
    "secondaryContactIds": []
  }
}
```

---

## How the Logic Works

1. When a request is received, the API searches for contacts matching the provided **email** or **phone number**.
2. If no contact exists:

   * A new **primary contact** is created.
3. If a matching contact exists:

   * The new data is linked as a **secondary contact**.
4. The API returns the **primary contact ID** along with all associated emails and phone numbers.

---

## Database Schema

The application uses the following Prisma model:

```prisma
model Contact {
  id             Int      @id @default(autoincrement())
  email          String?
  phoneNumber    String?
  linkedId       Int?
  linkPrecedence String
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  deletedAt      DateTime?
}
```

---

## Running Locally

### 1. Clone the repository

```
git clone https://github.com/Sombabu25/bitespeed-identity-reconciliation.git
```

### 2. Install dependencies

```
npm install
```

### 3. Setup environment variables

Create a `.env` file:

```
DATABASE_URL="mysql://username:password@localhost:3306/bitespeed"
PORT=3000
```

### 4. Run migrations

```
npx prisma migrate dev
```

### 5. Start the server

```
npm run dev
```

Server runs on:

```
http://localhost:3000
```

---

## Deployment

The API can be deployed on platforms like:

* Render
* Railway
* Vercel (serverless adaptation)

---

## Author

Sombabu Patel
Computer Science Undergraduate
