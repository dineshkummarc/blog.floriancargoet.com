---
layout: post
title: "Brainfuck part 3: a brainfuck → JavaScript transpiler"
date: 2012-04-26 19:18
comments: true
categories: 
---

This article is part of a series on brainfuck, a weird programming language:

 1. [Brainfuck part 1: what is it?](/2012/03/brainfuck-part-1-what-is-it/)
 2. [Brainfuck part 2: an interpreter in JavaScript](/2012/03/brainfuck-part-2-an-interpreter-in-javascript/)
 3. [Brainfuck part 3: a brainfuck → JavaScript transpiler](/2012/04/brainfuck-part-3-a-brainfuck-javascript-transpiler/)

---

Goal
----

In the last article of this series on brainfuck, I will write a 
brainfuck → JavaScript [transpiler](http://en.wikipedia.org/wiki/Source-to-source_compiler).    
Instead of interpreting each brainfuck instruction, it will be converted
into a JS function once and for all.

Basics
------

The compiler will be a simple function, taking the brainfuck code
as first parameter and returning the corresponding JS function.

``` javascript
var bf = function(code){
    var brainfuck_function;
    // ... 
    return brainfuck_function;
};
```

At some point, we will have a javascript source code. It will be turned
into a function with `eval`.

``` javascript
var bf = function(code){
    var js_code = 'function(input){';
    var brainfuck_function;
    // ... 
    js_code += '};'; // close the js code
    
    eval( 'brainfuck_function = ' + js_code);
    return brainfuck_function;
};
```

Exactly like with the interpreter, we need some place to store the cells: an array.
We also needs pointers. One for the memory, and one
for the input.  We don't need a code pointer anymore.
I also added the `out` variable. This is the output string, it's what
the brainfuck_function will return at the end.

``` javascript
var bf = function(code){
    var js_code = [ // array of code fragments, concatenated later
        'function(input){',
            'var mem_ptr = 0,',
                'input_ptr = 0,',
                'mem = [],',
                'out = "";'
    ];
    
    // ...
    
    js_code.push(
            'return out;',
        '};'
    );
    
    return eval( 'brainfuck_function = ' + js_code.join(''));
};

```

Then, we read the code character by character and translate the instructions in JavaScript.

``` javascript

for(var i = 0, l = code.length; i < l; i++){
    var op = code.charAt(i);
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
}

```


Let's transpile!
----------------

 - `>` move the data pointer forward
 - `<` move the data pointer backward
 - `+` increments (+1) the current cell
 - `-` decrements (-1) the current cell

Cases `>` and `<` are obvious (`mem_ptr++/--;`). `+` and `-` are simple
too. Since the memory isn't initialized, we can't just do `mem[mem_ptr]++/--;`.
Instead, we ensure the cell is set to zero: `mem[mem_ptr] = (mem[mem_ptr] || 0) +/- 1;`

``` javascript
case '>':
    js_code.push('mem_ptr++;');
    break;
case '<':
    js_code.push('mem_ptr--;');
    break;
case '+':
    js_code.push('mem[mem_ptr] = (mem[mem_ptr] || 0) + 1;');
    break;
case '-':
    js_code.push('mem[mem_ptr] = (mem[mem_ptr] || 0) - 1;');
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
    js_code.push('out += String.fromCharCode(mem[mem_ptr] || 0);');
    break;
case ',':
    js_code.push('mem[mem_ptr] = input.charCodeAt(input_ptr) || 0;');
    js_code.push('input_ptr++;');
    break;
```

 - `[` makes the program jump to the instruction after the matching `]` if the current cell's value is 0.
 - `]` makes the program jump to the instruction after the matching `[` if the current cell's value is not 0.

`[` and `]` are a lot simpler to write in the transpiler case since we 
can use a while loop!


``` javascript
case '[':
    js_code.push('while( mem[mem_ptr] ){');
    break;
case ']':
    js_code.push('}');
    break;
```
A lot simpler indeed!


Before putting everything together, let's add a little thing
(brainfuck's memory is supposed to be 30000 cells wide).

``` javascript
js_code.push(
    'if(mem_ptr < 0 || mem_ptr >= 30000){',
        'throw new Error("These are not the memory cells you are looking for.");',
    '}'
);
```

Complete transpiler
-------------------

``` javascript
var bf = function(code){
    var js_code = [ // array of code fragments, concatenated later
        'function(input){',
            'var mem_ptr = 0,',
                'input_ptr = 0,',
                'mem = [],',
                'out = "";'
    ];
    
    for(var i = 0, l = code.length; i < l; i++){
        var op = code.charAt(i);
        switch(op){
            case '>':
                js_code.push('mem_ptr++;');
                break;
            case '<':
                js_code.push('mem_ptr--;');
                break;
            case '+':
                js_code.push('mem[mem_ptr] = (mem[mem_ptr] || 0) + 1;');
                break;
            case '-':
                js_code.push('mem[mem_ptr] = (mem[mem_ptr] || 0) - 1;');
                break;
            case '.':
                js_code.push('out += String.fromCharCode(mem[mem_ptr] || 0);');
                break;
            case ',':
                js_code.push('mem[mem_ptr] = input.charCodeAt(input_ptr) || 0;');
                js_code.push('input_ptr++;');
                break;
            case '[':
                js_code.push('while( mem[mem_ptr] ){');
                break;
            case ']':
                js_code.push('}');
                break;
        }
    }
    js_code.push(
            'if(mem_ptr < 0 || mem_ptr >= 30000){',
                'throw new Error("These are not the memory cells you are looking for.");',
            '}',
            'return out;',
        '};'
    );
    
    return eval( 'brainfuck_function = ' + js_code.join(''));
};

```


Examples
--------

``` javascript

>>> var printFooBar = bf('++++++++++[>++++++++++>+++++++++++<<-]>++.>+..<----.-.>+++.')
>>> printFooBar()
foobar

>>> var reverse = bf('>,[>,]<[.<]')
>>> reverse('mirror my words')
sdrow ym rorrim

>>> var printBigB = bf('+++++++++++[->+++>++++++>+<<<]>->>->>>++>+>+>++>+>+>++<<<<<<[-[<+<+>>-]<<[>>+<<-]+>[[-]<[<]>>....>.[>]<->]<[[<]>>.<...>.>.[>]<-]+>>[-]>]')
>>> printBigB()
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

Conclusion
----------

I hope you liked this little exercise, now you can forget all about it.


---

This article is part of a series on brainfuck, a weird programming language:

 1. [Brainfuck part 1: what is it?](/2012/03/brainfuck-part-1-what-is-it/)
 2. [Brainfuck part 2: an interpreter in JavaScript](/2012/03/brainfuck-part-2-an-interpreter-in-javascript/)
 3. [Brainfuck part 3: a brainfuck → JavaScript transpiler](/2012/04/brainfuck-part-3-a-brainfuck-javascript-transpiler/)

<script>
var bf = function(code){
    var js_code = [ // array of code fragments, concatenated later
        'function(input){',
            'var mem_ptr = 0,',
                'input_ptr = 0,',
                'mem = [],',
                'out = "";'
    ];
    
    for(var i = 0, l = code.length; i < l; i++){
        var op = code.charAt(i);
        switch(op){
            case '>':
                js_code.push('mem_ptr++;');
                break;
            case '<':
                js_code.push('mem_ptr--;');
                break;
            case '+':
                js_code.push('mem[mem_ptr] = (mem[mem_ptr] || 0) + 1;');
                break;
            case '-':
                js_code.push('mem[mem_ptr] = (mem[mem_ptr] || 0) - 1;');
                break;
            case '.':
                js_code.push('out += String.fromCharCode(mem[mem_ptr] || 0);');
                break;
            case ',':
                js_code.push('mem[mem_ptr] = input.charCodeAt(input_ptr) || 0;');
                js_code.push('input_ptr++;');
                break;
            case '[':
                js_code.push('while( mem[mem_ptr] ){');
                break;
            case ']':
                js_code.push('}');
                break;
        }
    }
    js_code.push(
            'if(mem_ptr < 0 || mem_ptr >= 30000){',
                'throw new Error("These are not the memory cells you are looking for.");',
            '}',
            'return out;',
        '};'
    );
    
    return eval( 'brainfuck_function = ' + js_code.join(''));
};
</script>
