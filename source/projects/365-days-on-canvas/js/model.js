
Canvas365.registerDay('id', function(){
    // classes and globals

    var drawList = [];
    return {
        init : function(ctx){
            // create your objects here
            // add them to the drawList
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
