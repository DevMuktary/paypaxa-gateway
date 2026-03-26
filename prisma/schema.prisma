generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// --- ENUMS (Strict Data Rules) ---

enum Environment {
  SANDBOX
  LIVE
}

enum KycTier {
  UNVERIFIED  // Cannot process real payments yet
  STARTER     // Basic KYC (NIN/BVN) - Processing limits apply
  REGISTERED  // Full Corporate KYC (CAC) - Unlimited processing
}

enum TransactionStatus {
  PENDING
  SUCCESS
  FAILED
  REFUNDED
}

// --- MODELS ---

// 1. The Gateway User (The human logging in)
model User {
  id              String     @id @default(uuid())
  email           String     @unique
  firstName       String
  lastName        String?
  passwordHash    String
  
  // Security & Auth (Unified for Email Verification and 2FA)
  isEmailVerified Boolean    @default(false)
  twoFactorOtp    String?
  twoFactorExpiry DateTime?
  
  createdAt       DateTime   @default(now())
  updatedAt       DateTime   @updatedAt

  // A single user can own multiple businesses (Enforced to max 3 via API)
  businesses      Business[] 
}

// 2. The Merchant Business (The entity processing payments)
model Business {
  id              String     @id @default(uuid())
  userId          String
  name            String
  email           String     // Business support email
  
  // Gateway State
  kycTier         KycTier    @default(UNVERIFIED)
  isLiveEnabled   Boolean    @default(false) // Locked to Sandbox until KYC passes
  
  createdAt       DateTime   @default(now())
  updatedAt       DateTime   @updatedAt

  // Relationships
  user            User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  apiKeys         ApiKey[]
  transactions    Transaction[]
  customers       Customer[]

  // Prevents a user from creating two businesses with the exact same name
  @@unique([userId, name])
}

// 3. Developer API Keys (Separated by Sandbox/Live)
model ApiKey {
  id              String      @id @default(uuid())
  businessId      String
  environment     Environment @default(SANDBOX)
  
  publicKey       String      @unique // e.g., pk_test_12345
  secretKey       String      @unique // Stored raw during MVP so we can reveal it in the UI
  webhookUrl      String?     // The merchant's endpoint for payment callbacks
  
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt // Tracks when the key or webhook was last modified

  business        Business    @relation(fields: [businessId], references: [id], onDelete: Cascade)
}

// 4. The End Customer (The person paying the Merchant)
model Customer {
  id              String      @id @default(uuid())
  businessId      String
  email           String
  firstName       String?
  lastName        String?
  phone           String?
  
  createdAt       DateTime    @default(now())

  business        Business    @relation(fields: [businessId], references: [id], onDelete: Cascade)
  transactions    Transaction[]

  // A business cannot have duplicate customer emails
  @@unique([businessId, email]) 
}

// 5. The Financial Ledger (Transactions)
model Transaction {
  id              String            @id @default(uuid())
  businessId      String
  customerId      String?
  
  environment     Environment       @default(SANDBOX)
  amount          Decimal           @db.Decimal(12, 2) // Precise financial decimal to prevent rounding errors
  currency        String            @default("NGN")
  reference       String            @unique // The merchant's custom reference
  gatewayRef      String            @unique // PAYPAXA's internal tracking reference
  
  status          TransactionStatus @default(PENDING)
  paymentMethod   String?           // e.g., "CARD", "TRANSFER", "USSD"
  
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt

  business        Business          @relation(fields: [businessId], references: [id], onDelete: Cascade)
  customer        Customer?         @relation(fields: [customerId], references: [id], onDelete: SetNull)
}
