---
layout: post
title: "Remove Octopress' default blog/ directory"
date: 2012-03-14 01:20
comments: true
categories: 
---

By default, Octopress deploys your posts, categories and archives to a `/blog/` subdirectory. Here is how to remove that :

 - replace all `/blog` occurences by `/` in `_config.yml`
 - move `source/blog/archives` to `source/` (you can delete `blog/`)
 - edit `source/_includes/custom/navigation.html`. Replace `/blog/archives` by `/archives`
 - edit `source/index.html`. Replace `/blog/archives` by `/archives`

That's it.
