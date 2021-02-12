Client.rooms.interface.furniture.place = new function() {
    this.$icon = $('<canvas></canvas>').css({ "position": "fixed", "pointer-events": "none" });

    this.start = async function(furniture) {
        this.entity = new Client.rooms.items.furniture(Client.rooms.interface.entity, "HabboFurnitures/" + furniture.line + "/" + furniture.id, 2);

        this.entity.disable();

        Client.assets.getSpritesheet("HabboLoadingIcon").then(function(icon) {
            const context = Client.rooms.interface.furniture.place.$icon[0].getContext("2d");

            context.canvas.width = icon.width;
            context.canvas.height = icon.height;

            context.drawImage(icon, 0, 0);

            Client.rooms.interface.furniture.place.$icon.css({
                "margin-left": -(Math.floor(icon.width / 2)),
                "margin-top": -(Math.floor(icon.height / 2))
            });

            Client.furnitures.icon(furniture.id).then(function(image) {
                context.canvas.width = image.width;
                context.canvas.height = image.height;

                context.drawImage(image, 0, 0);

                Client.rooms.interface.furniture.place.$icon.css({
                    "margin-left": -(Math.floor(image.width / 2)),
                    "margin-top": -(Math.floor(image.height / 2))
                });
            });
        });

        await this.entity.render();

        this.$icon.appendTo(Client.rooms.interface.$element);

        Client.rooms.interface.entity.addEntity(this.entity);

        Client.rooms.interface.entity.$canvas.bind("mousemove", this.move);
    
        Client.rooms.interface.cursor.events.hover.push(this.hover);
        Client.rooms.interface.cursor.events.unhover.push(this.unhover);
    };

    this.hover = function(position) {
        Client.rooms.interface.furniture.place.entity.setCoordinates(position.row, position.column, position.depth, 0);

        Client.rooms.interface.furniture.place.entity.enable();

        Client.rooms.interface.entity.$canvas.unbind("mousemove", Client.rooms.interface.furniture.place.move);
        
        Client.rooms.interface.furniture.place.$icon.hide();
    };

    this.move = function(event) {
        Client.rooms.interface.furniture.place.$icon.css({
            "left": event.offsetX,
            "top": event.offsetY
        }).show();
    };

    this.unhover = function() {
        Client.rooms.interface.furniture.place.entity.disable();
        
        Client.rooms.interface.entity.$canvas.bind("mousemove", Client.rooms.interface.furniture.place.move);
    };
};
