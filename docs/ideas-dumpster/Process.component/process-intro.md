# Process: A Simple Pattern for Everything

## The Whole Idea in Five Points

1. Everything is a component
2. Components live in a graph
3. Components change state based on what they see in the graph
4. Time is just ticks that drive these changes
5. Each domain (like web dev) has its own patterns of change

## What Makes This Powerful

The power lies in how this same simple pattern works everywhere:

- Building a component? That's a process
- Deploying code? That's a process
- Creating a blog post? That's a process
- The editor you're using? That's a process

They all just react to their slice of the graph, following their own rules about when to change.

## How It Works in Practice

Take web development as an example:

- Your code lives in the graph (think git)
- Dependencies are connections in the graph
- Changes to code are state changes
- Build and deploy are just processes watching for these changes
- Each tool is a component that can react to what it sees

## Why This Matters

This pattern gives us:

- A unified way to think about systems
- Natural composition of processes
- Clear rules for state changes
- Tools that understand each other
- Domains that can interact cleanly

## The Rest of the Story

The documents that follow will show you:

- How to build with this pattern
- Common process types you'll use
- Ways to compose bigger systems
- Tools that make it all work

But remember: it all comes back to these simple ideas. Components, graphs, state changes, ticks, and patterns. That's
all there is to it.