---
date: 2018-08-08
title: Requirements for a blog
---

When thinking about a blogging system, these are the requirements I have in mind.

# Basic requirements

The requirements I absolutely need. I wouldn't use a blog without these fetures/functionalities.

* **Page types**: For a blog I don't need many pages. Basically Wordpress gives as a standard structure that seems established:
  * _Index_: The front page of my blog
  * _Article_: The details of one blog entry. I like the term __article__ better though and will therefore use it.
  * _Pages_: This are static pages. The difference to an article is the fact they don't have a date. Typical example are the _About_ page, _Legal_ etc.
* **Responsive**, if not mobile first. Because [51.2% of the internet usage is mobile](https://www.statista.com/topics/779/mobile-internet/).
* **Beautiful**: Although this is very subjective, I think about a beautiful blog. Nowadays nobody wants to read 80'ies like websites anymore. 
* **Fast** as nobody stays on slow websites.
* **Static**. See here [why static makes sense to me](/todo).
* A reasonable **directory & file structure**. One of the things I dislike in many blogs is the fact that pictures are all in one `img` or `assets` folder and therefore referencing them from blogs or articles needs long URLs like `#{site.url}/assets/2018/08/08/nice_pic.jpg`. To me pictures belong to an article, should be in the same directory as the markdown and therefore can be referenced as `nicepig.jpg`.
* **Google tracking**, because we want to know if people read our blog. And as it's standard it's an easy choice.
* **Picture resizing**: When writing I want to simply drop in the pictures as I have them, ideally in the highest resolution available. It should be up to my software to take care of re-sizing (i.e. make my pictures sizes smaller). And ideally on click it should redirect my reader to the full size picture so she can enjoy the quality of it. Without this feature the site wouldn't be mobile usable anyways...

# Further wishes

Stuff I would love to have ;)

* **Technically well structured**: Yes, tech matters. If you don't care tech, use wordpress: It comes with lots of functionality and looks good (given the right template). But my blog should be technically sound and well structured, so an engineer would quickly understand it and be able to modify it without jeopardizing the overall structure and stability. This also means proper documentation...
* **Locations**: I want to be able to pin the location of an article. Simply by adding a `location` tag in my front matter, it should display a little map that links to a larger map showing to which location the article relates.
* **Offline availability**: When sopmeone has read my blog before and re-loads it, it should show even if she is offline - while telling her that the blog will be updated once she is online again.
* [**AMP**](https://www.ampproject.org/) is just lightning fast, so this would be great, especially when being mobile!
* **Nice editing experience** as my mother should be able to edit it. 
* **Tests** that what I wrote (as content) translates properly into proper HTML. So content should never break the blog. This contains for example test like these ones:
  * Automated link checking
  * Checking for completeness (i.e. does an article without title make sense? Therefore, should it be allowed?)