/**
 * Created by Mikael Lindahl on 2016-07-19.
 */


/**
 * Options:
 *
 *   - `label` label for bar to show
 *   - `total` total number of ticks to complete
 *   - 'append' If true show accumulated tick text separated with cmoma
 *   - `time` show elapsed time (boolean)
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
    this.time=options.time || false;
    this.timer=undefined;
}


/**
 * "tick" the progress bar with optional `text` shown at tick.
 *
 * @param {text|object} text to show at tick
 * @api public
 */
Bar.prototype.tick = function(text){

    if(this.counter==0  && this.time){

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

    var green_bold = '\x1b[1;33m';
    var magenta_bold = '\x1b[1;35m';
    var cyan_bold = '\x1b[1;36m';
    var bold = '\x1b[1;37m';
    var normal = '\x1b[0;37m';

    process.stdout.write('\r' + bold + this.label + ': ');

    process.stdout.write(cyan_bold + '[' +
        ('  ' + Math.round(100 * this.counter / (this.total))).slice(-3) + ' %] ');

    var str='     ' + this.counter + '(' + this.total + ')';
    process.stdout.write(magenta_bold + '[' +
        (str).slice(str.length-(String(this.total).length*2+2), str.length) + '] ');

    if (this.time) {
        var val=Math.round((new Date().valueOf()-this.timer)/1000);
        process.stdout.write(green_bold + '[' +val + ' sec] ')
    }

    process.stdout.write(normal + this.text);

    if (this.counter == this.total) {
        this.complete=true
        console.log(' '); //insert rowbreak
    };

};


/**
 * "reset" the progress
 *
 * @api public
 */
Bar.prototype.reset= function(){

    this.counter=0;
    this.complete=false;

    return this

};

/**
 * change total ticks of the progress bar.
 *
 * @param {val|number} new value of total
 * @api public
 */
Bar.prototype.setTotal= function(val){

    this.total=val;

    return this

};

/**
 * change the lable of the progress bar.
 *
 * @param {val|string} new value of total
 * @api public
 */
Bar.prototype.setLabel= function(val){

    this.label=val;

    return this

};

module.exports = Bar;