Progress barjs
==============
[![Build Status](https://travis-ci.org/mickelindahl/progress-barjs.svg?branch=master)](https://travis-ci.org/mickelindahl/progress-barjs)
[![Coverage Status](https://coveralls.io/repos/github/mickelindahl/progress-barjs/badge.svg?branch=master)](https://coveralls.io/github/mickelindahl/progress-barjs?branch=master)

A small library that shows a progress bar 

## Installation

  npm install progress-barjs

## Usage
```js
let options = {
    info: 'Progress stuff',
    total: 30,
};

let bar = Bar(options);
let i = 1;
let timer = setInterval(()=>{

    bar.tick('Tick number ' + i);
    if (bar.complete) {clearInterval(timer);}
    i++;
}, 100);
```
![](https://raw.githubusercontent.com/mickelindahl/progress-barjs/master/screenshots/example.PNG)
## API
### `Bar([options][,draw])`

- `options` Object with the following keys:
    - `label` Progress bar label
    - `info` Specific info about type of data being progressed
    - `total` Total number of ticks to complete
    - `append` If true show accumulated tick text separated with comma
    - `show` Show configuration object with the following keys:
       - `active` Which bars items to show
           - `date` true|false
           - `bar` true|false
           - `percent` true|false
           - `count` true|false
           - `time` true|false
       - `overwrite` If bar should do line overwrite true|false
       - `only_at_completed_rows` If bar ony should be written when a row have completed. Good option
          when each print out generates a new row when bar is written to a file stream (e.g. logfile).
       - `date` Include date before label
           - `color` ANSI color as string
       - `label` Object with the following keys:
           - `color` ANSI color as string
       - `bar` Object with the following keys:
           - `color` ANSI color
           - `length` bar length
           - `completed` character to show fro complete bar tick
           - `incompleted` character to show fro incompleted bar
           - `tick_per_progress` number of tick one progress step represents (only applicable with overwrite=false)
       - `percent` Object with the following keys:
           - `color` ANSI color
       - `count` Object with the following keys:
           - `color` ANSI color
       - `time` Object with the following keys:
           - `color` ANSI color
       - `tick` Object with the following keys:
           - `color` ANSI color
       - `stream` Stream to write to (process.stdout default)
 - `draw` Custom draw function `(bar, stream)=>{ The magic ... )`

### `bar.tick([text])`
Increment the bar with one
- `text` Text shown at tick.

### `bar.reset()`
Reset the progress bar

### `bar.setTotal(total)`
Change total ticks of the progress bar
- `total` Total number of ticks

### `bar.setLabel(label)`
Change the label of the progress bar
- `label` Progress bar label

### `bar.setInfo(info)`
Change the info of the progress bar
- `info` Progress bar info


### `bar.defaultFormat(type)`
Progress bar components
- `type` Format type "percent" | "count" | "time" | "tick" | "bar"  | "date" | "info"

### Examples
Two in a row:
```js
let options = {
    info: 'Progress stuff',
    total: 5,
    show:{
        active:{date:true}}
};

let bar = Bar(options);
let timer= (options, callback) => {

    let i = 1;
    timer = setInterval(()=>{

        bar.tick('Tick number '+i);
        if (bar.complete) {
            clearInterval(timer);
            bar.setInfo('Progress other stuff after reset')
                .setTotal(9)
                .reset();
        }
        i++;
    }, 100);
};
timer(options, timer)
```
![](https://raw.githubusercontent.com/mickelindahl/progress-barjs/master/screenshots/example1.PNG)

Without overwrite and change of color:
```js
let options = {
    info: 'Without overwrite',
    total: 36,
    show:{
        active:{date:true},
        overwrite:false,
        bar:{
            color:'\x1b[0;31m',
            completed:'.',
            tick_per_progress:2,
            length:6
        },
        percent:{color:'\x1b[1;37m'},
        count:{color:'\x1b[0;36m'},
        time:{color:'\x1b[0;34m'}
    }
};

let bar = Bar(options);
let i=1;
let timer = setInterval(()=>{

    bar.tick('Tick number '+i);
    if (bar.complete) { clearInterval(timer);}
    i++;
}, 100);
```
![](https://raw.githubusercontent.com/mickelindahl/progress-barjs/master/screenshots/example2.PNG)

With custom draw function:
```js
let options = {
    label: 'Assume progress bar',
    total: 33,
    show: {
        bar: {
            completed: '\x1b[47m \x1b[0;37m',
            incompleted: ' ',
        }
    }
};

let draw=(bar, stream)=>{

    let str=util.format(
        '\r%s%s | %s | %s%s miliseconds%s ',
        '\x1b[0;34m',
        bar.label,
        bar.defaultFormats('bar'), // pull in default progress bar
        bar.show.time.color,
        Math.round((new Date().valueOf() - bar.timer)),
        '\x1b[0;37m' // end with white
    );

    stream.write(str); //show
};

let bar = Bar(options, draw);
let i=1;
let timer = setInterval(()=>{

    bar.tick('Tick number '+i);
    if (bar.complete) {clearInterval(timer);}
    i++;
}, 100);
timer(options, timer)
```
![](https://raw.githubusercontent.com/mickelindahl/progress-barjs/master/screenshots/example3.PNG)
## Tests

  Lab.cmd

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code.

## Release History

* 0.1.0 Initial release
* 0.1.1 fixed username
* 0.1.2 previous bars not overwritten
* 0.1.3 option to show elapsed time
* 0.1.4 fixed screenshot link
* 0.2.0 added setTotal, setLabel and reset methods and removed count print extra space
* 1.0.0 Bar is now created without new, bar progress, new type of bar without overwrite, improved control of bar appearance (color, show/hide information)  
* 1.0.1 Small fix
* 1.0.2 Without overwrite bug fix
* 1.1.0 Added custom draw function, tick_per_progress to `option.show.bar` for bar without overwrite and deafaultFormat function
* 1.1.1 Changed package.json
* 1.1.2 travis + coveralls
* 1.1.3 Example fix
* 1.1.4 Example fix again
* 2.0.0 Change api for draw function, bug fix, circular dependencies when stringify a bar
* 2.0.1 Bug fix
* 2.0.2 Bug fix
* 2.0.3 Bug fix
* 2.1.0 Added function `bar.setInfo(info)`, added options to show date, introduced info field and bug fixes
* 2.1.1 Bug fix