/**
 * @module utils/aggregator
 * @category Utils
 * @subcategory Aggregation
 */

export interface AggregatorConfig {
    includePaths: string[];
    extensions?: string[];
    excludePatterns?: string[];
}

export interface AggregateResult {
    files: string[];
    content: string;
}
