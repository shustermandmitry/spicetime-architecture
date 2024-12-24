import { describe, it, expect } from 'vitest';
import { ContentAggregator } from '../src/index';

describe('ContentAggregator', () => {
  it('should initialize without sources', () => {
    const aggregator = new ContentAggregator();
    expect(aggregator).toBeTruthy();
  });

  it('should allow adding sources', () => {
    const aggregator = new ContentAggregator();
    aggregator.addSource({ type: 'api', endpoint: 'https://example.com' });
    expect(aggregator).toMatchObject({ sources: [{ type: 'api', endpoint: 'https://example.com' }] });
  });

  it('should aggregate data correctly', async () => {
    const aggregator = new ContentAggregator();
    aggregator.addSource({ type: 'api', endpoint: 'https://example.com' });

    const result = await aggregator.aggregate();
    expect(result).toEqual([{ type: 'api', endpoint: 'https://example.com' }]);
  });
});