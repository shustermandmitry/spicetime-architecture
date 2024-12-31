import { describe, it, expect } from 'vitest';
import { baseEntitySchema } from '../schema';

describe('Base Entity Schema', () => {
  it('validates complete entity', () => {
    const entity = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Test Entity',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = baseEntitySchema.safeParse(entity);
    expect(result.success).toBe(true);
  });

  it('rejects invalid uuid', () => {
    const entity = {
      id: 'not-a-uuid',
      name: 'Test Entity',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = baseEntitySchema.safeParse(entity);
    expect(result.success).toBe(false);
  });

  it('rejects empty name', () => {
    const entity = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = baseEntitySchema.safeParse(entity);
    expect(result.success).toBe(false);
  });
});