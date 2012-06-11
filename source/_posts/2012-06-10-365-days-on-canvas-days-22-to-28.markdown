---
layout: post
title: "365 Days on Canvas: Days 22 to 28"
date: 2012-06-11 14:34
comments: true
categories: [Programming, "365 days on canvas", JavaScript, Canvas]
---

**365 days on canvas**, is a project where I spent 20 minutes every day
on the `<canvas>` tag. More about it [here](/2012/05/365-days-on-canvas/).

Here is the work of the last 7 days.

<!-- more -->

<script type="text/javascript" src="/projects/365-days-on-canvas/js/loader.js"></script>

<!-- Octopress removes the style if not wrapped -->
<div><style type="text/css">
    div.entry-content canvas {
        border : 1px solid #ccc;
        position : relative;
    }
    div.entry-content button {
        display : block;
    }
</style></div>

Days 22/23
----------
New week, new features! If you wondered what the bounding box detector
introduced last week was for, now I can tell you: it will be used to
interact with the objects on the screen.

Before that, let me show you the "mode selector". There are now 3 different
modes in this canvas: the normal mode, the add mode, where you can add birds
in the sky and the edit mode, where you can change the existing objects.
For now you can't edit anything but it's coming!

Click on the colored squares to switch between modes:

<button id="btn22-23">Play / Pause</button>
<canvas id="day22-23" width="500" height="500"></canvas>

Day 24
------
And now, some edition features! In "edit mode" (the green square), you can
click on the birds to make them black, click on SquareMan to change its color
(randomly between white, red, cyan, blue and black) and you can also click
on the sun to change its radius.

<button id="btn24">Play / Pause</button>
<canvas id="day24" width="500" height="500"></canvas>

Day 25
------
Not much to show today: the current mode is now displayed and the associated
button has a border.

<button id="btn25">Play / Pause</button>
<canvas id="day25" width="500" height="500"></canvas>

Days 26/27
----------
A big addition that took 40 minutes: randomly generated clouds. If you
reload the page, you will see that the clouds are different each time.

I'll probably write a article someday on how I made those clouds.

<button id="btn26-27">Play / Pause</button>
<canvas id="day26-27" width="500" height="500"></canvas>

Day 28
------
I made the clouds more configurable. Now, I can easily control the
width/height ratio, and the shape of the curves.

<button id="btn28">Play / Pause</button>
<canvas id="day28" width="500" height="500"></canvas>

Next
----

What do you want next week?
