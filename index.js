/**
 * Created by Mikael Lindahl on 2016-07-19.
 */
'use strict';

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
 *      - `percent` Object with the following keys:
 *          - `color` ANSI color
 *      - `count` Object with the following keys:
 *          - `color` ANSI color
 *      - `time` Object with the following keys:
 *          - `color` ANSI color
 *      - `tick` Object with the following keys:
 *          - `color` ANSI color
 *      - `stream` Stream to write to (process.stdout default)
 *
 *   @param {object} options
 *   @api public
 */

function Bar(options) {
    this.label = options.label || 'Processing';
    this.total = options.total;
    this.counter = 0;
    this.append = options.append;
    this.complete = false;
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
            scale:1
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
    this.stream = options.stream || process.stdout;

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
 * @param {label|string} new value of total
 * @api public
 */
Bar.prototype.setLabel= function(label){

    this.label=label;

    return this

};


/**
 * Draw the progress bar
 *
 * @api public
 */
Bar.prototype._draw=function(){

    let count='     ' + this.counter + '(' + this.total + ')';
    let info='';

    if (this.show.active.percent) {
        info = this.show.percent.color + '[' + ('  ' + Math.round(100 * this.counter / (this.total))).slice(-3) + ' %] ';
    }

    if (this.show.active.count) {
        info += this.show.count.color + '[' + (count).slice(count.length - (String(this.total).length * 2 + 2), count.length) + '] ';
    }

    if (this.show.active.time) {
        var val = Math.round((new Date().valueOf() - this.timer) / 1000);
        info+=this.show.time.color + '[' + val + ' sec] ';
    }
    info+=this.show.tick.color + this.text+'\x1b[0;37m';

    if (this.show.overwrite) {

        let str='\r'+this.show.label.color + this.label + ': ';

        if (this.show.active.bar){
            str+=this.show.bar.color +'[';
            let n_dots= Math.round(this.show.bar.length *(this.counter / this.total));

            for (let i = 0; i <n_dots; i++) {
                str += this.show.bar.completed || '.'
            };

            for (let i = 0; i <this.show.bar.length -n_dots; i++) {
                str += this.show.bar.incompleted || ' '
            };

            str+='] ';
        };


        str+=info;

        this.stream.write(str)

    }

    if ( !this.show.overwrite ) {

        let n = this.show.bar.length || 10;
        let str = '';

        if (this.counter - 1 == 0) {

            str += this.show.label.color + this.label + '\n'+this.show.bar.color +'['+(this.show.bar.completed || '.');
            this.stream.write(str);
            return
        }


        if (this.show.active.bar){

            if (this.counter == this.total) {

                let space = '';
                if(this.total>this.show.bar.length)
                    for (let i = 0; i < n - 1 - ((this.counter - 1) % n); i++) {
                        space += ' '
                    }

                if ((this.counter % n) == 1) {
                    str += this.show.bar.color + '['
                }
                str += (this.show.bar.completed || '.')+'] ' + space

            } else if (((this.counter - 1) % n) == 0) {

                str += this.show.bar.color  + '['+(this.show.bar.completed || '.')

            }
            else if (((this.counter - 1) % n) == n - 1) {

                str += (this.show.bar.completed || '.')+'] ';

            } else {

                str += (this.show.bar.completed || '.');
            }

        }
        if(this.counter == this.total || (((this.counter - 1) % n) == n - 1)){
            str+=info+'\n'
        }
        this.stream.write(str)

    }
};



module.exports = (options)=>{return new Bar(options)};