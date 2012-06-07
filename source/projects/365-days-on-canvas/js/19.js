
Canvas365.registerDay('19', function(){
    // classes and globals

    var StickMan = function(ctx, config){
        this.ctx    = ctx;
        this.config = config || {};

        this.x      = config.x;
        this.y      = config.y;
        this.vx     = config.vx;
        this.vy     = config.vy;
        this.scale  = config.scale || 1;

        this.targetX = this.x;
        this.targetY = this.y;
    };

    StickMan.prototype.draw = function(){
        var ctx    = this.ctx;
        var config = this.config;

        ctx.lineWidth   = config.lineWidth   || 2;
        ctx.strokeStyle = config.strokeStyle || 'black';

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(this.scale, this.scale);

        // head, hands & feet
        ctx.strokeRect(15,  0, 30, 30);
        ctx.strokeRect(22,  5,  5,  5);
        ctx.strokeRect(33,  5,  5,  5);
        ctx.strokeRect(23, 20, 14,  5);

        ctx.strokeRect( 0, 70, 10, 10);
        ctx.strokeRect(50, 70, 10, 10);

        ctx.strokeRect(10, 120, 10, 10);
        ctx.strokeRect(40, 120, 10, 10);

        ctx.beginPath();
        // arms
        ctx.moveTo( 5, 70);
        ctx.lineTo( 5, 40);
        ctx.lineTo(55, 40);
        ctx.lineTo(55, 70);
        // legs
        ctx.moveTo(15, 120);
        ctx.lineTo(15,  90);
        ctx.lineTo(45,  90);
        ctx.lineTo(45, 120);
        // body
        ctx.moveTo(30, 30);
        ctx.lineTo(30, 90);

        ctx.stroke();

        if(config.msg){
            this.say(config.msg);
        }
        ctx.restore();
    };

    StickMan.prototype.move = function(x, y){
        this.x += x;
        this.y += y;
    };

    StickMan.prototype.goTo = function(x, y){
        var bbox = this.getBBox();
        this.targetX = Math.min(Math.max(0, x), 500 - bbox.w);
        this.targetY = Math.min(Math.max(0, y), 500 - bbox.h);
    };

    StickMan.prototype.say = function(msg){
        var bubble = new SpeechBubble(this.ctx, {
            x : 50,
            y : 15,
            text : msg
        });
        bubble.draw();
    };

    StickMan.prototype.update = function(){
        // move
        var dx = 0, dy = 0;
        if(Math.abs(this.targetX - this.x) > this.vx){
            dx = this.targetX > this.x ? this.vx : -this.vx;
        }
        if(Math.abs(this.targetY - this.y) > this.vy){
            dy = this.targetY > this.y ? this.vy : -this.vy;
        }
        this.move(dx, dy);
    };

    StickMan.prototype.getBBox = function(){
        return {
            x : this.x,
            y : this.y,
            w : 60  * this.scale,
            h : 130 * this.scale
        };
    };


    var Background = function(ctx, config){
        this.ctx    = ctx;
        this.config = config || {};

        this.x      = config.x;
        this.y      = config.y;
        this.angle  = config.angle || 0;

        var arcs = [];
        for(var angle = 0; angle < 2 * Math.PI;){
            var arc = 0.15 + Math.random() * 0.3;
            arcs.push(arc);
            angle += arc;
        }
        this.arcs = arcs;
    };

    Background.prototype.draw = function(){
        var ctx    = this.ctx;
        var config = this.config;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle, this.angle);

        var styles = ['red', 'yellow', 'pink'];
        styleIndex = 0;

        var angle = 0, arc;
        for(var i = 0, l = this.arcs.length; i < l; i++){
            arc = this.arcs[i];

            ctx.beginPath();
            ctx.fillStyle = styles[styleIndex];
            styleIndex = (styleIndex + 1) % styles.length;

            ctx.moveTo(0, 0);
            var r = 500;
            ctx.lineTo(r * Math.cos(angle), r * Math.sin(angle));
            angle += arc;
            ctx.lineTo(r * Math.cos(angle + 0.01), r * Math.sin(angle + 0.01)); // add tiny angle to avoid artifacts
            ctx.closePath();

            ctx.fill();
        }

        ctx.restore();
    };
    Background.prototype.update = function(){
        this.rotate(0.005);
    };
    Background.prototype.rotate = function(angle){
        this.angle += angle;
    };

    var Beach = function(ctx, config){
        this.ctx    = ctx;
        this.config = config || {};

        this.yWater = config.yWater;
        this.ySand  = config.ySand;
        this.t      = 0;
    };

    Beach.prototype.draw = function(){
        var ctx    = this.ctx;
        var config = this.config;

        ctx.save();

        var waterHeight = (this.ySand - this.yWater);

        // sand
        ctx.fillStyle = '#F0C479';
        ctx.fillRect(0, this.yWater, 500, 500 - this.yWater);

        // wet sand
        ctx.beginPath();
        ctx.fillStyle = '#e0b576';
        ctx.translate(0, this.ySand + this.amplitude2 * 100 + 10);
        ctx.scale(1, this.amplitude2);
        ctx.arc(0,   0, 50, Math.PI, 0, false);
        ctx.arc(100, 0, 50, Math.PI, 0, true);
        ctx.arc(200, 0, 50, Math.PI, 0, false);
        ctx.arc(300, 0, 50, Math.PI, 0, true);
        ctx.arc(400, 0, 50, Math.PI, 0, false);
        ctx.arc(500, 0, 50, Math.PI, 0, true);
        ctx.scale(1, 1/this.amplitude2);
        ctx.translate(0, -this.amplitude2 * 100 - 10);
        ctx.lineTo(500, -waterHeight);
        ctx.lineTo(  0, -waterHeight);
        ctx.closePath();

        ctx.fill();

        ctx.restore();
        ctx.save();

        // water
        ctx.fillStyle = '#6AB8DF';

        ctx.beginPath();

        // water/sand line
        ctx.translate(0, this.ySand + this.amplitude * 100);
        ctx.scale(1, this.amplitude);
        ctx.arc(0,   0, 50, Math.PI, 0, false);
        ctx.arc(100, 0, 50, Math.PI, 0, true);
        ctx.arc(200, 0, 50, Math.PI, 0, false);
        ctx.arc(300, 0, 50, Math.PI, 0, true);
        ctx.arc(400, 0, 50, Math.PI, 0, false);
        ctx.arc(500, 0, 50, Math.PI, 0, true);
        ctx.scale(1, 1/this.amplitude);
        ctx.translate(0, -this.amplitude * 100);

        // foam
        ctx.lineWidth = 10;
        ctx.strokeStyle = 'white';
        ctx.stroke();

        ctx.lineTo(500, -waterHeight);
        ctx.lineTo(  0, -waterHeight);
        ctx.closePath();
        ctx.fill();


        ctx.restore();
    };
    Beach.prototype.update = function(){
        this.t += 0.01;
        this.amplitude  = 0.25*(1 + Math.sin(this.t));
        this.amplitude2 = 0.25*(1 + Math.sin(this.t - Math.PI/6));
    };

    var Sun = function(ctx, config){
        this.ctx    = ctx;
        this.config = config || {};

        this.x      = config.x;
        this.y      = config.y;
        this.radius = config.radius;
    };

    Sun.prototype.draw = function(){
        var ctx    = this.ctx;
        var config = this.config;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = '#FFFF00';

        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, 2 * Math.PI, true);
        ctx.fill();

        ctx.restore();
    };

    Sun.prototype.update = function(){};


    var Shark = function(ctx, config){
        this.ctx    = ctx;
        this.config = config || {};

        this.cx = config.x;
        this.cy = config.y;
        this.t  = 0;
    };

    Shark.prototype.draw = function(){
        var ctx    = this.ctx;
        var config = this.config;

        ctx.save();
        ctx.translate(this.x, this.y);
        if(this.reverse){
            ctx.scale(-1, 1);
        }
        ctx.fillStyle   = '#ccc';
        ctx.strokeStyle = '#888';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(15, 0, 15, Math.PI, -Math.PI/2, false);
        ctx.arc(45, 0, 30, -5*Math.PI/6, Math.PI, true);

        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.restore();
    };

    Shark.prototype.update = function(){
        this.t += 0.01;
        var dx = 50 * Math.cos(this.t);
        var dy = 30 * Math.sin(this.t);
        this.x = this.cx + dx;
        this.y = this.cy + dy;
        this.reverse = (dy < 0);
    };

    var Umbrella = function(ctx, config){
        this.ctx    = ctx;
        this.config = config || {};

        this.x     = config.x;
        this.y     = config.y;
        this.angle = config.angle;
    };

    Umbrella.prototype.draw = function(){
        var ctx = this.ctx;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        ctx.beginPath();
        ctx.moveTo(0, -35);
        ctx.lineTo(0, 60);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(-60, 0);
        ctx.quadraticCurveTo(  0, -60,  60, 0);
        ctx.quadraticCurveTo( 45, -10,  30, 0);
        ctx.quadraticCurveTo(  0, -10, -30, 0);
        ctx.quadraticCurveTo(-45, -10, -60, 0);

        ctx.fillStyle = 'yellow';
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();

        ctx.moveTo(30, 0);
        ctx.quadraticCurveTo(  0, -10, -30,   0);
        ctx.quadraticCurveTo(-20, -20,   0, -30);
        ctx.quadraticCurveTo( 20, -20,  30,   0);

        ctx.fillStyle  = 'red';
        ctx.fill();
        ctx.stroke();

        ctx.restore();
    };

    Umbrella.prototype.update = function(){
    };

    var SpeechBubble = function(ctx, config){
        this.ctx = ctx;
        this.config = config;
        this.padding = (config.padding != null) ? config.padding : 20;
        if(typeof config.text === 'string'){
            config.text = [config.text];
        }

    };

    SpeechBubble.prototype.computeSize = function(lineHeight){
        var width, height;
        var text = this.config.text;
        var ctx  = this.ctx;

        var widths = text.map(function(t){
            return ctx.measureText(t).width;
        });

        width  = Math.max.apply(Math, widths);
        height = lineHeight * text.length;

        return {
            width      : width  + 2 * this.padding,
            height     : height + 2 * this.padding,
            lineWidths : widths
        };
    };

    SpeechBubble.prototype.draw = function(){
        var ctx = this.ctx;
        var config = this.config;
        ctx.save();

        ctx.fillStyle   = 'white';
        ctx.strokeStyle = 'black';
        ctx.font        = '20px sans-serif';
        ctx.lineWidth   = 3;

        var size = this.computeSize(20);
        var w    = size.width;
        var h1   = size.height;
        var h2   = 30;
        var cornerW = w/5;
        var cornerH = Math.min(h1/2, cornerW);

        ctx.translate(config.x, config.y - h1 - h2);

        ctx.beginPath();
        ctx.moveTo(4*cornerW, 0);
        // top, top left
        ctx.lineTo(cornerW, 0);
        ctx.quadraticCurveTo(0, 0, 0, cornerH);

        // left, bottom left
        ctx.lineTo(0, h1 - cornerH);
        ctx.quadraticCurveTo(0, h1, cornerW, h1);

        // arrow
        ctx.quadraticCurveTo(cornerW, h1+h2, 0, h1+h2);
        ctx.quadraticCurveTo(cornerW, h1+h2, 2*cornerW, h1);

        // bottom, bottom right
        ctx.lineTo(4*cornerW, h1);
        ctx.quadraticCurveTo(w, h1, w, h1 - cornerH);

        //right, top right
        ctx.lineTo(w, cornerH);
        ctx.quadraticCurveTo(w, 0, 4*cornerW, 0);

        ctx.stroke();
        ctx.fill();

        ctx.fillStyle    = 'black';
        ctx.textBaseline = 'top';
        var p = this.padding;
        config.text.forEach(function(line, i){
            ctx.fillText(line, (w - size.lineWidths[i]) / 2, p + i * 20);
        });

        ctx.restore();
    };

    var Bird = function(ctx, config){
        this.ctx = ctx;
        this.config = config;
        this.x = config.x;
        this.y = config.y;
        this.t = 0;
        config.scale = config.scale || 1;
    };

    Bird.prototype.draw = function(){
        var ctx = this.ctx;
        var config = this.config;
        ctx.save();
        ctx.fillStyle = 'black';

        ctx.translate(this.x, this.y);
        ctx.scale(config.scale, config.scale);

        ctx.beginPath();
        ctx.moveTo(0, 0);

        var m = this.m;
        //                    ctrl pt1,        ctrl pt2,           target pt
        ctx.bezierCurveTo(  5,      -5,     15, -10 + m,     20, -10 + 1.5*m);
        ctx.bezierCurveTo( 15,  -8 + m,      5,       0,               0,  8);
        ctx.bezierCurveTo( -5,       0,    -15,  -8 + m,    -20, -10 + 1.5*m);
        ctx.bezierCurveTo(-15, -10 + m,     -5,      -5,              0,   0);

        ctx.fill();
        ctx.restore();
    };

    Bird.prototype.update = function(){
        this.t += 0.1;
        this.m = 7 * (1 + Math.sin(this.t));
    };

    var drawList = [];
    return {
        init : function(ctx){
            // create your objects here
            // add them to the drawList
            var stickman = new StickMan(ctx, {
                x : 100,
                y : 380,
                vx : 3,
                vy : 0,
                zIndex : 10,
                msg : ["Hello!", "Click anywhere on the", "beach and I'll go!"],
                scale : 0.8
            });
            drawList.push(stickman);

            var beach = new Beach(ctx, {
                yWater : 250,
                ySand  : 350,
                zIndex : -1
            });
            drawList.push(beach);

            drawList.push(new Sun(ctx, {
                x : 400,
                y : 100,
                radius : 20,
                zIndex : -1
            }));

            drawList.push(new Shark(ctx, {
                x : 350,
                y : 300
            }));

            drawList.push(new Umbrella(ctx, {
                x : 380,
                y : 420,
                angle : -Math.PI/8
            }));

            drawList.push(new Bird(ctx, {
                x : 350,
                y : 80
            }));

            drawList.push(new Bird(ctx, {
                x : 370,
                y : 110,
                scale : 0.6
            }));

            drawList.push(new Bird(ctx, {
                x : 320,
                y : 100,
                scale : 0.7
            }));

            // sort the drawlist by zindex
            drawList.sort(function(a, b){
                return (a.config.zIndex || 0) - (b.config.zIndex || 0);
            });

            ctx.canvas.addEventListener('click', function(ev){
                var x, y;
                if ( ev.offsetX == null ) { // Firefox
                   x = ev.layerX;
                   y = ev.layerY;
                } else {                    // Other browsers
                   x = ev.offsetX;
                   y = ev.offsetY;
                }

                // add bird
                if(y < beach.config.yWater){
                    drawList.push(new Bird(ctx, {
                        x : x,
                        y : y,
                        scale : 0.2 + Math.random()
                    }));
                }
                // movement
                else {
                    stickman.goTo(x, stickman.y); // animated
                }
            }, false);
        },
        main : function(ctx){
            ctx.fillStyle = '#0582C2'; // sky
            ctx.fillRect(0, 0, 500, 500);
            drawList.forEach(function(item, i){
                item.update();
                item.draw();
            });
        }
    };

});
