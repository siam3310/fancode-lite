#!/bin/bash

# Check if a commit message is provided
if [ -z "$1" ]; then
  echo "Error: Please provide a commit message."
  echo "Usage: ./update.sh \"Your commit message\""
  exit 1
fi

# Pull latest changes from remote and rebase
echo "Pulling latest changes..."
git pull origin main --rebase

# Add all changed files
echo "Adding files..."
git add .

# Commit with the provided message
echo "Committing changes..."
git commit -m "$1"

# Push to the remote repository
echo "Pushing to remote..."
git push

echo "Successfully updated the repository."
