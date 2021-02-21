Client.rooms.editor = function(settings, change) {
    let placeDepth = 0;

    this.tiles = new function() {
        this.$element = $('<div class="room-editor-tiles"></div>');

        const $canvas = $('<canvas></canvas>').appendTo(this.$element);

        let map = settings.map.split('|'), rows = map.length, columns = 0, renderOffset = { left: 0, top: 0 };

        for(let row in map) {
            map[row] = map[row].split('');

            if(map[row].length > columns)
                columns = map[row].length;

            for(let column in map[row]) {
                if(map[row][column] == 'X')
                    continue;

                map[row][column] = (!Client.utils.isLetter(map[row][column]))?(parseInt(map[row][column])):(Client.utils.fromCharCode(map[row][column]));
            }
        }

        const render = function(canvas) {
            const context = $canvas[0].getContext("2d");

            context.canvas.width = $canvas.parent().width();
            context.canvas.height = $canvas.parent().height();
           
            renderOffset = { left: canvas.offset.left, top: canvas.offset.top };

            context.setTransform(1, .5, -1, .5, renderOffset.left + (rows * 16), renderOffset.top);
            
            for(let row in map) {
                for(let column in map[row]) {
                    if(map[row][column] == 'X')
                        continue;

                    context.fillStyle = "hsl(" + (360 - ((360 / 100) * (34 + (map[row][column] * 2)))) + ", 100%, 50%)";

                    context.fillRect(parseInt(column) * 16, parseInt(row) * 16, 15.5, 15.5);
                }
            }
        };
        
        const canvas = Client.canvas.addCanvas($canvas[0], { render, draggable: true });

        $canvas.on("click", function(event) {
            if((performance.now() - canvas.draggableTimestamp) > 250)
                return;

            const innerPosition = {
                left: (event.offsetX - canvas.offset.left) * 0.5 + (event.offsetY - canvas.offset.top) - (rows * 16) / 2,
                top: (event.offsetX - canvas.offset.left) * -0.5 + (event.offsetY - canvas.offset.top) + (rows * 16) / 2
            };

            const coordinate = {
                row: Math.floor(innerPosition.top / 16),
                column: Math.floor(innerPosition.left / 16)
            };

            if(map[coordinate.row] == undefined)
                map[coordinate.row] = [];

            for(let column = coordinate.column - 1; column != -1; column--) {
                if(map[coordinate.row][column] == undefined)
                    map[coordinate.row][column] = 'X';
            }

            map[coordinate.row][coordinate.column] = placeDepth;

            let result = "";

            for(let row in map) {
                if(result.length != 0)
                    result += "|";
                    
                for(let column in map[row]) {
                    if(map[row][column] != 'X' && map[row][column] > 9)
                        map[row][column] = Client.utils.charCode(map[row][column] - 10);
                    
                    result += map[row][column];
                }
            }

            change(result);
        });
    };

    this.depth = new function() {
        this.$element = $('<div class="room-editor-depth"></div>');

        const $canvas = $('<canvas></canvas>').appendTo(this.$element);

        const $cursor = $('<div class="room-editor-depth-cursor"></div>').appendTo(this.$element);

        const setCursor = function(depth) {
            const width = $canvas.width() / 24;

            $cursor.css("left", (width / 2) + (width * depth));

            placeDepth = depth;
        };

        this.render = function() {
            const context = $canvas[0].getContext("2d");
            
            context.canvas.width = $canvas.parent().width();
            context.canvas.height = $canvas.parent().height();

            const steps = 24, width = context.canvas.width / steps;

            for(let index = 0; index < steps; index++) {
                context.fillStyle = "hsl(" + (360 - ((360 / 100) * (34 + (index * 2)))) + ", 100%, 50%)";

                const path = new Path2D();

                path.rect(width * index, 0, width + .5, context.canvas.height);

                paths[index] = path;

                context.fill(path);
            }

            setCursor(placeDepth);
        }

        let paths = {}, down = false;

        this.$element.on("mousedown", function(event) {
            down = true;

            const context = $canvas[0].getContext("2d");

            for(let depth in paths) {
                if(!context.isPointInPath(paths[depth], event.offsetX, event.offsetY))
                    continue;

                setCursor(depth);

                break;
            }
        }).on("mousemove", function(event) {
            if(!down)
                return;

            const context = $canvas[0].getContext("2d");

            for(let depth in paths) {
                if(!context.isPointInPath(paths[depth], event.offsetX, event.offsetY))
                    continue;

                setCursor(depth);

                break;
            }
        }).on("mouseup", function() {
            down = false;
        });
    };
};
