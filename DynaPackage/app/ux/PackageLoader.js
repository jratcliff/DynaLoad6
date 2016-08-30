
/**
 * @class Ext.ux.PackageLoader
 * @singleton
 * @version 5.0
 * @author Doug Hendricks, Sencha Services
 * @platform Ext 5.0+, Sencha Command 5.0+ REQUIRED
 *
 * A dynamic Sencha Command Package Loader for ExtJs 5.0
 *
 *   <h2>Preface:</h2>
 *
 *    In all examples presented here:
 * @example
      // <debug>
       ....
      // </debug>

 *     ...indicates that script statements inclusive of this markdown comment block are excluded by Sencha Command from
 *     production builds.  Thus, statements included within the block are executed while operating in normal development
 *     mode only.
 *
 * <h2>Command Package Setup</h2>
 *
 *    1) Using standard Sencha Command methods, first create a package to host your re-usable module:
 *
 *           sencha generate package general-ledger
 *
 *       By default, this generates a standard 'code' package in the /packages path of your current Command
 *       workspace.
 *
 *    2) Now, editing the {workspace}/packages/general-ledger/.sencha/package/sencha.cfg file,
 *       ensure the following entry is placed near the end of the file:
 * @example
    #==============================================================================
    # Custom Properties - Place customizations below this line to avoid merge
    # conflicts with newer versions

    package.framework=ext
 *
 *        This ensures that while developing your project (development mode) Command and Ext.Loader can resolve
 *        any package dependencies in conjunction with your application using the 'ext' framework.
 *
 *      <h3>Package configuration considerations</h3>
 *
 *       If your package will NOT be including any custom style sheets, also append the following
 *       to the above sencha.cfg file:
 *
 *          skip.resources=1
 *
 *       This prevents Command from attempting to move style sheets and other assets into the final build
 *       path for your package.
 *
 *       If you ARE including style sheets but do not require SASS/Compass compilation, then also include:
 *
 *          skip.resources=0  (or simply remove)
 *          skip.sass=1
 *
 *       Likewise, if your package ONLY contains style sheets and image artifacts (no scripts or overrides),
 *       include:
 *
 *          skip.js=1
 *
 *        and omit the previous (skip.resources, skip.sass) entries as applicable.
 *
 *    3) As the PackageLoader relies on your package.json file to resolve other dependencies and dynamic loading
 *       behavior, it requires that a copy of your package.json file be moved into the package build path
 *       adjacent to the assets the package represents.
 *
 *       If, after considering step 2 above, your package is a style sheet only (eg. theme) package
 *       (with no scripts -- including /overrides), then edit:
 *
 *           {workspace}/packages/general-ledger/.sencha/package/resources-impl.xml file, replace the
 *           following default entry:
 *
 *               <target name="-after-copy-resources" />
 *
 *           with:
 *
 *               <target name="-after-copy-resources">
                     <echo>Copying package.json to ${package.build.dir}</echo>
                     <copy file="package.json" todir="${package.build.dir}" overwrite="true" />
                 </target>
 *
 *       If, however after considering step 2 above, your package includes either (/src) scripts or (/overrides)),
 *       then instead, edit:
 *
 *           {workspace}/packages/general-ledger/.sencha/package/js-impl.xml file, replacing the
 *           following default entry:
 *
 *               <target name="-after-js" />
 *
 *           with:
 *
 *               <target name="-after-js">
 *                  <echo>Copying package.json to ${package.build.dir}</echo>
 *                  <copy file="package.json" todir="${package.build.dir}" overwrite="true" />
 *                </target>
 *
 *    4) Next, edit your package's package.json file.  It is here that many aspects of the Command package
 *      build process and those of the PackageLoader are easily controlled and customized for use within applications.
 *      Below is a typical package.json sample which represents various configuration options available for package
 *      build constructs and the PackageLoader itself (inline comments are informational only and should be excluded):
 *
 *  @example
    {
        "name": "general-ledger",
        "type": "code",
        "creator": "Fanciful",
        "summary": "Fanciful General Ledger",
        "detailedDescription": "Full-featured General Ledger",
        "version": "1.0.0",
        "compatVersion": "1.0.0",
        "format": "1",
        "slicer": {
             "js": [
                 {
                     "path": "${package.dir}/sass/example/custom.js",
                     "isWidgetManifest": true
                 }
             ]
        },

        // adjust for production build target, setting ux.PackageLoader.packageRootPath to equivalent url
        "outputDir": "${package.dir}/build",

        "local": true,

        "requires": [          // <- dependent packages resolved by the PackageLoader as well
            "fanciful-lib",
            "fanciful-api-rest"
        ],

    // PackageLoader-specific options

        "skipResources" : true, // omit to enable or 'true' to avoid dynamic style sheet loading
        "skipJS" : true,        // omit to enable or 'true' to avoid dynamic script/override loading

        // controllers listed here are registered with the Application controller and initialized automatically
        "controllers" : [
            "Fanciful.controller.Ledger"
        ]

    // create YOUR OWN arbitrary properties to suite application needs
        "primaryViewClass" : "Fanciful.view.Ledger"  // <- designate the default View for rendering
     }
 *
 *   6) After adjusting the various applicable configuration options as noted above, drop the following class
 *      into your {workspace}/packages/general-ledger/src/view/Ledger.js source file:
 * @example

       Ext.define('Fanciful.view.Ledger', {
            extend : 'Ext.panel.Panel',
          requires : 'Ext.panel.Panel',
             xtype : 'gl-container',
             title : 'General Ledger',
              html : 'your books are in balance!'
       });

 *   7) Optionally if your package participates in Sencha MVC, define one ore more controller(s) in your package,
 *      placing it at {workspace}/packages/general-ledger/src/controller/Ledger.js
 * @example

        Ext.define('Fanciful.controller.Ledger', {
             extend : 'Ext.app.Controller',

             init : function(application) {
               this.control ({ });
             }
        });
 *
 *  NOTE: Due to the way Controllers are registered with the Application controller ( in the example above,
 *  'Ledger' would become the 'id', as derived from the Controller's class name during registration), it is possible
 *  that the same Controller.id might already be registered with the Application Controller before the package was loaded.
 *  This is detected, and an Error is raised in that scenario.  The Class name suffix conflict will need to be manually
 *  resolved (perhaps by ensuring a 'package-oriented' naming convention for packaged Controllers):
 * @example
        Ext.define('Fanciful.controller.GL_Ledger', {
             extend : 'Ext.app.Controller',

 *   (Note the .GL_ prefix (or other) added the className to ensure unique Controller identification across packaging)
 *
 *   8) Once a unique Controller suffix is resolved, modify the package.json file further to
 *      designate the Array list of Controllers that the PackageLoader should register and initialize
 *      when the package is loaded for the first time.
 *
 *      If your package has no Controllers you can skip this step.
 * @example

    "controllers" : [
            "Fanciful.controller.GL_Ledger"
        ]

 *   9) Now, build your package for the first time:
 *
 *      cd {workspace}/packages/general-ledger
 *      sencha package build
 *
 *   If all went well, your default '{workspace}/packages/general-ledger/build' should
 *   (depending on chosen package configuration options) look similar to this:
 *
 *    ../build/
 *          package.json
 *          general-ledger.js
 *          general-ledger-debug.js
 *          resources/
 *              general-ledger-all.css
 *              general-ledger-all-debug.css
 *              general-ledger-all-rtl.css
 *              general-ledger-all-rtl-debug.css
 *              images/
 *                  *.*
 *
 * <h2>Application Usage</h2>
 *
 * Early in your Application's startup scripts (your Application.js file is a good choice), place this block of script
 * at the top of the script, adjusting the Loader's 'Ext.ux' path to reflect your placement of the PackageLoader script
 * location as necessary.
 *  @example

     // <debug>
     Ext.Loader.setPath({
         'Ext.ux'  : 'app/ux/'
     });
     // </debug>

    // Load/initialize the PackageLoader early
    Ext.require( 'Ext.ux.PackageLoader', function() {

         Ext.apply(Ext.ux.PackageLoader, {
            packageRootPath : (Ext.isSecure ? 'https' : 'http') + '://fanciful.superCDN.com/packages/{0}/',
            disableCaching  : false
            // <debug>
            // development Mode relative/absolute address of build packages
            ,packageRootPath : '../packages/{0}/build/',
            enableDebug     : true,
            disableCaching  : true
            // </debug>
         });

    });

 * At this stage, the Package loader may be utilized in most any situation.  The following example demonstrates
 * how to request a package (or previously loaded package) and insert the package's default View into an existing layout
 * from a typical Controller where menu items or buttons have (loadable) moduleActions defined:
 * @example

 Ext.define('Fanciful.controller.Navigation', {
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

             var config = results[0] || {};   //we only asked for one

             // When successful, the config is an object reference to the full package.json structure
             if(success && config.primaryViewClass) // custom 'defaultViewClass' property
              {
                  this.child('component[region=center]').add(
                     Ext.create( config.primaryViewClass)
                  );

              } else {
                 //otherwise, config is simply the failed string package name
                  Ext.log.warn('Package ' + config + ' was not available or, could not determine the view to render: ' + config.primaryViewClass);
              }
              item.enable();

         }, this.getApplication().viewport );
     }
 });
 *
 *  <h3>NOTES</h3>:
 *
 *  1) After package development, packages designed for dynamic loading should be excluded
 *     from app.json's requires: [] to prevent their inclusion in static Sencha Command builds.
 *
 *  2) 'package' is a reserved word in ECMA Javascript
 *
 *  3) Legacy versions of Internet Explorer have hard limits on the total number of active style sheets.
 *     If your Command package is NOT designed to supply a style sheet, avoid this constraint:
 *
 *     In your package.json file, add:
 *
 *       "skipResources" : true
 *
 *     and in your package's .sencha/package/sencha.cfg, assert:
 *
 *        skip.sass=1
 *        skip.resources=1
 *
 *     then run "sencha package build" again.
 *
 *     This important configuration will prevent unnecessary loading of empty style sheets for packages
 *     that do not offer them.
 *
 *  <h2> Localized Packages </h2>
 *
 *  One possible implementation for dynamic loading of localized packages is outlined below.  It works with the
 *  PackageLoader's underlying support for dynamic loading of OTHER package dependencies.  Let us assume we need a
 *  French version of the 'general-ledger' package already assembled.
 *
 *  1) Create a new Command package:
 *
 *      sencha generate package general-ledger-fr
 *
 *  2) Following the steps outlined previously for package setup, modify the new 'general-ledger-fr' package.json file:
 * @example
     "requires": [
          "general-ledger"  // the full english package with all classes and styling
      ],
      "primaryViewClass" : "Fanciful.view.Ledger",
      "skipResources" : true   // assumes no additional styling is required

 *  3) After adjusting the various applicable configuration options (package/.sencha.cfg etc) as noted above, drop the
 *     following class into your {workspace}/packages/general-ledger-fr/overrides/Localize.js source file.
 *     Include as many overrides as necessary or place each in separate script files (Command will parse them all anyway):
 * @example

        Ext.define('Fanciful.locale.Ledger', {
             override : 'Fanciful.view.Ledger',
             title : 'grand livre général',
             html : 'vos livres sont en équilibre!'
        });

 *  4) Now, build your new localized package for the first time:
 *  @example

        cd {workspace}/packages/general-ledger-fr
        sencha package build
 *
 *  5) At this stage, you may now request the localized package directly which will ensure the required
 *     (english default) package is loaded before the localization overrides are applied:
 *  @example

        var locale = this.getApplication().getUser().locale, //or equivalent indicator
            packageName = 'general-ledger' +
                (locale ?
                    '-' + locale :
                    ''   //default to english package
                );

        Ext.requirePackage( packageName , function callback(success, results) { ... });
 */


Ext.define('Ext.ux.PackageLoader', {

    requires : [
        'Ext.data.Connection'
    ],

    singleton : true,

    /**
     * @cfg {Boolean} [disableCaching=false]
     * Set 'true' to ensure the latest version of package assets are loaded
     */
    disableCaching : false,

    /**
     * @cfg {String} [applicationRootPath=./]
     * Site-relative path location of the required to read the app.json descriptor
     */
    applicationRootPath : './',

    /**
     * @cfg {String} packageRootPath
     * Site-relative or absolute path where package builds are deployed
     */
    packageRootPath : '../packages/{0}/build/',

    /**
     * @cfg {Boolean} [enableRtl=false]
     * True to enable RTL suffix for loading package's stylesheet(s)
     */
    enableRtl : false,

    /**
     * @cfg {Boolean} [enableDebug=false]
     * True to load uncompressed -debug versions of packaged script and CSS files
     */
    enableDebug : false,

    /**
     * @cfg {Boolean} [strictPackaging=true]
     * When true:
     *   <p>the failure to locate the package.json descriptor for a package
     *      is considered a hard failure.  (No attempt will be made to load
     *      package assets if the descriptor is not available.)</p>
     *
     * When false:
     *   <p>the package.json descriptor is not required but an attempt will
     *      be made to load both script and default stylesheet assets for the package.
     *      If either are absent (unless 'skipResources' or 'skipJS' are set 'true', see below),
     *      a hard failure will occur.</p>
     *
     * In either case, if the descriptor IS available, any dependent packages that the desired package
     * requires, will also be resolved/loaded.  The attempt to load either or both scripts
     * and stylesheets for the package may be further controlled by setting:
     *
     *     "skipResources" : true
     *     "skipJS" : true
     *
     * when appropriate in each package's package.json descriptor.
     */
    strictPackaging : true,

    /**
     * @method getPackage
     * Asynchronously retrieves a single or multiple Command package with optional callback function.
     * If the package has already been loaded, the callback function is always called again for each
     * package requested.
     *
     * Note:  this method gathers packages in full asynchronous mode.  All package load attempts are made
     * concurrently.  For fully sequential loading support see the {@link:getPackageSequential} method.
     *
     * @param {String|Array} packageName single Name or Array of packageNames to load
     * @param {Function} [callback] Function called as each package load attempt is made
     * @param {Object} [scope] callback scope
     */
    getPackage : function(packageName, callback, scope) {

        callback = Ext.bind(Ext.isFunction(callback) ? callback : Ext.emptyFn, scope || null);

        var me = Ext.ux.PackageLoader,
            packageId,
            packageEntry,
            packages = [].concat(packageName || []);

        while (packages.length) {

            packageId = packages.shift();

            //assert presence in the registry
            packageEntry = me.assertPackage(packageId);

            if (!packageEntry.loaded) {
                packageEntry.callbacks.push(callback);  //queue for notification
                if (!packageEntry.loading) {
                    packageEntry.loading = true;

                    /**
                     * Retrieve the package.json to determine other requires:[] dependencies
                     * and validate package type
                     */
                    me.getPackageConfig(packageId, function(config, success) {

                        config = config || {};

                        var requires,
                            packageName = config.name || packageId;

                        /**
                         * NOTE: Full package dependency support requires that the package's
                         * 'package.json' definition ALSO be copied to
                         * the package's build path.  If absent in the package deployment
                         * tree, additional package dependencies will NOT be considered.
                         */

                        if (!success) {
                            // <debug>
                            Ext.log.warn("Descriptor for Package '" + packageName + "' could not be located.");
                            // </debug>
                            if (me.strictPackaging) {
                                return me.packageNotify(packageName, false);
                            }
                        }

                        //gather a list of other packages that this package may require and clone as working queue
                        requires = [].concat(
                            packageEntry.requires = Ext.Array.from(config.requires)
                        );

                        // Sequential Async load of this package's other dependent packages
                        if (requires.length) {

                            me.getPackageSequential(requires, function(success, dependencies){

                                if(success) {
                                    me.gatherPackageAssets(packageName, packageEntry);
                                }
                                else {
                                    // <debug>
                                    Ext.log.error("Dependent package '" +
                                        dependencies[0] +
                                        "' for Package '" + packageName +
                                        "' could not be located"
                                    );
                                    // </debug>
                                    return me.packageNotify(dependencies[0], false);
                                }
                            });
                        }
                        else {
                            me.gatherPackageAssets(packageName, packageEntry);
                        }
                    });
                }
            } else {
                // If load is not pending, notify as available immediately
                 callback(true, packageEntry.packageConfig);
            }
        }
    },

    /**
     * @method getPackageSequential
     * Sequentially retrieves a named Command package (or packages) with optional callback function.
     * When specifying an Array of packages, each successive package load attempt is deferred
     * until the previous completes.
     *
     * Note: This method invokes the callback ONCE when all packages specified are available or the
     * first error occurs.
     * @param {String|Array} packageName single Name or Array of package names to load
     * @param {Function} [callback] Function called when all specified packages are loaded
     * @param {Object} [scope] callback scope
     */
    getPackageSequential : function(packageName, callback, scope) {

        var me      = Ext.ux.PackageLoader,
            queue   = [].concat(packageName || []),
            queueLen= queue.length,
            loaded  = [],
            cb      = Ext.bind(Ext.isFunction(callback) ? callback : Ext.emptyFn, scope || null),
            iterate = function() {
                var packageId;
                if (queue.length) {
                    packageId = queue.shift();
                    me.getPackage(packageId, function(success, packageConfig){

                        if(success) {
                            loaded.push(packageConfig || packageId);
                        } else {
                            // Fail on first package failure, indicating the failed package by name
                            loaded = [packageId];
                            queueLen = 0; //force false callback
                            queue = [];   //flush remaining
                        }
                        Ext.Function.defer(iterate, 2);  //yield and relieve call stack
                    });
                    return;
                } else {
                    // !!queueLen == 0 implies nothing initially to do
                    cb(!!queueLen && true, loaded);
                }
                // cleanse the closure for GC
                iterate = queue = loaded = cb = me = null;
            };
        iterate();
    },

    /**
     * @method gatherPackageAssets
     * @param {String} packageName
     * @param {Object} [packageEntry]
     * @private
     * Note: As no singular dependency exists between CSS and scripts,
     * both assets are loaded concurrently/asynchronously
     */
    gatherPackageAssets :function(packageName, packageEntry) {
        var me = Ext.ux.PackageLoader,
            pass = Ext.Function.pass,
            config = (packageEntry || me.assertPackage(packageName)).packageConfig || {},
            packagePath = me.getPackagePath(packageName),
            urls = [];

        /**
         * if implicitly set, there are no known stylesheets to load for the package
         */
        if (config.skipResources !== true) {
            urls.push(
                packagePath + 'resources/' + packageName +
                (me.enableRtl ? '-all-rtl' : '-all') +
                (me.enableDebug ? '-debug.css' : '.css')
            );
        }

        /**
         * if implicitly set, there are no known scripts to load for the package
         */
        if (config.skipJS !== true ) {
            urls.push(packagePath + packageName + (me.enableDebug ? '-debug.js' : '.js'));
        }

        if (urls.length) {
            Ext.Boot.load({
                cache : !me.disableCaching,
                url: urls,
                success: pass(me.onPackageLoaded, [packageName], me),
                failure : pass(me.onPackageError, [packageName], me)
            });
        }
        else {
            // <debug>
            console.warn('Package '+ packageName + ' is not configured to load anything.');
            // </debug>
            me.onPackageError(packageName);
        }

    },

    /**
     * Retrieve a package.json for a named package
     * @param {String} packageName
     * @param {Function} [callback]
     * @param {Object} [scope] callback scope
     */
    getPackageConfig : function(packageName, callback, scope) {

        var me = Ext.ux.PackageLoader,
            cb = Ext.bind(Ext.isFunction(callback) ? callback : Ext.emptyFn, scope || null),
            packageEntry;

        if (packageName) {

            packageEntry = me.assertPackage(packageName);

            //If cached already, invoke callback immediately
            if (packageEntry.packageConfig) {
                cb(packageEntry.packageConfig, true);
                return;
            }

            Ext.create('Ext.data.Connection').request({
                url         : me.getPackagePath(packageName) + 'package.json',
                method      : 'GET',
                callback    : function(options, success, response ) {
                    var config = (success && response.responseText) ?
                        Ext.decode(response.responseText) : null;
                    cb(
                        packageEntry.packageConfig = config,
                        !!config && success
                    );
                }
            });
        }
    },

    /**
     * Update internal structures to indicate all package members are present
     * @param {String} packageName
     */
    onPackageLoaded : function(packageName) {

        var me = Ext.ux.PackageLoader,
            manifest = Ext.manifest,
            packageEntry = me.assertPackage(packageName),
            packageConfig = packageEntry.packageConfig;

        //Keep the Ext.manifest up to date with runtime additions
        Ext.Array.include(manifest.requires, packageName);

        packageEntry.loaded = manifest[packageName] = true;

        // Initialize any controllers: [ ] specified in package.json
        if (packageConfig &&
            packageConfig.skipJS !== true &&
            packageConfig.controllers &&
            packageConfig.controllers.length
            ) {
            me.initControllers(packageConfig.controllers, packageName);
        }
        me.packageNotify(packageName, true);
        // <debug>
        Ext.log.info('Command package retrieved: ' + packageName);
        // </debug>
    },

    /**
     * @param {String} packageName
     * @param {Request} request
     */
    onPackageError : function(packageName, request) {
        // <debug>
        console.error('package load failed:', packageName, ' (Is it in the package build path yet?)', request);
        // </debug>
        this.packageNotify(packageName, false);
    },

    /**
     * @param {String} packageName
     */
    getPackagePath : function(packageName) {
        return Ext.String.format( this.packageRootPath || String(packageName || ''), packageName );
    },

    privates : {

        /**
         * Reports the load state of a named package
         * @param packageName
         * @return {Boolean}
         */
        isPackageLoaded: function (packageName) {
            return packageName && !!(Ext.ux.PackageLoader.assertPackage(packageName) || {}).loaded;
        },

        /**
         * @private
         * @protected
         * Return the private package state hash for a named package
         * @param {String} packageName
         */
        assertPackage: function (packageName) {
            var me = Ext.ux.PackageLoader,
                registry = me.packages,
                thePackage = registry[packageName] || (registry[packageName] = {callbacks : []});

            /**
             * Evaluate devMode presence of the packageName.  If present in the requires array or packages collection
             * of the Ext.manifest, it is already part of the development configuration or destined for a static build anyway.
             */
            if (!thePackage.loaded &&
                (Ext.Array.contains(Ext.manifest.requires || [], packageName) ||
                    packageName in Ext.manifest.packages)
                ) {
                thePackage.loaded = true;
            }
            return thePackage;
        },

        /**
         * @private
         * @protected
         * Notify all package request callbacks of success
         * @param {String} packageName
         * @param {Boolean} success
         */
        packageNotify: function (packageName, success) {

            success = !!success;

            var packageEntry = this.assertPackage(packageName),
                isFunction = Ext.isFunction,
                callbacks = packageEntry.callbacks, cb,
                packageInfo = success ? packageEntry.packageConfig : packageName;

            while (callbacks.length) {
                if (isFunction(cb = callbacks.shift())) {
                    cb(success, packageInfo);
                }
            }
            packageEntry.loading = false;
        },

        /**
         * @private
         * @protected
         *  @param {String|Array[]} controllers
         *  @param {String} packageName
         * Registers named controller classes with the Application Controller if present
         */
        initControllers: function (controllers, packageName) {

            controllers = Ext.Array.from(controllers);

            var application = Ext.app && Ext.app.Application.instance,
                classManager = Ext.ClassManager,
                controller,
                className,
                existing,
                suffix, i, len;

            if (application && packageName && (len = controllers.length)) {

                for (i = 0; i < len; ++i) {

                    className = String(controllers[i] || '');

                    if (className) {

                        suffix = className.split('.');
                        suffix = suffix[suffix.length - 1];

                        // Assert the Controller specified matches one included in the package (spelling)
                        if (!classManager.isCreated(className)) {
                            Ext.Error.raise('Dynamic package: \'' + packageName +
                                    '\' contains a Controller reference to an unknown class name: ' + className
                            );
                        }

                        // Assert the Controller's .suffix (id) is not already defined in the Application Controller
                        if (!(existing = application.controllers.get(suffix))) {

                            controller = Ext.create(className, {
                                application: application,
                                id: suffix
                            });

                            // Assert the Controller is truly compatible
                            if (!('getApplication' in controller)) {
                                Ext.Error.raise('Dynamic package: \'' + packageName +
                                        '\' contains a Controller reference that is not an \'Ext.app.Controller\' or subclass: \'' +
                                        className + '\''
                                );
                            }

                            application.controllers.add(controller);

                            //call controllers init method if application is already initialized
                            if (application._initialized) {
                                controller.doInit(application);
                                // <debug>
                                Ext.log.info('Dynamic package: \'' + packageName +
                                        '\', Controller: \'' +
                                        className +
                                        '\' was initialized.'
                                );
                                // </debug>
                            }

                            //initialize any controllers:[ ] specified on the controller
                            controller.finishInit(application);

                        }
                        else {
                            Ext.Error.raise('Dynamic package: \'' + packageName +
                                    '\' contains a Controller: \'' +
                                    className +
                                    '\' whose suffix \'' + suffix +
                                    '\' conflicts with existing Controller: \'' +
                                    existing.$className + '\''
                            );
                        }
                    }
                }
            }
        },

        /**
         * @private
         * @protected
         * local package registry
         */
        packages: {}
    }

}, function() {

    var pLoader = this,
        bind    = Ext.Function.bind;

    Ext.requirePackage  = bind(pLoader.getPackageSequential, pLoader);
    Ext.isPackageLoaded = bind(pLoader.isPackageLoaded, pLoader);

    // <debug>
    /**
     * In devMode only, app.json contains a list of required packages.  This will be gathered
     * initially to identify packages that will be included in a build or are known to the
     * current bootstrap.  It also asserts that the application was built with Sencha Command
     * (a prerequisite).
     */
    Ext.create('Ext.data.Connection').request({
        url         : pLoader.applicationRootPath + 'app.json',
        method      : 'GET',
        callback    : function(options, success, response ) {

            var config = (success && response.responseText) ?
                Ext.decode(response.responseText) : null;

            if (!config) {
                Ext.Error.raise('A suitable app.json configuration for this Application could not be located.' +
                    ' A Sencha Command generated Application is required for this feature.');
            }
        }
    });
    // </debug>
});

