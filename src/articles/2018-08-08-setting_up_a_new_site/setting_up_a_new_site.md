---
title: Setting up a new site
date: 2018-08-08
---

If you want to set up a new site based on this template, these are the steps to take:


* Create your own repo on github. let's call this `github.com/YOU/YOUR_BLOG`
* Activate github pages
* Clone the repo like so:

```
git clone https://github.com/tillg/state-of-the-art-blog.git
```

* Set the origin to your repo:

```
git remote rm origin
git remote add origin https://github.com/YOU/YOUR_BLOG.git
git add .
git commit -m "first commit"
git push -u origin master
```

* Link it to [Travis CI](https://travis-ci.org/)
* Edit an article within the `src` directory
* Commit and push:

```
git commit -m "Changed an article"
git push
```

* Wait and go see [https://YOU.github.io/YOUR_BLOG](#)