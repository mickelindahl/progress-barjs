/**
 * Created by Mikael Lindahl on 2016-07-19.
 */


/**
 * Options:
 *
 *   - `label` label for bar to show
 *   - `total` total number of ticks to complete
 *   - 'append' If true show accumulated tick text separated with cmoma
 *   - `stream` the output stream defaulting to stderr
 *   - `complete` completion character defaulting to "="
 *   - `incomplete` incomplete character defaulting to "-"
 *   - `renderThrottle` minimum time between updates in milliseconds defaulting to 16
 *   - `callback` optional function to call when the progress bar completes
 *   - `clear` will clear the progress bar upon termination
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
}


/**
 * "tick" the progress bar with optional `text` shown at tick.
 *
 * @param {text|object} text to show at tick
 * @api public
 */
Bar.prototype.tick = function (text) {
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

    //var green_bold = '\x1b[1;33m';
    var magenta_bold = '\x1b[1;35m';
    var cyan_bold = '\x1b[1;36m';
    var bold = '\x1b[1;37m';
    var normal = '\x1b[0;37m';

    process.stdout.write('\r' + bold + this.label + ': ');
    process.stdout.write(cyan_bold + '[' +
        ('  ' + Math.round(100 * this.counter / (this.total))).slice(-3) + ' %] ');
    process.stdout.write(magenta_bold + '[' +
        ('   ' + this.counter + '(' + this.total + ')').slice(-String(this.total).length * 4) + '] ')

    process.stdout.write(normal + this.text);

    if (this.counter == this.total) {
        this.complete=true
    };
};


module.exports = Bar;