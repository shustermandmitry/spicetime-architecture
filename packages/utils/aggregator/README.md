# @spicetime/aggregator

File content aggregator utility for gathering and combining source files. Part of the SpiceTime architecture toolkit.

## Installation

```bash
# Global installation (enables CLI usage)
npm install -g @spicetime/aggregator

# Local installation
npm install @spicetime/aggregator
```

## CLI Usage

```bash
# Aggregate all JavaScript files in src directory
spicetime-aggregate --paths "./src" --extensions ".js"

# Multiple paths and extensions
spicetime-aggregate -p "./src,./lib" -e ".js,.jsx" -o "aggregated.txt"

# With exclude patterns and depth limit
spicetime-aggregate --paths "./src" --exclude "tests,fixtures" --max-depth 2
```

CLI Options:

- `-p, --paths`: Comma-separated paths to include (default: "./src")
- `-e, --extensions`: File extensions to process (default: ".js,.jsx")
- `-x, --exclude`: Patterns to exclude (default: "node_modules,dist")
- `-d, --max-depth`: Maximum directory depth (default: Infinity)
- `-o, --output`: Output file path (prints to stdout if not specified)

## API Usage

```javascript
import Aggregator from '@spicetime/aggregator';

const aggregator = new Aggregator({
    includePaths: ['./src'],
    extensions: ['.js'],
    excludePatterns: ['node_modules'],
    maxDepth: 3
});

const result = await aggregator.aggregate();
console.log(`Processed ${result.stats.totalFiles} files`);
```

## License

MIT