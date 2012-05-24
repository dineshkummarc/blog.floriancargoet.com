---
layout: post
title: "365 days on canvas: days 8 to 14"
date: 2012-05-29 9:00
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
    canvas {
        border : 1px solid #ccc;
    }
</style></div>

Day 8
-----
I promised a better beach last week and here it is: better colors,
better horizon and better waves. There's even some foam!

Waves are `arcTo()` calls with a `translate()` and a y-`scale()`
transformations. Transformation amplitude is based on a sine function.
Foam and water are drawn with the same path, stroked in white then
filled in blue.

As usual, **click the canvas to start/stop the animation:**

<canvas id="day8" width="500" height="500"></canvas>

Day 9
-----
I removed the eye-hurting background and replaced it with a simple sunny
blue sky. SquareMan is alone again.

<canvas id="day9" width="500" height="500"></canvas>

Day 10
------
I also promised a shark last week.

The fin is made of two `arcTo()` and a `closePath()`.
Movement is an ellipse ( 5&nbsp;cos&alpha;&nbsp;x, 3&nbsp;sin&alpha;&nbsp;y),
fin oriention is based on the sign of cos&alpha;.

<canvas id="day10" width="500" height="500"></canvas>

Day 11
------
Some `quadraticCurveTo()` to draw a nice umbrella.

<canvas id="day11" width="500" height="500"></canvas>

Day 12
------
Wet sand. It took me some time but I realised that reusing the path that
I used for the waves, with a 10 pixels translation
and a &pi;/6 phase offset was good enough.

<canvas id="day12" width="500" height="500"></canvas>

Days 13-14
----------
It took me 40 minutes to draw this speech bubble.
"What took you so long?" you might ask.
Maybe the fact that the bubble is automatically sized to fit the text.

*Tip*: you can measure the width of a string with `measureText()`.

<canvas id="day13-14" width="500" height="500"></canvas>

Next
----

I think I kept my promises: the beach is really better and there's a shark.
I'm quite proud of what I've achieved in these 14 * 20 minutes.

What do you think? What do you want next?
