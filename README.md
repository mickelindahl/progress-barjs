Progress barjs
==============

A small library that shows a progress bar in terminal

## Installation

  npm install progress-barjs

## Usage
```js

    const Bar = require('progress-barjs');

    var options = {
        label: 'Progress bar',
        total: 30,
        time:true
        
    };


    var bar = new Bar(options);
    var i=1;
    var timer = setInterval(function () {
        bar.tick('Tick number '+i);
        if (bar.complete) {
            clearInterval(timer);
            done();
        }
        i++;
    }, 100);

```

![](https://github.com/mickelindahl/progress-barjs/blob/master/example.PNG)
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

