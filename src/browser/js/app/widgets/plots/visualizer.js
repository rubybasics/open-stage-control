var {mapToScale, clip} = require('../utils'),
    _plots_base = require('./_plots_base'),
    {widgetManager} = require('../../managers')

module.exports = class Visualizer extends _plots_base {

    static options() {

        return {
            type:'visualizer',
            id:'auto',

            _style:'style',

            label:'auto',
            left:'auto',
            top:'auto',
            width:'auto',
            height:'auto',
            color:'auto',
            css:'',

            _plot:'plot',

            widgetId:'',
            duration:1,
            range: {min:0,max:1},
            origin: 'auto',
            logScale: false,

            _osc:'osc',

            value:'',
            address:'auto',
            preArgs:[],
        }

    }

    constructor(widgetData) {

        super(...arguments)

        this.pips.y.min = Math.abs(widgetData.range.min)>=1000?widgetData.range.min/1000+'k':widgetData.range.min
        this.pips.y.max = Math.abs(widgetData.range.max)>=1000?widgetData.range.max/1000+'k':widgetData.range.max
        this.pips.x = false
        this.length = Math.round(clip(60*widgetData.duration,[8,4096]))
        this.data = new Array(this.length)
        this.value = widgetData.range.min
        this.cancel = false
        this.loop = false

    }

    syncHandle(e) {

        if (this.widgetData.widgetId!=e.id || !widgetManager.getWidgetById(e.id).length) return
        this.startLoop()

    }

    startLoop() {

        if (this.cancel) clearTimeout(this.cancel)

        this.cancel = setTimeout(function(){
            clearInterval(this.loop)
            this.loop = false
            this.cancel = false
        },1000*this.widgetData.duration)

        if (this.loop) return

        this.loop = setInterval(()=>{

            this.updateData()
            this.draw()

        },1000*this.widgetData.duration/this.length)

    }


    draw_data() {

        var first = true
        var point = []

        for (var i=0;i<this.length;i++) {
            var newpoint = [
                mapToScale(i,[0,this.length-1],[0,this.width],1),
                mapToScale(this.data[i],[this.widgetData.range.min,this.widgetData.range.max],[this.height-PXSCALE,PXSCALE],1,this.widgetData.logScale,true),
            ]
            if (first) {
                this.ctx.moveTo(newpoint[0],newpoint[1])
                first = false
            } else {
                if (this.widgetData.logScale) {
                    this.ctx.quadraticCurveTo(newpoint[0], point[1], newpoint[0], newpoint[1])
                } else {
                    this.ctx.lineTo(newpoint[0],newpoint[1])
                }

            }
            point = newpoint
        }

    }


    updateData() {

        var id = this.widgetData.widgetId,
        widget = widgetManager.getWidgetById(id)

        if (typeof id == 'string' && widget.length) {
            var v = widget[widget.length-1].getValue()
            this.data.push(v)
            this.value = v
        } else {
            this.data.push(this.value)
        }

        this.data.splice(0,1)

    }

    setValue(v) {

        this.value = v
        this.startLoop()

    }

}
