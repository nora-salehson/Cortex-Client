Client.rooms.entity = function($parent) {
    this.offset = [ 0, 0 ];

    this.center = 0;

    this.setOffset = function(left, top) {
        this.offset = [ left, top ];
    };

    this.entities = [];

    this.addEntity = function(entity) {
        this.entities.push(entity);

        return entity;
    };

    this.currentEntity = undefined;

    this.getEntity = function(position) {
        if(position == undefined)
            return undefined;

        const offset = [
            position[0] - this.offset[0] - this.center,
            position[1] - this.offset[1]
        ];

        for(let index in this.sprites) {
            const mouseover = this.sprites[index].mouseover(offset, this.center);
            
            if(mouseover == false)
                continue;

            return { entity: this.sprites[index].parent, sprite: this.sprites[index], result: mouseover };
        }

        return undefined;
    };

    this.removeEntity = function(entity) {
        const index = this.entities.indexOf(entity);

        if(index == -1)
            return;

        this.entities.splice(index, 1);
    };

    this.$canvas = $('<canvas></canvas>').appendTo($parent);

    this.updateCanvas = function() {
        const width = $parent.width();
        const height = $parent.height();

        this.$canvas.attr({
            "width": width,
            "height": height
        });

        /*.css({
            "width": Math.floor(width * window.devicePixelRatio),
            "height": Math.floor(height * window.devicePixelRatio)
        })*/
    };

    this.sprites = [];

    this.frame = 0;
    this.frameRate = 24;
    this.frameRates = [];
    this.frameStamp = performance.now();
    this.framePerformance = [];

    this.render = function() {
        let timestamp = performance.now();

        if((timestamp - this.frameStamp) > 1000 / this.frameRate) {
            this.frame++;

            if(this.frame > this.frameRate)
                this.frame = 0;

            this.frameStamp = timestamp;
        }

        for(let index in this.entities)
            this.entities[index].process(this.frame);

        this.updateCanvas();

        for(let index in this.events.beforeRender)
            this.events.beforeRender[index]();
        
        const context = this.$canvas[0].getContext("2d");

        context.clearRect(0, 0, context.canvas.width, context.canvas.height);

        context.save();

        //context.imageSmoothingEnabled = false;

        //context.scale(window.devicePixelRatio, window.devicePixelRatio);

        this.sprites = [];

        for(let index in this.entities) {
            if(this.entities[index].enabled == false)
                continue;

            this.sprites = this.sprites.concat(this.entities[index].sprites);
        }

        this.sprites.sort(function(a, b) {
            return a.getIndex() - b.getIndex();
        });

        const offset = [ this.center + this.offset[0], this.offset[1] ];

        for(let index in this.sprites)
            this.sprites[index].render(context, offset);

        for(let index in this.events.render)
            this.events.render[index]();

        context.restore();

        if(this.framePerformance.length == this.frameRate)
            this.framePerformance.shift();

        const milliseconds = (Math.round((performance.now() - timestamp) * 100) / 100);

        this.framePerformance.push(milliseconds);

        const median = Client.utils.getArrayMedian(this.framePerformance);
        
        if(median > 6 || milliseconds > (1000 / 75)) {
            console.warn("[RoomEntity]%c Execution for last " + this.framePerformance.length + " frames took ~" + (Math.round(median * 100) / 100) + "ms; last took ~" + milliseconds + "ms!", "color: lightblue");

            this.framePerformance.length = 0;
        }

        timestamp = performance.now();

        for(let index in this.frameRates) {
            if(timestamp - this.frameRates[index] >= 1000) {
                this.frameRates.splice(index, 1);
            }
        }

        this.frameRates.push(timestamp);

        Client.development.$debug.text(this.frameRates.length + " FPS");
    };

    this.events = new function() {
        this.render = [];

        this.beforeRender = [];
    };

    this.setCursor = function(cursor) {
        this.$canvas.css("cursor", cursor);
    };
};
