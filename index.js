/**
 * Created by Mikael Lindahl on 2016-07-19.
 */
'use strict';

/**
 * Options:
 *
 *   - `label` label for bar to show
 *   - `total` total number of ticks to complete
 *   - 'draw' "bar", "percentage" or your own draw function
 *   - 'append' If true show accumulated tick text separated with cmoma
 *   - `show` what to show ['bar', 'percent', 'count','time'] (list)
 *
 *   @param {object} options
 *   @api public
 */

function Bar(options) {
    this.label = options.label || 'Processing';
    this.total = options.total;
    this.draw = options.draw || 'single';
    this.counter = 0;
    this.append = options.append;
    this.complete = false;
    this.show = this.show || {
            overwrite: true,
            label:{
                color:'\x1b[1;37m', // bold
            },
            bar: {
                length: 10,
                color: '\x1b[0;37m', // white
                completed:'=',
                incompleted:'_'
            },
            percent: {
                color: '\x1b[1;36m', //cyan bold
            },
            count: {
                color: '\x1b[1;35m' //magenta bold
            },
            time: {
                color: '\x1b[1;33m' // green bold
            }
        };
    this.timer = undefined;
    this.stream = options.stream || process.stdout;
}

let _colors={
    green_bold:'\x1b[1;33m',
    magenta_bold:'\x1b[1;35m',
    cyan_bold :'\x1b[1;36m',
    bold:'\x1b[1;37m',
    normal:'\x1b[0;37m',
};

/**
 * "tick" the progress bar with optional `text` shown at tick.
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

Bar.prototype._draw=function(){

    let count='     ' + this.counter + '(' + this.total + ')';
    let info='';

    if (this.show.bar) {
        info = _colors.cyan_bold + '[' + ('  ' + Math.round(100 * this.counter / (this.total))).slice(-3) + ' %] ';
    }

    if (this.show.count) {
        info += _colors.magenta_bold + '[' + (count).slice(count.length - (String(this.total).length * 2 + 2), count.length) + '] ';
    }

    if (this.show.time) {
        var val = Math.round((new Date().valueOf() - this.timer) / 1000);
        info+=_colors.green_bold + '[' + val + ' sec] ';
    }

    if (this.show.overwrite) {

        let str='\r'+this.show.label.color + this.label + ': ';

        if (this.show.bar){
            str+=this.show.bar.color +'[';
            let n_dots= Math.round(this.show.bar.length*(this.counter / this.total));

            for (let i = 0; i <n_dots; i++) {
                str += this.show.bar.completed || '.'
            };

            for (let i = 0; i <this.show.bar.length-n_dots; i++) {
                str += this.show.bar.incompleted || ' '
            };

            str+='] ';
        };

        str+=info;

        str+=_colors.normal + this.text;
        // console.log(str)
        this.stream.write(str)

    }

    if ( !this.show.overwrite ) {

        let n = 10;
        let str = '';

        if (this.counter - 1 == 0) {

            str += _colors.bold + this.label + '\n[.';
            this.stream.write(str);
            return
        }

        if (this.show.bar){

            if (this.counter == this.total) {

                let space = '';
                if(this.total>this.show.bar.length)
                for (let i = 0; i < n - 1 - ((this.counter - 1) % n); i++) {
                    space += ' '
                }

                if ((this.counter % n) == 1) {
                    str += _colors.normal + '['
                }
                str += '.]' + space

            } else if (((this.counter - 1) % n) == 0) {

                str += _colors.normal + '[.'

            }
            else if (((this.counter - 1) % n) == n - 1) {

                str += '.]';

            } else {

                str += '.';
            }
        }
        if(this.counter == this.total || (((this.counter - 1) % n) == n - 1)){
            str+=info+'\n'
        }
        this.stream.write(str)

    }
};



module.exports = (options)=> {return new Bar(options)};