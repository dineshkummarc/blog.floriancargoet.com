---
layout: post
title: "A node program that is also a shell script"
date: 2012-05-19 20:36
comments: true
categories: [JavaScript, Shell, Programming]
---

Here is the code with a JavaScript syntax highlighter:

``` javascript

#!/bin/sh
true /* ignored by js

if which node > /dev/null; then
    this_file=$(readlink -f $0)
    exec node $this_file
else
    echo You must install node to run this program
fi

exit 0
ignored by sh
*/

console.log('i am in node');
```

and with a Shell syntax highlighter:

``` bash

#!/bin/sh
true /* ignored by js

if which node > /dev/null; then
    this_file=$(readlink -f $0)
    exec node $this_file
else
    echo You must install node to run this program
fi

exit 0
ignored by sh
*/

console.log('i am in node');
```

How does it work?
-----------------
It's a shell script. Check the first line. `#!/bin/sh` tells the system
to execute this file with `/bin/sh`.

Near the end, there's a `exit 0` statement. It ends the script shell.
`/bin/sh` won't read what's after this line. So it can be JavaScript.

Now, we want this file to be a valid NodeJS file. The first line will be
ignored since it's the [shebang](http://en.wikipedia.org/wiki/Shebang_%28Unix%29).
We have to comment the shell code between `/* */`. A line can't start with
a `/*` since it's not a valid shell command. We need some code that works
in both language.

`true` is perfect for that purpose. In shell, it's just a command that
always succeeds and ignores any parameters. In JS, it's the `true` keyword.

`true /*` opens the JS comment block and is valid in both languages.
Finally, we can close the block with a simple `*/` since we do it after
the `exit 0`.

What's the point?
-----------------

In the example it's used to check if node is installed.
You could even install it if it's not there.
If it's installed, it simply executes `node` with the current file as
first parameter.

But mostly, it was fun to write.
