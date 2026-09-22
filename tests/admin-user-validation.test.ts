import test from 'node:test';
import assert from 'node:assert/strict';

import { normalizeRole, validateUserPayload } from '@/lib/validators';

test('normalizeRole accepts valid roles and rejects invalid values', () => {
  assert.equal(normalizeRole('ADMIN'), 'ADMIN');
  assert.equal(normalizeRole('COUNSELOR'), 'COUNSELOR');
  assert.equal(normalizeRole('auditor'), null);
  assert.equal(normalizeRole(''), null);
});

test('validateUserPayload enforces required fields and valid email', () => {
  const valid = validateUserPayload({
    name: 'Aisha Khan',
    email: 'aisha@meezab.com',
    password: 'StrongPass123',
    role: 'COUNSELOR',
  });

  assert.deepEqual(valid, {
    name: 'Aisha Khan',
    email: 'aisha@meezab.com',
    password: 'StrongPass123',
    role: 'COUNSELOR',
  });

  assert.throws(() => {
    validateUserPayload({
      name: 'Bad',
      email: 'not-an-email',
      password: '123',
      role: 'ADMIN',
    });
  });
});
