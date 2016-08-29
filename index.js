/**
 * Created by Mikael Lindahl on 2016-07-19.
 */
'use strict';

const util=require('util');
let _stream;

/**
 * - `options` Object with the following keys:
 *   - `label` Process bar label
 *   - `total` Total number of ticks to complete
 *   - `append` If true show accumulated tick text separated with comma
 *   - `show` Show configuration object with the following keys:
 *      - `active` Which bar items to show
 *          - `bar` true|false
 *          - `percent` true|false
 *          - `count` true|false
 *          - `time` true|false
 *      - `overwrite` If bar should do line overwrite true|false
 *      - `label` Object with the following keys:
 *          - `color` ANSI color as string
 *      - `bar` Object with the following keys:
 *          - `color` ANSI color
 *          - `length` bar length
 *          - `completed` character to show fro complete bar tick
 *          - `incompleted` character to show fro incompleted bar
 *          - `tick_per_progress` number of tick one progress step represents (only applicable with overwrite=false)
 *      - `percent` Object with the following keys:
 *          - `color` ANSI color
 *      - `count` Object with the following keys:
 *          - `color` ANSI color
 *      - `time` Object with the following keys:
 *          - `color` ANSI color
 *      - `tick` Object with the following keys:
 *          - `color` ANSI color
 *      - `stream` Stream to write to (process.stdout default)
 * - `draw` Custom draw function `()=>(bar, stream){ The magic ... )`
 *
 *   @param {object} options
 *   @api public
 */

function Bar(options, draw) {

    options=options || {};
    _stream = options.stream || process.stdout; //set stream, avoid set it on object to avoid circular dependencies

    this.draw=draw;

    this.label = options.label || 'Processing';
    this.total = options.total;
    this.counter = 0;
    this.bar_tick=0;
    this.append = options.append;
    this.complete = false;
    this.new_line=true;

    this.show = {
        active: {
            bar:true,
            percent:true,
            count:true,
            time:true
        },
        overwrite: true,
        label:{
            color: '\x1b[1;37m', // bold
        },
        bar: {
            length: 10,
            color: '\x1b[0;37m', // white
            completed:'=',
            incompleted:'_',
            tick_per_progress:1, //number of tick one progress step represents
        },
        percent: {
            color: '\x1b[1;36m', //cyan bold
        },
        count: {
            color: '\x1b[1;35m' //magenta bold
        },
        time: {
            color: '\x1b[1;33m' // green bold
        },
        tick:{
            color:'\x1b[0;37m', // white
        }
    };
    this.timer = undefined;


    for (let key1 in options.show){
        if(typeof options.show[key1]=='object'){
            for (let key2 in options.show[key1]){
                this.show[key1][key2]=options.show[key1][key2];
            }
        }else{
            this.show[key1]=options.show[key1]
        }
    }
}


/**
 *  Increment the bar with one
 *
 * - `text` shown at tick.
 *
 * @param {text|object} text to show at tick
 * @api public
 */
Bar.prototype.tick = function (text) {

    if(this.counter==0  && this.show.time){
        this.timer=new Date().valueOf();
    }

    this.counter += 1;

    if (this.append) {
        if (this.counter == this.total) {
            this.text += text
        } else {
            this.text += text + ', '
        }
    } else {
        this.text = text;
    }

    this._draw();

    if (this.counter == this.total) {
        this.complete=true;
        console.log(' '); //insert rowbreak
    };

};


/**
 * Reset the progress bar
 *
 * @api public
 */
Bar.prototype.reset= function(){

    this.counter=0;
    this.complete=false;

    return this

};

/**
 * Change total ticks of the progress bar
 *
 * - `total` Total number of ticks
 *
 * @param {total|number} new value of total
 * @api public
 */
Bar.prototype.setTotal= function(total){

    this.total=total;

    return this

};

/**
 * Change the label of the progress bar
 *
 * - `label` Progress bar label
 *
 * @param {label|string}
 * @api public
 */
Bar.prototype.setLabel = function(label){

    this.label=label;

    return this

};

/**
 * Progress bar components
 *
 * - `type` Format type "percent" | "count" | "time" | "tick" | "bar"  
 *
 * @param {type|string} 
 * @api public
 */
Bar.prototype.defaultFormats = function(type){

    let str='';
    if(type=='percent'){
        str+=util.format(
            '%s[%s %%] ',
            this.show.percent.color,
            ('  ' + Math.round(100 * this.counter / (this.total))).slice(-3)
        );
    }else if(type=='count') {
        str += util.format(
            '%s[%s(%s)] ',
            this.show.count.color,
            ('     ' + this.counter).slice(-String(this.total).length),
            this.total
        );
    } else if(type=='time'){
        str+=util.format(
            '%s[%s sec] ',
            this.show.time.color,
            Math.round((new Date().valueOf() - this.timer) / 1000)
        )
    }else if(type=='tick'){
        str+=this.show.tick.color + this.text+'\x1b[0;37m'; // end with white
    }else if(type=='bar' && this.show.overwrite){

        let n_dots= Math.round(this.show.bar.length *(this.counter / this.total));

        let completed='';
        let incompleted='';
        for (let i = 0; i <n_dots; i++) {
            completed += this.show.bar.completed || '.'
        };

        for (let i = 0; i <this.show.bar.length -n_dots; i++) {
            incompleted += this.show.bar.incompleted || ' '
        };

        str+=util.format(
            '%s[%s%s]',
            this.show.bar.color,
            completed,
            incompleted
        );
    }
    return str
}

/**
 * Draw the progress bar
 *
 * @api public
 */
Bar.prototype._draw=function(){

    if(this.draw){
        this.draw(this, _stream);
        return
    }

    // let count='     ' + this.counter + '(' + this.total + ')';
    let info='';


    info+=this.defaultFormats(this.show.active.percent ? 'percent' : '');
    info+=this.defaultFormats(this.show.active.percent ? 'count' : '');
    info+=this.defaultFormats(this.show.active.percent ? 'time' : '');

    info+=this.defaultFormats('tick');

    if (this.show.overwrite) {

        info=util.format('%s%s',
                    this.defaultFormats(this.show.active.bar ? 'bar' : ''),
                    info);

        let progress=util.format(
            '\r%s%s: %s',
            this.show.label.color,
            this.label,
            info
        );

        _stream.write(progress)

    }else  {

        let n = this.show.bar.length | 10;
        let str = '';
        let ticked=false;

        // start bar
        if (this.counter - 1 == 0) {

            str+=util.format(
                '%s%s\n',
                this.show.label.color,
                this.label
            );

        }

        if (this.show.active.bar) {


            // if new line
            if (this.new_line) {
                str += this.show.bar.color + '[';
                this.new_line=false;
            }


            // add tick
             if (this.bar_tick < this.counter / this.show.bar.tick_per_progress) {
                this.bar_tick++;
                str += this.show.bar.completed || '.'
                ticked=true;
            }else{
                ticked=false;
            }

            // if at end of row
            if ((this.bar_tick % this.show.bar.length)==0 && ticked) {
                str +='] ';
                this.new_line=true
            }
        }

        // add info at end of row
        if ((this.bar_tick % this.show.bar.length)==0 && ticked) {

            str+=info+'\n';

        }else if(this.counter == this.total) {

            let space = '';

            if ((this.bar_tick % this.show.bar.length) < this.show.bar.length-1) {

                for (let i = 0; i < this.show.bar.length - 1 - ((this.bar_tick-1) % this.show.bar.length); i++) {
                    space += ' '
                }
            }
            str+='] '+space+info+'\n';
        }

        _stream.write(str)
    }
};



module.exports = (options, draw)=>{return new Bar(options, draw)};