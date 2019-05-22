define(['dojo/_base/declare',
        'dojo/_base/array',
        'JBrowse/View/GranularRectLayout',
       ],
function (
    declare,
    array,
    Layout
) {
  return declare(Layout, {
    constructor(args) {
        // stuff for subtracks
        this.sTop = args.sTop || 0;
        this.featureFilters = args.featureFilters;

        this.pitchX = args.pitchX || 10
        this.pitchY = args.pitchY || 10

        this.displayMode = args.displayMode

        // reduce the pitchY to try and pack the features tighter
        if (this.displayMode === 'compact') {
            this.pitchY = Math.round(this.pitchY / 4) || 1
            this.pitchX = Math.round(this.pitchX / 4) || 1
        }

        // console.log(`pitch: ${this.pitchX} / ${this.pitchY}`)

        this.bitmap = []
        this.rectangles = {}
        this.maxHeight = Math.ceil((args.maxHeight || Infinity) / this.pitchY)

        this.pTotalHeight = 0 // total height, in units of bitmap squares (px/pitchY)
    },


    // overriding this to set the top
    addRect(id, left, right, height, data) {
        // if we have already laid it out, return its layout
        if (id in this.rectangles) {
            const storedRec = this.rectangles[id]
            if (storedRec.top === null) return null

            // add it to the bitmap again, since that bitmap range may have been discarded
            this._addRectToBitmap(storedRec, data)
            return storedRec.top * this.pitchY;
        }

        const pLeft = Math.floor(left / this.pitchX)
        const pRight = Math.floor(right / this.pitchX)
        const pHeight = Math.ceil(height / this.pitchY)

        const midX = Math.floor((pLeft + pRight) / 2)
        const rectangle = { id, l: pLeft, r: pRight, mX: midX, h: pHeight }
        if (data) rectangle.data = data

        const maxTop = this.maxHeight - pHeight
        let top = this.sTop;

        for (; top <= maxTop; top += 1) {
            if (!this._collides(rectangle, top)) break
        }

        if (top > maxTop) {
            rectangle.top = top = null
            this.rectangles[id] = rectangle
            this.pTotalHeight = Math.max(this.pTotalHeight || 0, top + pHeight)
            return null
        }
        rectangle.top = top;
        this._addRectToBitmap(rectangle, data)
        this.rectangles[id] = rectangle
        this.pTotalHeight = Math.max(this.pTotalHeight || 0, top + pHeight)
        // console.log(`G2 ${data.get('name')} ${top}`)

        return top * this.pitchY;
    }



  })
})
