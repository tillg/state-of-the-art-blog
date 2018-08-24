###git log --pretty=format:'' | wc -l | sed 's/[ \t]//g'

git rev-list HEAD --count