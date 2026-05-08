export const allowedStatuses = [
  "active",
  "expired",
  "revoked",
  "fraud_detected",
  "suspended"
];

export const allowedTransitions = {

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

  revoked: []

};