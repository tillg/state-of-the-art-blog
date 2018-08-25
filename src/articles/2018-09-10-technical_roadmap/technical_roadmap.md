---
date: 2018-08-10
title: Technical road map & change log
template: article.jade
excerpt: A list of features that are planned to be developed together with their priority. Be aware that things might change...!
picture: roadmap.jpg
---

The list of things that I plan to do in the order I want to do them: (huhu)

* Fix bugs...
* Paging when there are too many entries so the index would become too long
* A document with incomplete title must break the build
* We create our own excerpt instead of using [this Metalsmith Plugin](https://github.com/segmentio/metalsmith-excerpts). Using an existing tool is probably better...
* Check the guide to set up a new blog site really works
* Make sure no broken links can get on our site. Look at this:
  * https://github.com/gchallen/code.metalsmith-linkcheck
  * https://github.com/davidxmoody/metalsmith-broken-link-checker
* Image management: Images should be shrinked in size if bigger than a threshold value. And they should link to the full resolution image.

## Bugs

* Pictures seem wrongly sized, see at the bottom of this article.

## History

### 2018-08-24 in Bali

* Articles can now have pictures or not and a title/subtitle above the picture - or not.
* Bug: Google reporting doesn't work. Was an error in the `script` tag in Jade...

### 2018-08-21 at home

* Fixed and re-built the ESlint setup
* Re-setup the interaction between nodemon and browserSync
* Articles can have excerpts

### 2018-08-09 on the go

* Integrated the Google fonts to be downloaded from the same source, so the site runs entirely offline. Used [this resource](https://google-webfonts-helper.herokuapp.com/)

### 2018-08-08 in a coffee shop in Tam Coc

* Start building checks to ensure that content cannot break the blog. Start with
  * Every article must contain a title, date, template
  * ...or fill those fields with default and produce warnings.
* Structured the pages in portions easier to handle: default is composed of header, main and footer.
* Added pages as templates and build a simple _About_ and _Contact_ page.
* Pages can now reside in sub directories just next to their images.
* Added a sitemap at [http://localhost:3000/sitemap.xml](http://localhost:3000/sitemap.xml)
* Added Google tracking

This is my workplace: ![Coffee Shop](coffeeshop.jpg) But why is the image so large??