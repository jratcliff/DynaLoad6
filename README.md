# Ext.ux.PackageLoader
--

Dynamic Command Package Load Driver for Ext 4.1+/5.0+

A Sencha Command build that supports Command packages and app.json is REQUIRED.

 For a backgrounder on design goals, see: https://docs.google.com/a/sencha.com/document/d/1meeNaPhVxyKFys5hkjncS60qOoMVodah25aTwaTtEbI/edit

For the LATEST release notes and package setup for either version of the extension
see: https://github.com/SenchaProSvcs/DynaLoad5/blob/DynaLoad5/DynaPackage/app/ux/PackageLoader.js source comments.

## What it DOES do:
- Adds "Ext.requirePackage" to any compatible application.
- Permits the freedom to define what a "dynamic package" IS and how it should be interpreted.
- Leverages package.json to allow declarative customization of what a package provides and what should be
loaded (eg. CSS & JS, JS, or CSS).
- Loads Sencha themes.
- Loads Localization packages for the framework.
- Loads any Script and/or StyleSheet assembly.
- Loads other named package dependencies in sequential-asynchronous order.
- REQUIRES a version of Sencha Command that supports 'package' constructs (eg. sencha generate package someName).
- Registers and initializes classic controllers with the current application controller (if
declared in the package.json to do so).
- Leverages existing internal 'Boot' or 'Ext.Loader' classes to load package assets (where suitable, added otherwise).

## What it DOES NOT do.
- It does NOT attempt to create a separate application controller for each package.
(To do so would isolate the package's Views and Controllers from the overall
 application's shared Event Domains and the dispatch mechanism of the single Message Bus)
- Although fully supported for Ext5, it does not attempt the register/initialize Ext5 View Controllers, as
 per-view-instance instantiation of view controllers occurs automagically.


## To Investigate ?
- Bind EventDomains for each named package.
- Sandbox namespace support for the ux itself.
- Assert possible amendments for Touch compatibility.
