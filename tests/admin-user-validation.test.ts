import test from 'node:test';
import assert from 'node:assert/strict';

import { normalizeRole, validateUserPayload, ProgramSchema } from '@/lib/validators';

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

test('ProgramSchema accepts matching year fees', () => {
  const program = ProgramSchema.parse({
    title: 'Bachelor of Computer Science',
    universityId: 'university-1',
    degreeLevel: "Bachelor's Degree",
    faculty: 'School of Computing',
    duration: '3 Years',
    intakeMonths: 'January, May, September',
    tuitionMYR: 60000,
    firstYearFeeMYR: 22000,
    secondYearFeeMYR: 19000,
    thirdYearFeeMYR: 19000,
  });

  assert.equal(program.tuitionMYR, 60000);
});

test('ProgramSchema rejects mismatched year fees and negative values', () => {
  assert.throws(() => {
    ProgramSchema.parse({
      title: 'Bachelor of Computer Science',
      universityId: 'university-1',
      degreeLevel: "Bachelor's Degree",
      faculty: 'School of Computing',
      duration: '3 Years',
      intakeMonths: 'January, May, September',
      tuitionMYR: 60000,
      firstYearFeeMYR: 22000,
      secondYearFeeMYR: 19000,
      thirdYearFeeMYR: 18000,
    });
  });

  assert.throws(() => {
    ProgramSchema.parse({
      title: 'Bachelor of Computer Science',
      universityId: 'university-1',
      degreeLevel: "Bachelor's Degree",
      faculty: 'School of Computing',
      duration: '3 Years',
      intakeMonths: 'January, May, September',
      tuitionMYR: 60000,
      firstYearFeeMYR: -1,
    });
  });
});
