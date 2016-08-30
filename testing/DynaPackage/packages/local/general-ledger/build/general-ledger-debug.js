/**
 * Created by doug on 7/14/14.
 */
Ext.define('Fanciful.controller.Ledger', {
    extend: 'Ext.app.Controller',
    requires: 'Ext.app.Controller',
    init: function(application) {
        this.control({});
    }
});

/**
 * Created by doug on 7/14/14.
 */
Ext.define('Fanciful.view.Ledger', {
    extend: 'Ext.panel.Panel',
    requires: 'Ext.panel.Panel',
    xtype: 'gl-container',
    config: {
        title: 'General Ledger'
    },
    html: 'your books are in balance!'
});

