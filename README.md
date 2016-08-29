Progress barjs
==============

A small library that shows a progress bar 

## Installation

  npm install progress-barjs

## Usage
```js
const Bar = require('progress-barjs');
let options = {
    label: 'Progress bar',
    total: 30,
    time:true
};

let bar = Bar(options);
let i=1;
let timer = setInterval(()=>{

    bar.tick('Tick number '+i);
    if (bar.complete){clearInterval(timer);}
    i++;
}, 100);
```
![](https://raw.githubusercontent.com/mickelindahl/progress-barjs/master/screenshots/example.PNG)
## API
### `Bar([options])`

- `options` Object with the following keys:
    - `label` Process bar label
    - `total` Total number of ticks to complete
    - `append` If true show accumulated tick text separated with comma
    - `show` Show configuration object with the following keys:
       - `active` Which bars items to show
           - `bar` true|false
           - `percent` true|false
           - `count` true|false
           - `time` true|false
       - `overwrite` If bar should do line overwrite true|false
       - `label` Object with the following keys:
           - `color` ANSI color as string
       - `bar` Object with the following keys:
           - `color` ANSI color
           - `length` bar length
           - `completed` character to show fro complete bar tick
           - `incompleted` character to show fro incompleted bar
       - `percent` Object with the following keys:
           - `color` ANSI color
       - `count` Object with the following keys:
           - `color` ANSI color
       - `time` Object with the following keys:
           - `color` ANSI color
       - `tick` Object with the following keys:
           - `color` ANSI color
       - `stream` Stream to write to (process.stdout default)
       
### `bar.tick([text])`
Increment the bar with one
- `text` shown at tick.

### `bar.reset()`
Reset the progress bar

### `bar.setTotal(total)`
Change total ticks of the progress bar
- `total` Total number of ticks

### `bar.setLabel(label)`
Change the label of the progress bar
- `label` Progress bar label

### Examples
Two in a row:
```js
let options = {
    label: 'Progress bar',
    total: 5
};

let bar = Bar(options);
let timer= (options, callback) => {

    let i = 1;

    timer = setInterval(()=>{
    
        bar.tick('Tick number '+i);
        if (bar.complete) {
            clearInterval(timer);
            bar.setLabel('Progress bar after reset')
                .setTotal(10)
                .reset();
            if (callback){callback(options);}
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
    label: 'Progress bar without overwrite',
    total: 33,
    show:{
        overwrite:false,
        bar:{
            color:'\x1b[0;31m',
            completed:'.'},
        percent:{color:'\x1b[1;37m'},
        count:{color:'\x1b[0;36m'},
        time:{color:'\x1b[0;34m'}
    }
};

let bar = Bar(options);
let i=1;
let timer = setInterval(()=>{

    bar.tick('Tick number '+i);
    if (bar.complete) {
        clearInterval(timer);
    }
    i++;
}, 100);
timer(options, timer)
```
![](https://raw.githubusercontent.com/mickelindahl/progress-barjs/master/screenshots/example2.PNG)
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