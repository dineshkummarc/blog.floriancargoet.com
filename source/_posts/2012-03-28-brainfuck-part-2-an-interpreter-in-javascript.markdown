---
layout: post
title: "Brainfuck part 2: an interpreter in JavaScript"
date: 2012-03-28 22:19
comments: true
categories: [Programming, Brainfuck]
---
This article is part of a series on brainfuck, a weird programming language:

 1. [Brainfuck part 1: what is it?](/2012/03/brainfuck-part-1-what-is-it/)
 2. [Brainfuck part 2: an interpreter in JavaScript](/2012/03/brainfuck-part-2-an-interpreter-in-javascript/)
 3. [Brainfuck part 3: a brainfuck → JavaScript transpiler](/2012/04/brainfuck-part-3-a-brainfuck-javascript-transpiler/)

---

Last week, I briefly explained what was brainfuck and gave some examples.
It's time to execute those examples and we're gonna write the interpreter
ourselves!

Basics
------

The interpreter will be a simple function, taking the brainfuck code
as first parameter and the input as second parameter.

``` javascript
var bf = function(code, input){
    // ...
};
```

We need some place to store the cells: an array is perfect for that.
We also needs pointers. One for the memory, one for the code and one
for the input. With these, we always know what's the current cell,
what's the current instruction and what's the current input character.
I also added the `out` variable. This is the output string, it's what
the interpreter will return at the end.

``` javascript
var bf = function(code, input){
    var code_ptr = 0,
        mem_ptr = 0,
        input_ptr = 0,
        mem = [],
        out = '';

    // ...

    return out;
};
```

Then, we read the code character by character and interpret the instructions.

``` javascript
while(code_ptr !== code.length){
    var op = code.charAt(code_ptr);
    switch(op){
        case '>':
            break;
        case '<':
            break;
        case '+':
            break;
        case '-':
            break;
        case '.':
            break;
        case ',':
            break;
        case '[':
            break;
        case ']':
            break;
    }

    //next instruction
    code_ptr++;
}

```

Let's interpret
---------------

 - `>` move the data pointer forward
 - `<` move the data pointer backward
 - `+` increments (+1) the current cell
 - `-` decrements (-1) the current cell

Cases `>` and `<` are obvious (`mem_ptr++/--;`). `+` and `-` are simple
too. Since the memory isn't initialized, we can't just do `mem[mem_ptr]++/--;`.
Instead, we ensure the cell is set to zero: `mem[mem_ptr] = (mem[mem_ptr] || 0) +/- 1;`

``` javascript
case '>':
    mem_ptr++;
    break;
case '<':
    mem_ptr--;
    break;
case '+':
    mem[mem_ptr] = (mem[mem_ptr] || 0) + 1;
    break;
case '-':
    mem[mem_ptr] = (mem[mem_ptr] || 0) - 1;
    break;
```

 - `.` outputs the current cell as an ASCII character
 - `,` reads one character from the input and writes it in the current cell

`.` and `,` are not much complex. `.` converts the cell value to the
corresponding character (ascii) and outputs it. The cell may be empty,
we use 0 as the default value.
Reading from the input is as easy. The only thing not to forget is to
increment the input pointer.

``` javascript
case '.':
    out += String.fromCharCode(mem[mem_ptr] || 0);
    break;
case ',':
    mem[mem_ptr] = input.charCodeAt(input_ptr) || 0;
    input_ptr++;
    break;
```

 - `[` makes the program jump to the instruction after the matching `]` if the current cell's value is 0.
 - `]` makes the program jump to the instruction after the matching `[` if the current cell's value is not 0.

`[` and `]` are a bit trickier since we need to find the matching bracket.
Let's pretend we have a `matching()` function that return the code position
of the matching bracket.



``` javascript
case '[':
    if((mem[mem_ptr] || 0) === 0){
        code_ptr = matching(']');
    }
    break;
case ']':
    if((mem[mem_ptr] || 0) !== 0){
        code_ptr = matching('[');
    }
    break;
```

Now, we need to stop pretending and write that `matching()` function.

Read the comments:

``` javascript
var matching = function(bracket){           // bracket is the character to find
    var direction =
            (bracket === ']' ? +1 : -1),    // do we need to go forward or backward?
        count = 0,                          // keep track of nested brackets
        ptr = code_ptr,                     // current position in the code
        other_bracket =
            (bracket === ']' ? '[' : ']'),  // what's the other bracket?
        current_char;                       // the current character

    while(true){
        ptr += direction;                   // move in the code
        current_char = code.charAt(ptr);    // read the current character
        if(current_char === other_bracket){ // if it's the other bracket, it's a nested one
            count++;
        }
        if(current_char === bracket){       // if it's the correct bracket, remove a nesting level
            count--;
        }
        if(count === -1){                   // if there's no more nesting, we found it!
            break;
        }
    }
    return ptr;
};
```

Before putting everything together, let's add a little thing
(brainfuck's memory is supposed to be 30000 cells wide).

``` javascript
if(mem_ptr < 0 || mem_ptr >= 30000){
    throw new Error('These are not the memory cells you are looking for.');
}
```


Complete interpreter
--------------------

``` javascript
var bf = function(code, input){
    var code_ptr  = 0,
        mem_ptr   = 0,
        input_ptr = 0,
        mem = [],
        out = '';

    var matching = function(bracket){
        var direction = (bracket === ']' ? +1 : -1),
            count = 0,
            ptr = code_ptr,
            other_bracket = (bracket === ']' ? '[' : ']'),
            current_char;

        while(true){
            ptr += direction;
            current_char = code.charAt(ptr);
            if(current_char === other_bracket){
                count++;
            }
            if(current_char === bracket){
                count--;
            }
            if(count === -1){
                break;
            }
        }
        return ptr;
    };

    while(code_ptr !== code.length){
        var op = code.charAt(code_ptr);
        switch(op){
            case '>':
                mem_ptr++;
                break;
            case '<':
                mem_ptr--;
                break;
            case '+':
                mem[mem_ptr] = (mem[mem_ptr] || 0) + 1;
                break;
            case '-':
                mem[mem_ptr] = (mem[mem_ptr] || 0) - 1;
                break;
            case '.':
                out += String.fromCharCode(mem[mem_ptr] || 0);
                break;
            case ',':
                mem[mem_ptr] = input.charCodeAt(input_ptr) || 0;
                input_ptr++;
                break;
            case '[':
                if((mem[mem_ptr] || 0) === 0){
                    code_ptr = matching(']');
                }
                break;
            case ']':
                if((mem[mem_ptr] || 0) !== 0){
                    code_ptr = matching('[');
                }
                break;
        }

        if(mem_ptr < 0 || mem_ptr >= 30000){
            throw new Error('These are not the memory cells you are looking for.');
        }
        //next instruction
        code_ptr++;
    }
    return out;
};
```

Examples
--------

``` javascript

>>> bf('++++++++++[>++++++++++>+++++++++++<<-]>++.>+..<----.-.>+++.')
foobar

>>> bf('>,[>,]<[.<]', 'mirror my words')
sdrow ym rorrim

>>> bf('+++++++++++[->+++>++++++>+<<<]>->>->>>++>+>+>++>+>+>++<<<<<<[-[<+<+>>-]<<[>>+<<-]+>[[-]<[<]>>....>.[>]<->]<[[<]>>.<...>.>.[>]<-]+>>[-]>]')
BBBB
B   B
B   B
BBBB
B   B
B   B
BBBB
```

The `bf()` function is included in this page so you can open your
javascript console and test it yourself!

Next time
---------

In the next (and last) post of this series, I will take a different
approach. Instead of interpreting the code, I will convert it to
JavaScript code and `eval()` it.

---

This article is part of a series on brainfuck, a weird programming language:

 1. [Brainfuck part 1: what is it?](/2012/03/brainfuck-part-1-what-is-it/)
 2. [Brainfuck part 2: an interpreter in JavaScript](/2012/03/brainfuck-part-2-an-interpreter-in-javascript/)
 3. [Brainfuck part 3: a brainfuck → JavaScript transpiler](/2012/04/brainfuck-part-3-a-brainfuck-javascript-transpiler/)

<script>
var bf = function(code, input){
    var code_ptr  = 0,
        mem_ptr   = 0,
        input_ptr = 0,
        mem = [],
        out = '';

    var matching = function(bracket){
        var direction = (bracket === ']' ? +1 : -1),
            count = 0,
            ptr = code_ptr,
            other_bracket = (bracket === ']' ? '[' : ']'),
            current_char;

        while(true){
            ptr += direction;
            current_char = code.charAt(ptr);
            if(current_char === other_bracket){
                count++;
            }
            if(current_char === bracket){
                count--;
            }
            if(count === -1){
                break;
            }
        }
        return ptr;
    };

    while(code_ptr !== code.length){
        var op = code.charAt(code_ptr);
        switch(op){
            case '>':
                mem_ptr++;
                break;
            case '<':
                mem_ptr--;
                break;
            case '+':
                mem[mem_ptr] = (mem[mem_ptr] || 0) + 1;
                break;
            case '-':
                mem[mem_ptr] = (mem[mem_ptr] || 0) - 1;
                break;
            case '.':
                out += String.fromCharCode(mem[mem_ptr] || 0);
                break;
            case ',':
                mem[mem_ptr] = input.charCodeAt(input_ptr) || 0;
                input_ptr++;
                break;
            case '[':
                if((mem[mem_ptr] || 0) === 0){
                    code_ptr = matching(']');
                }
                break;
            case ']':
                if((mem[mem_ptr] || 0) !== 0){
                    code_ptr = matching('[');
                }
                break;
        }

        if(mem_ptr < 0 || mem_ptr >= 30000){
            throw new Error('These are not the memory cells you are looking for.');
        }
        //next instruction
        code_ptr++;
    }
    return out;
};

</script>
