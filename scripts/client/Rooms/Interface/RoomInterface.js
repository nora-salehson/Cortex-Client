Client.rooms.interface = function($parent) {
    this.$element = $('<div class="room"></div>').prependTo($parent);

    this.setBackground = function(color) {
        this.$element.css("background", color);
    };

    this.addEntity = function(entity) {
        this.entity = entity;

        this.entity.$canvas.prependTo(this.$element);
    };

    this.addMouseEvents = async function() {
        if(this.entity == undefined) {
            Client.utils.error("RoomInterface", "Cannot register mouse events, there's no room entity!");

            return;
        }

        const entity = this.entity;

        let mousePosition = undefined;

        let mouseDragging = false;

        this.entity.$canvas.bind("mousedown", function(event) {
            if(mouseDragging == true)
                return;
            
            mousePosition = [ event.offsetX, event.offsetY ];

            mouseDragging = true;
        }).bind("mousemove", function(event) {
            if(mouseDragging == false) {
                mousePosition = [ event.offsetX, event.offsetY ];

                return;
            }

            entity.offset[0] += event.offsetX - mousePosition[0];
            entity.offset[1] += event.offsetY - mousePosition[1];
            
            mousePosition = [ event.offsetX, event.offsetY ];
        }).bind("mouseup", function(event) {
            if(mouseDragging == false)
                return;
            
            mouseDragging = false;
        }).bind("mouseout", function(event) {
            if(mouseDragging == false)
                return;
            
            mouseDragging = false;
        });

        const cursor = Client.rooms.items.cursor(entity);

        await cursor.render();

        let hit = undefined;

        this.entity.events.render.push(function() {
            entity.removeEntity(cursor);

            hit = entity.getEntity(mousePosition);
            
            if(hit == undefined)
                return;

            if(hit.entity.name == "floormap") {
                cursor.setCoordinates(parseInt(hit.result.row), parseInt(hit.result.column), parseInt(hit.result.depth), -2000);
                
                entity.addEntity(cursor);
            }
        });
    };

    this.addChat = function(chat) {
        if(this.entity == undefined) {
            Client.utils.error("RoomInterface", "Cannot register chat, there's already a chat entity!");

            return;
        }

        this.chat = chat;

        this.chat.$element.appendTo(this.$element);
    };
};
