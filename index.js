/**
 * Created by Mikael Lindahl on 2016-07-19.
 */
'use strict';

const util=require('util');
let _stream;

/**
 * - `options` Object with the following keys:
 *   - `label` Progress bar label
 *   - `info` Specific info about type of data being progressed
 *   - `total` Total number of ticks to complete
 *   - `append` If true show accumulated tick text separated with comma
 *   - `show` Show configuration object with the following keys:
 *      - `date` Include date before label
 *      - `active` Which bar items to show
 *          - `date` true|false
 *          - `bar` true|false
 *          - `percent` true|false
 *          - `count` true|false
 *          - `time` true|false
 *      - `overwrite` If bar should do line overwrite true|false
 *      - `only_at_completed_rows` If bar ony should be written when a row have completed. Good option
 *         when each print out generates a new row when bar is written to a file stream (e.g. logfile).
 *      - `date` Include date before label
 *          - `color` ANSI color as string
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
 * - `draw` Custom draw function `(bar, stream)=>{ The magic ... )`
 *
 *   @param {object} options
 *   @api public
 */

function Bar(options, draw) {

    options=options || {};
    _stream = options.stream || process.stdout; //set stream, avoid set it on object to avoid circular dependencies

    this.draw=draw;

    this.label = options.label || ' BAR';
    this.info = options.info || '';
    this.total = options.total;
    this.counter = 0;
    this.bar_tick=0;
    this.sub_tick=1;
    this.append = options.append;
    this.complete = false;
    this.new_line=true;
    this.date=undefined;
    this.row='';

    this.show = {
        active: {
            date:false,
            bar:true,
            percent:true,
            count:true,
            time:true
        },
        overwrite: true,
        only_at_completed_rows:false,
        date : {
            color: '\x1b[0;37m', // white
        },
        label:{
            color: '\x1b[1;36m', // bold
        },
        info:{
            color: '\x1b[0;37m', // bold
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
        if (this.show.active.date){this.date=new Date().toJSON()}
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
 *  Increment the bar with variable amount
 *
 * - `chunk` chunk to tick.
 * - `text` shown at tick.
 *
 * @param {text|object} text to show at tick
 * @api public
 */
Bar.prototype.tickChunk = function (chunk, text) {

    text=text ? text : '';

    for (let i = 0; i<chunk; i++){
        this.tick(text);
    }
};

/**
 * Reset the progress bar
 *
 * @api public
 */
Bar.prototype.reset= function(){

    this.counter=0;
    this.bar_tick=0;
    this.complete=false;
    this.new_line=true;

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
 * Change info of the progress bar
 *
 * - `info` Progress bar info
 *
 * @param {info|string}
 * @api public
 */
Bar.prototype.setInfo = function(info){

    this.info=info;

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
            '%s[%s%s] ',
            this.show.bar.color,
            completed,
            incompleted
        );
    }else if(type=='date'){
        str+=this.show.date.color+'['+this.date+'] '
    }else if(type=='info'){
        str+=this.show.info.color+': '+this.info+' '
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
            '%s%s%s%s',
            this.show.label.color,
            this.label,
            this.defaultFormats(this.show.info ? 'info' : ''),
            info
        );

        if (this.show.active.date){
            progress=this.defaultFormats(this.show.active.date ? 'date' : '')+progress;
        }

        progress='\r'+progress;

        if (this.show.only_at_completed_rows && this.counter!=this.total){
            return
        }

        _stream.write(progress)

    }else  {

        let n = this.show.bar.length | 10;
        let str = '';


        //tick
        if (this.bar_tick < this.counter / this.show.bar.tick_per_progress) {
            this.sub_tick=1;
        }else{
            this.sub_tick++;
        }

        if (this.show.active.bar) {

            // if new line
            if (this.new_line) {
                str+=util.format(
                    '%s%s%s',
                    this.show.label.color,
                    this.label,
                    this.defaultFormats(this.show.info ? 'info' : '')
                );

                if (this.show.active.date){
                    str=this.show.date.color+'['+this.date+'] '+str;
                }

                str += this.show.bar.color + '[';
                this.new_line=false;
            }

            // add tick
             if (this.bar_tick < this.counter / this.show.bar.tick_per_progress) {
                this.bar_tick++;
                str += this.show.bar.completed || '.'
             }

            // if at end of row
            if ((this.bar_tick % this.show.bar.length)==0 && this.sub_tick==1) {
                str +='] ';

            }
        }


        // console.log(ticked)

        // add info at end of row
        if ((this.bar_tick % this.show.bar.length)==0 && this.sub_tick==this.show.bar.tick_per_progress) {

            str+=info+'\n';
            this.new_line=true

        }else if(this.counter == this.total) {

            let space = '';
            if (((this.bar_tick % this.show.bar.length) <= this.show.bar.length-1) && this.bar_tick>this.show.bar.length){

                for (let i = 0; i < this.show.bar.length - 1 - ((this.bar_tick-1) % this.show.bar.length); i++) {
                    space += ' '
                }
            }
            str+='] '+space+info;
        }

        if (this.show.only_at_completed_rows && !this.new_line){
            this.row+=str;
            // console.log('hej')
            return
        }else if (this.show.only_at_completed_rows ){
            str=this.row+str+'\n';
            this.row=''
        }

        _stream.write(str)
    }
};



module.exports = (options, draw)=>{return new Bar(options, draw)};