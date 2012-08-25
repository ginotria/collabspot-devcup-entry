(function($){
    var DC = {
        models: {},
        collections: {},
        views: {},
        methods: {
        }
    };

    DC.models.Class = Capsule.Model.extend({
        type: 'class',
        initialize: function() {
            this.register();
            this.addChildCollection('attachments', DC.collections.Attachments);
        }
    });
    DC.models.Attachment = Capsule.Model.extend({
        type: 'attachment',
        initialize: function() {
            this.register();
        }
    });

    DC.collections.Attachments = Capsule.Collection.extend({
        type: 'attachments',
        // Reference to this collection's model.
        model: DC.models.Attachment,
        initialize: function() {
            this.register();
        }
    });

    DC.views.AttachmentView = Capsule.View.extend({
        template: 'attachmentTemplate',

        events: {
            'click .remove-attachment': 'removeAttachment'
        },

        initialize: function(spec) {
            this.containerEl = spec.containerEl;
            this.render();
        },

        render: function() {
            console.log('render attachment', this.containerEl);
            this.subViewRender();
        },

        removeAttachment: function() {
        }


    });

    DC.views.AppView = Capsule.View.extend({
        gapiCount: 0,
        events: {
            'click .new-attachment': 'onAddAttachment'
        },
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

            this.collectomatic(this.model.attachments, DC.views.AttachmentView, {containerEl:this.$('.list-attachments')[0]});
        },

        onAddAttachment: function() {
           alert('test');
        }
    });

    classModel = window.classModel = new DC.models.Class();
    app = window.app = new DC.views.AppView({
        model: classModel
    });

})(jQuery);
