/**
 * The main application class. An instance of this class is created by app.js when it calls
 * Ext.application(). This is the ideal place to handle application launch and initialization
 * details.
 */

// <debug>
Ext.Loader.setPath({
    'Ext.ux'  : 'app/ux/'
});
// </debug>

// Load/initialize the PackageLoader
Ext.require( 'Ext.ux.PackageLoader', function() {

     Ext.apply(Ext.ux.PackageLoader, {
        packageRootPath:'../packages/{0}/build/',
        disableCaching  : false
        // <debug>
        // development Mode relative/absolute address of build packages
        ,packageRootPath : '../packages/{0}/build/',
        enableDebug     : true,
        disableCaching  : true
        // </debug>
     });

});

Ext.define('DynaPackage.Application', {
    extend: 'Ext.app.Application',
    
    name: 'DynaPackage',

    config : {
        user : {
            name   : 'GL master',
            locale : 'fr'
        }
    },

    controllers : [ 'Navigator'],

    stores: [
        // TODO: add global / shared stores here
    ],
    
    launch: function () {
        // TODO - Launch the application
    }
});
