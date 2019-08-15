/**
 * augments JBrowse REST API to append the visible region coordinates
 */
define([
           'dojo/_base/declare',
           'dojo/_base/lang',
           'dojo/_base/array',
           'dojo/io-query',
           'dojo/request',
           'dojo/Deferred',
           'JBrowse/Store/LRUCache',
           'JBrowse/Store/SeqFeature',
           'JBrowse/Store/SeqFeature/REST',
           'JBrowse/Store/DeferredFeaturesMixin',
           'JBrowse/Store/DeferredStatsMixin',
           'JBrowse/Util',
           'JBrowse/Model/SimpleFeature'
       ],
       function(
           declare,
           lang,
           array,
           ioquery,
           dojoRequest,
           Deferred,
           LRUCache,
           SeqFeatureStore,
           RESTStore,
           DeferredFeaturesMixin,
           DeferredStatsMixin,
           Util,
           SimpleFeature
       ) {

return declare( RESTStore,
{
    _makeURL: function( subpath, query ) {
        var url = this.baseUrl + subpath;

        if( query ) {

            // ADD visible Region to query params
            var visibleRegion = this.browser.view.visibleRegion();
            query["visibleRegionStart"] = visibleRegion["start"];
            query["visibleRegionEnd"] = visibleRegion["end"];

            if( query.ref ) {
                url += '/' + query.ref;
                query = lang.mixin({}, query );
                delete query.ref;
            }

            query = ioquery.objectToQuery( query );
            if( query )
                url += '?' + query;
        }


        return url;
    }
});
});
