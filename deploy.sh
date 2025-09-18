#!/bin/bash

# Deployment script for GitHub Pages

echo "Starting deployment process..."

# Check if we're on the main branch
current_branch=$(git branch --show-current)
if [ "$current_branch" != "main" ]; then
    echo "⚠️  You're not on the main branch. Current branch: $current_branch"
    read -p "Do you want to continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check if there are uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "⚠️  You have uncommitted changes. Please commit or stash them before deploying."
    git status --short
    exit 1
fi

# Check if gh-pages branch exists
if ! git show-ref --quiet refs/heads/gh-pages; then
    echo "Creating gh-pages branch for the first time..."
    git branch gh-pages
fi

echo "Building project for production..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

echo "Switching to gh-pages branch..."
git checkout gh-pages

echo "Merging changes from main..."
git merge main --no-edit

echo "Adding dist directory to commit..."
git add dist -f

echo "Committing deployment changes..."
git commit -m "Deployment commit $(date '+%Y-%m-%d %H:%M:%S')"

echo "Pushing to gh-pages branch..."
git subtree push --prefix dist origin gh-pages

if [ $? -ne 0 ]; then
    echo "❌ Push failed. Trying force push..."
    git push origin `git subtree split --prefix dist gh-pages`:gh-pages --force
fi

echo "Switching back to main branch..."
git checkout main

echo "✅ Deployment completed successfully!"
echo "📋 Your site will be available at: https://<your-username>.github.io/<your-repo-name>/"