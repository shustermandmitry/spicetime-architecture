#!/bin/sh
# Husky hook: Trigger Gatsby site rebuild

echo "Triggering Gatsby rebuild..."
cd docs/gatsby || exit
gatsby build
echo "✅ Documentation rebuilt."