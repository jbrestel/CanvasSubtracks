define([
    'dojo/_base/declare',
    'dojo/_base/array',
    'dojo/_base/lang',
    'dojo/on',
    'JBrowse/View/Track/CanvasFeatures',
    'CanvasSubtracks/View/MultiRectLayout',
    'JBrowse/View/Track/BlockBased',
    'JBrowse/Util',
    'dojo/Deferred',
    'dijit/Tooltip',
    'dojox/grid/EnhancedGrid',
    'dojox/grid/enhanced/plugins/DnD'
],
function (
    declare,
    array,
    lang,
    on,
    CanvasFeatures,
    MultiRectLayout,
    BlockBased,
    Util,
    Deferred,
    Tooltip,
    EnhancedGrid
) {
    return declare(CanvasFeatures, {
        constructor: function () {
            var subtracks = [];
            array.forEach(this.getConf('subtracks'), function(subtrack) {
                var visible = subtrack.visible === 'true' ? true : 
                              subtrack.visible === 'false' ? false :
                              subtrack.visible;

                if(visible) {
                    subtracks.push(subtrack);
                }
            });

            this.minSubtrackHeight = 3;
            this.subtracks = subtracks;

        },

        _defaultConfig: function () {
            var ret = Util.deepUpdate(lang.clone(this.inherited(arguments)), {
                glyph: 'JBrowse/View/FeatureGlyph/Box',
                showLabels: true,
                showTooltips: true,
            });
            return ret;
        },



    _trackMenuOptions: function() {
        var opts = this.inherited(arguments);
        var thisB = this;
        opts.push({
            label: 'Select and Order Subtracks',
            title: 'Select and Order Subtracks',
            iconClass: 'dijitIconConfigure',
            action: 'contentDialog',
            content: dojo.hitch(this,'_trackSubtracksConfigure')
        });
        return opts;
    },

        _trackSubtracksConfigure: function() {
            console.log(this.getConf('subtracks'));
            return "THIS IS A TEST";
        },



        // override getLayout to access addRect method
        _getLayout: function (scale) {
            if( ! this.layout || this._layoutpitchX != 1/scale ) {
                var pitchY = this.getConf('layoutPitchY') || 6;
                this.layout = new MultiRectLayout({ pitchX: 1/scale, pitchY: pitchY, maxHeight: this.getConf('maxHeight'), displayMode: this.displayMode, subtracks: this.subtracks });
                this._layoutpitchX = 1/scale;
            }

            return this.layout;
        },


        makeTrackLabel: function () {
            var thisB = this;
            var c = this.config;
            this.inherited(arguments);

            if (this.config.showLabels || this.config.showTooltips) {

                this.sublabels = array.map(this.subtracks, function (elt) {

                    var htmlnode = dojo.create('div', {
                        className: 'track-sublabel',
                        id: thisB.config.label + '_' + elt.label,
                        style: {
                            position: 'absolute',
                            height: '15px',
                            font: thisB.config.labelFont,
                            backgroundColor: '#DCDCDC',
//                            opacity: 0.6,
                            visibility: 'hidden'
                        },
                        innerHTML: elt.label
                    }, thisB.div);

                    on(htmlnode, c.clickTooltips ? 'click' : 'mouseover', function () {
                        Tooltip.show(elt.label + '<br />', htmlnode);
                    });
                    on(htmlnode, 'mouseleave', function () {
                        Tooltip.hide(htmlnode);
                    });

                    return htmlnode;
                });
            }
        },


        updateStaticElements: function (/** Object*/ coords) {
            this.inherited(arguments);
            var thisB = this;
            
            if (this.sublabels && 'x' in coords) {
                array.forEach(this.sublabels, function (sublabel, i) {
                    sublabel.style.left = coords.x + 'px';
                    sublabel.style.top = thisB.subtracks[i].top  + 'px';
                    if(thisB.displayMode == 'normal') { 
                        sublabel.style.visibility = 'visible';
                    } 
                    else {
                        sublabel.style.visibility = 'hidden';
                    }

                }, this);
            }
        },

        renderAcrossSubtracks: function() {
            // Mainly here for Synteny Shading but possibly other cross subtrack rendering
        },

        validateAndRedrawLayout: function() {
            var redraw = false;
            var thisB = this;

            var sumHeights = 0;
            var top = 0;
            array.forEach(thisB.layout.layouts, function (layout, i) {
                var subtrackHeight = thisB.subtracks[i].height;
                var actualSubtrackHeight = layout.pTotalHeight - layout.sTop + 1;

                actualSubtrackHeight = actualSubtrackHeight < thisB.minSubtrackHeight ? thisB.minSubtrackHeight : actualSubtrackHeight;

                if(actualSubtrackHeight != subtrackHeight) {
                    thisB.subtracks[i].height = actualSubtrackHeight;
                    redraw = true;
                }

                top = sumHeights;
                thisB.subtracks[i].top = top * thisB.pitchY;
                sumHeights = sumHeights + thisB.subtracks[i].height;
                layout.sTop = top;
            });

            if(redraw) {
                thisB._clearLayout();
                thisB.hideAll();
                this.redraw();
            }
        },

    // override here to allow resizing if any subtrack height changes
    showRange: function(first, last, startBase, bpPerBlock, scale,
                        containerStart, containerEnd, finishCallback) {

        var thisB = this;

        if( this.fatalError ) {
            this.showFatalError( this.fatalError );
            return;
        }

        if ( this.blocks === undefined || ! this.blocks.length )
            return;

        // this might make more sense in setViewInfo, but the label element
        // isn't in the DOM tree yet at that point
        if ((this.labelHeight == 0) && this.label)
            this.labelHeight = this.label.offsetHeight;

        this.inShowRange = true;
        this.height = this.labelHeight;

        var firstAttached = (null == this.firstAttached ? last + 1 : this.firstAttached);
        var lastAttached =  (null == this.lastAttached ? first - 1 : this.lastAttached);

        var i, leftBase;
        var maxHeight = 0;
        var blockShowingPromises = [];
        //fill left, including existing blocks (to get their heights)
        for (i = lastAttached; i >= first; i--) {
            leftBase = startBase + (bpPerBlock * (i - first));
            blockShowingPromises.push( new Promise((resolve,reject) => {
                this._showBlock(i, leftBase, leftBase + bpPerBlock, scale,
                    containerStart, containerEnd, resolve);
            }))
        }
        //fill right
        for (i = lastAttached + 1; i <= last; i++) {
            leftBase = startBase + (bpPerBlock * (i - first));
            blockShowingPromises.push( new Promise((resolve,reject) => {
                this._showBlock(i, leftBase, leftBase + bpPerBlock, scale,
                    containerStart, containerEnd, resolve);
            }))
        }
        
        // if we have a finishing callback, call it when we have finished all our _showBlock calls
        if( finishCallback ) {
            Promise.all(blockShowingPromises)
                .then(finishCallback, finishCallback)
        }

        Promise.all(blockShowingPromises)
                .then(function() {
                    thisB.validateAndRedrawLayout();
                    thisB.renderAcrossSubtracks();
                });


        //detach left blocks
        var destBlock = this.blocks[first];
        for (i = firstAttached; i < first; i++) {
            this.transfer(this.blocks[i], destBlock, scale,
                          containerStart, containerEnd);
            this.cleanupBlock(this.blocks[i]);
            this._hideBlock(i);
        }
        //detach right blocks
        destBlock = this.blocks[last];
        for (i = lastAttached; i > last; i--) {
            this.transfer(this.blocks[i], destBlock, scale,
                          containerStart, containerEnd);
            this.cleanupBlock(this.blocks[i]);
            this._hideBlock(i);
        }

        this.firstAttached = first;
        this.lastAttached = last;
        this._adjustBlanks();
        this.inShowRange = false;




        this.heightUpdate(this.height);
        this.updateStaticElements( this.genomeView.getPosition() );
    },


    });
});
