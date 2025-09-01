// Simple test script to verify authentication flow
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Test JWT creation (simulating login)
const testParticipant = {
  participantId: 'test-participant-id',
  email: 'test@example.com',
  role: 'participant'
};

const token = jwt.sign(testParticipant, JWT_SECRET, { expiresIn: '7d' });
console.log('Generated token:', token);

// Test JWT verification (simulating API endpoint)
try {
  const decoded = jwt.verify(token, JWT_SECRET);
  console.log('Decoded token:', decoded);
  
  if (decoded.participantId) {
    console.log('✅ participantId found in token:', decoded.participantId);
  } else {
    console.log('❌ participantId NOT found in token');
  }
} catch (error) {
  console.log('❌ JWT verification failed:', error.message);
}
