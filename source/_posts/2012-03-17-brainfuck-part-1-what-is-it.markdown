---
layout: post
title: "Brainfuck part 1: what is it?"
date: 2012-03-17 15:23
comments: true
categories: [Programming, Brainfuck]
---
This article is part of a series on brainfuck, a weird programming language:

 1. [Brainfuck part 1: what is it?](/2012/03/brainfuck-part-1-what-is-it/)
 2. [Brainfuck part 2: an interpreter in JavaScript](/2012/03/brainfuck-part-2-an-interpreter-in-javascript/)
 3. [Brainfuck part 3: a brainfuck → JavaScript transpiler](/2012/04/brainfuck-part-3-a-brainfuck-javascript-transpiler/)

---

[Brainfuck](http://en.wikipedia.org/wiki/Brainfuck) is an esoteric programming language using only eight characters `><+-.,[]`.
It has no pratical use but it's fun and challenges the mind.

Design
------
The language has only eight commands: the eight characters. Any other character is ignored and can be use for commenting.

The programming model is simple: you have a 30,000 cells data array and a pointer to the current cell.
You can modify the value of this cell, print it (ASCII output) or replace it with the value of the keyboard input.

 - `>` move the data pointer forward
 - `<` move the data pointer backward
 - `+` increments (+1) the current cell
 - `-` decrements (-1) the current cell
 - `.` outputs the current cell as an ASCII character
 - `,` reads one character from the input and writes it in the current cell
 - `[` makes the program jump to the instruction after the matching `]` if the current cell's value is 0.
 - `]` makes the program jump to the instruction after the matching `[` if the current cell's value is not 0.
 
Having only these commands is the ''fuck'' part of brainfuck.

<!--more-->

Examples
--------

```
******************
* print 'foobar' *
******************

init variables
==============
+++++ +++++          a = 10
[                    while(a != 0)
    > +++++ +++++        add 10 to b
    > +++++ +++++ +      add 11 to c
    <<-                  decrement a
]                    end of while:
                       b = 100 (close to 'f' 'b' 'a')
                       c = 110 (close to 'o' 'r')

adjust variables and print
==========================
>       
++ .    b = 102; print 'f'
>       
+ .     c = 111; print 'o'
  .              print 'o'
<       
---- .  b = 98;  print 'b'
- .     b = 97;  print 'a'
>       
+++ .   c = 114; print 'r'

```
 
Crazy, huh?

Now an "echo" program. It reads your input and just outputs it.

Serial version (reads all, prints all)

```
> +     mem = (O 1) ; you need a non zero cell to enter the loop
[>,]    read until there is a 0 (= convention for end of input)
<[<]    move data pointer backwards until there is a 0 (condition to exit the loop)
>>[.>]  move forwards and print until 0
```

Parallel version (reads one, prints one)
```
, read first char
[ while the last read value is not 0
    .   print it
    [-] reset the cell to 0
    ,   read next char
]
```

Exercices
---------

If you don't think it's fun, please close your browser.
Otherwise, here are some exercices (the number of * indicates the difficulty):

How do you:

 - Duplicate a cell? *
 - Move a cell? *
 - Add 2 cells? * 
 - Multiply 2 cells? **

Write the brainfuck equivalent of:

 - If(a){code} *
 - While(a && b){a--; b--} **
 - If(x){code1}else{code2} ***
 
[My solutions](https://github.com/floriancargoet/I-learn-Brainfuck/blob/master/patterns.brainfuck).

Conclusion
----------

Brainfuck is a well chosen name.

---

This article is part of a series on brainfuck, a weird programming language:

 1. [Brainfuck part 1: what is it?](/2012/03/brainfuck-part-1-what-is-it/)
 2. [Brainfuck part 2: an interpreter in JavaScript](/2012/03/brainfuck-part-2-an-interpreter-in-javascript/)
 3. [Brainfuck part 3: a brainfuck → JavaScript transpiler](/2012/04/brainfuck-part-3-a-brainfuck-javascript-transpiler/)
