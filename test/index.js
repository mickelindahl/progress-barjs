/**
 * Created by Mikael Lindahl on 2016-07-19.
 */

'use strict';

const Code = require('code');   // assertion library
const Lab=require('lab');
const Fs = require('fs');
const Bar = require('../index.js');

var lab = exports.lab = Lab.script();

lab.experiment('bar', function () {

    lab.before({}, function (done) {
        done();
    });

    lab.test('tick', function (done) {
        console.log('')
        var options = {
            label: 'Progress bar',
            total: 30,
            time: true,
        };

        var bar = Bar(options);
        var i = 1;
        var timer = setInterval(function () {
            if (bar.counter>24){return}
            bar.tick('Tick number ' + i);
            if (bar.complete) {
                clearInterval(timer);
                done();
            }
            i++;
        }, 100);
    });

    lab.test('two in a row', function (done) {
        console.log('\n');

        var options = {
            label: 'Progress bar',
            total: 5
        };

        let bar = Bar(options);
        let timer= (options, callback) => {

            let i = 1;

            timer = setInterval(function () {

                // if (bar.counter>7){return}
                bar.tick('Tick number '+i);
                if (bar.complete) {
                    clearInterval(timer);
                    bar.setLabel('Progress bar after reset')
                        .setTotal(10)
                        .reset();
                    if (callback){callback(options,()=>{done()});}
                }
                i++;
            }, 100);
        };
        timer(options, timer)

        console.log('\n');
    });

    lab.test('Without overwrite', function (done) {
        console.log('\n');

        var options = {
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

        var bar = Bar(options);
        var i=1;
        var timer = setInterval(function () {
            // if (bar.counter>25){return}
            bar.tick('Tick number '+i);
            if (bar.complete) {
                clearInterval(timer);
                done();
            }
            i++;
        }, 100);
    });

});