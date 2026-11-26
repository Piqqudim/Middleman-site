import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const rulesText = fs.readFileSync('firestore.rules', 'utf8');

test('firestore.rules enforces default deny and verified auth checks', () => {
  assert.match(rulesText, /match \/\{document=\*\*\} \{\s*allow read, write: if false;/);
  assert.match(rulesText, /request\.auth\.token\.email_verified == true/);
  assert.match(rulesText, /isValidId\(/);
});

test('firestore.rules isolates user PII and locks terminal application states', () => {
  assert.match(rulesText, /match \/users\/\{userId\}[\s\S]*allow list: if false;/);
  assert.match(rulesText, /!\(existing\(\)\.status in \['Approved & Closing', 'Withdrawn'\]\)/);
  assert.match(rulesText, /incoming\(\)\.diff\(existing\(\)\)\.affectedKeys\(\)\.hasOnly\(/);
});
