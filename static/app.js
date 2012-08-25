(function($){

    var DC = {
        models: {},
        collections: {},
        views: {},
        methods: {
        }
    };

    DC.views.AppView = Capsule.View.extend({
        gapiCount: 0,
        initialize: function() {
            this.loadGapis();
        },

        loadGapis: function() {
            console.log('Loading gapis...');
            _.bindAll(this, 'onGapiLoad');
            gapi.client.load('calendar', 'v3', this.onGapiLoad);
            gapi.client.load('drive', 'v2', this.onGapiLoad);
        },

        onGapiLoad: function(response) {

            this.gapiCount++;
            if (response) {console.log("gapi loaded", response);}

            if (this.gapiCount < ALL_SCOPES.length) {
                return;
            } else {
                console.log('Loading gapis completed.');
                this.render();
            }
        },

        render: function() {
            this.el = $('body');
            this.delegateEvents();
            this.handleBindings();
            console.log('App Initialization Complete.');

            //test gapi
            var r = gapi.client.drive.files.list();
            r.execute(function(resp) {
                console.log('Google Drive Test', resp);
            });
        }
    });

    app = window.app = new DC.views.AppView();
})(jQuery);
