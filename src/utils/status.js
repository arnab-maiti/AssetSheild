export const allowedStatuses = [
  "pending_mint",
  "active",
  "expired",
  "revoked",
  "mint_failed",
  "fraud_detected",
  "suspended"
];

export const allowedTransitions = {

  pending_mint: [
    "active",
    "mint_failed"
  ],

  active: [
    "expired",
    "revoked",
    "suspended",
    "fraud_detected"
  ],

  expired: [
    "active"
  ],

  suspended: [
    "active",
    "revoked"
  ],

  fraud_detected: [
    "revoked"
  ],

  revoked: [],

  mint_failed: [
    "pending_mint"
  ],

};
