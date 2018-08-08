#!/bin/bash

echo "Entering deployProd.sh"

set -o errexit -o nounset

rev=$(git rev-parse --short HEAD)
echo "Revision: " + $rev

cd output

echo "Initing and configuring git.."
git init
git config user.name "Till Gartner"
git config user.email "till.gartner@gmail.com"

echo "Setting upstream and branch..."
git remote add upstream "https://$GITHUB_TOKEN@github.com/tillg/state-of-the-art-blog.software"
git fetch upstream
git reset upstream/master

echo "state-of-the-art-blog.software" > CNAME

touch .

echo "Git add, commit and pushing..."
git add -A .
git commit -m "rebuild pages at ${rev}"
git push -q upstream HEAD:master

echo "Gitted on state-of-the-art-blog.software"