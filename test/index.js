/**
 * Created by Mikael Lindahl on 2016-07-19.
 */

'use strict';

const Code = require('code');   // assertion library
const Lab=require('lab');
const Bar = require('../index.js');

var lab = exports.lab = Lab.script();

lab.experiment('bar', function () {

    lab.before({}, function (done) {
        done();
    });

    lab.test('tick', function (done) {

        var options = {
            label: 'Progress bar',
            total: 30,
            time:true,
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
    });

    lab.test('two in a row', function (done) {

        var options = {
            label: 'First progress bar',
            total: 5
        };

        var bar = new Bar(options);
        var i=1;
        var timer = setInterval(function () {
            bar.tick('Tick number '+i);
            if (bar.complete) {
                clearInterval(timer);

                options.label='Second progress bar'

                bar = new Bar(options);
                var j=1;
                timer = setInterval(function () {
                    bar.tick('Tick number '+j);
                    if (bar.complete) {
                        clearInterval(timer);


                        done();
                    }
                    j++;
                }, 100);

            }
            i++;
        }, 100);



    });

});