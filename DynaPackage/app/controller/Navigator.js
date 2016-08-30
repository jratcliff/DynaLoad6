/**
 * Created by doug on 7/14/14.
 * A generic Global Controller which responds only to menuitems and buttons with moduleAction (packages) defined.
 */

Ext.define('DynaPackage.controller.Navigator', {
    extend: 'Ext.app.Controller',

     init: function(application) {

        this.control({
            'menuitem[moduleAction]' : { click : 'onModuleAction' },
            'button[moduleAction]' : { click : 'onModuleAction' }
        });
     },

     onModuleAction : function(item) {

        // Request the named item.moduleAction (eg. 'general-ledger') package with callback function
        item.disable();

        Ext.requirePackage( item.moduleAction, function callback(success, results) {

             var config = results[0] || {},   //we only asked for one
                 tabs = this.down('component[region=center]');


             // When successful, the config is an object reference to the full package.json structure
             if(success && tabs && config.primaryViewClass) // custom 'primaryViewClass' property
              {
                  tabs.setActiveTab(
                      tabs.add( Ext.create( config.primaryViewClass, { closable : true }) )
                  );
                  item.enable();

              } else {
                 //otherwise, config is simply the failed string package name
                  Ext.log.warn('Package ' + config + ' was not available or, could not determine the view to render: ' + config.primaryViewClass);
              }


         }, this.getApplication().getMainView() );
     }

});