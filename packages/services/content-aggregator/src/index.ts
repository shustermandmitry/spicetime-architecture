// src/index.ts

// Definition of ContentAggregator
export /**
 * class ContentAggregator
 * @description Auto-generated documentation.
 */
class ContentAggregator {
  sources: Array<{ type: string; endpoint: string }> = [];

  addSource(source: { type: string; endpoint: string }) {
    this.sources.push(source);
  }

  async aggregate() {
    // This mock aggregation logic simply returns the added sources.
    // You can extend it further based on your actual use case.
    return this.sources;
  }
}