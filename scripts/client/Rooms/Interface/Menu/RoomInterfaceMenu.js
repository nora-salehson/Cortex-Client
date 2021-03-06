Client.rooms.interface.menu = new function() {
    this.$element = $(
        '<div class="room-interface-menu active">' +
            '<div class="room-interface-menu-toggle"></div>' +

            '<div class="room-interface-menu-content"></div>' +
        '</div>'
    ).appendTo(Client.rooms.interface.$element);

    this.$toggle = this.$element.find(".room-interface-menu-toggle");

    this.$toggle.on("click", function() {
        $(this).parent().toggleClass("active");
    });

    this.$content = this.$element.find(".room-interface-menu-content");

    this.link = function(identifier, title, click) {
        const $element = $('<div class="room-interface-menu-link room-interface-menu-' + identifier + '">' + title + '</div>').appendTo(this.$content);

        $element.on("click", function() {
            click();
        });
    };
    
    this.link("settings", "Settings", function() {
        Client.rooms.settings.toggle();
    });
};
