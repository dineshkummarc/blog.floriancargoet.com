
Canvas365.registerDay('4-5', function(){


    var StickMan = function(ctx, config){
        this.ctx    = ctx;
        this.config = config || {};

        this.x      = config.x;
        this.y      = config.y;
        this.vx     = config.vx;
        this.vy     = config.vy
    };

    StickMan.prototype.draw = function(){
        var ctx    = this.ctx;
        var config = this.config;

        ctx.lineWidth   = config.lineWidth   || 2;
        ctx.strokeStyle = config.strokeStyle || 'black';

        ctx.save();
        ctx.translate(this.x, this.y);
        if(config.scale){
            ctx.scale(config.scale, config.scale);
        }

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
        ctx.restore();
    };

    StickMan.prototype.move = function(x, y){
        this.x += x;
        this.y += y;
    };

    StickMan.prototype.update = function(){
        // move
        this.move(this.vx, this.vy);
        // bounce
        if(this.x < 0 || this.x > 450){
            this.vx = -this.vx;
        }
        if(this.y < 0 || this.y > 400){
            this.vy = -this.vy;
        }
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
    }

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
            var r = 360; // radius, coincidentally 360px
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

    var drawList = [];
    return {
        init : function(ctx){
            drawList.push(new StickMan(ctx, {
                x : 50,
                y : 50,
                vx : 1,
                vy : 0.5
            }));

            drawList.push(new StickMan(ctx, {
                x : 150.5,
                y : 50.5,
                vx : -0.5,
                vy : 2,
                scale : 1.2,
                lineWidth : 3,
                strokeStyle : 'green'
            }));

            drawList.push(new StickMan(ctx, {
                x : 250,
                y : 50,
                vx : 0.7,
                vy : 0.7,
                scale : 0.8,
                strokeStyle : 'orange'
            }));

            drawList.push(new Background(ctx,{
                x : 250,
                y : 250,
                zIndex : -1
            }));

            // sort the drawlist by zindex
            drawList.sort(function(a, b){
                return (a.config.zIndex || 0) - (b.config.zIndex || 0);
            });

        },
        main : function(ctx){
            ctx.clearRect(0, 0, 500, 500);
            drawList.forEach(function(item, i){
                item.update();
                item.draw();
            });
        }
    };

});
