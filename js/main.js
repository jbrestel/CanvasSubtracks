define([
       'dojo/_base/declare',
       'dojo/_base/array',
       'dijit/MenuItem',
       'JBrowse/Plugin'
       ],
       function(
           declare,
           array,
           dijitMenuItem,
           JBrowsePlugin
       ) {
return declare( JBrowsePlugin,
{
    constructor: function( args ) {
        var browser = args.browser;

        // do anything you need to initialize your plugin here
        console.log( "CanvasSubtracks plugin starting" );

    }
});
});
