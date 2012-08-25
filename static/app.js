(function($){
    var DC = {
        models: {},
        collections: {},
        views: {},
        methods: {
        }
    };
    var pathname = (DC.pathname === undefined) ? window.location.pathname : DC.pathname;
    DC.pathname = pathname;

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

            this.initFileUpload();
        },

        initFileUpload: function() {
            this.$().fileupload({
                url: DC.pathname + 'upload'
            }).bind('fileuploadsubmit', function(e, data) {
                data.formData = {event: 1};
            }).bind('fileuploadsend', function(e, data) {
                humane.info('Start uploading...');
            })
            .bind('fileuploaddone', function(e, data) {
                humane.info('Upload finished');
            });
        },

        onAddAttachment: function() {
            var that = this;
            console.log('going to add an attachment');

            var picker = new google.picker.PickerBuilder().
                            addViewGroup(
                                new google.picker.ViewGroup(google.picker.ViewId.DOCS).
                                    addView(google.picker.ViewId.FOLDERS).
                                    addView(google.picker.ViewId.DOCUMENTS).
                                    addView(google.picker.ViewId.PRESENTATIONS).
                                    addView(google.picker.ViewId.PDFS).
                                    addView(google.picker.ViewId.SPREADSHEETS)).
                            setCallback(function(data) {
                                if (data.action === 'picked') {
                                    for (var i = 0; i < data.docs.length; i++) {
                                        var doc = data.docs[i],
                                            thumbnail = null;
                                        if (doc.thumbnails && doc.thumbnails.length > 0) {
                                            thumbnail = doc.thumbnails[doc.thumbnails.length - 1].url;
                                        }
                                        // socket.emit('addAttachment', {
                                        //      id: that.model.get('id'),
                                        //      data: {
                                        //          doc_id: doc.id,
                                        //          url: doc.url,
                                        //          type: doc.type,
                                        //          embed_url: doc.embedUrl,
                                        //          thumbnail: thumbnail,
                                        //          name: doc.name
                                        //      }
                                        // });
                                    }
                                }
                            }).build();

            picker.setVisible(true);
            $('.picker.modal-dialog').css('z-index', '2001');
        }
    });

    classModel = window.classModel = new DC.models.Class();
    app = window.app = new DC.views.AppView({
        model: classModel
    });

})(jQuery);
