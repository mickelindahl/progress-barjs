/**
 * Created by Mikael Lindahl on 2016-07-19.
 */

'use strict';

const Code = require('code');   // assertion library
const Lab=require('lab');
const Fs = require('fs');
const Bar = require('../index.js');

let lab = exports.lab = Lab.script();

lab.experiment('bar', ()=>{

    lab.before({}, (done)=>{
        done();
    });

    lab.test('tick', (done)=>{
        console.log('')
        let options = {
            label: 'Progress bar',
            total: 30,
            time: true,
        };

        let bar = Bar(options);
        let i = 1;
        let timer = setInterval(()=>{
            // if (bar.counter>24){return}
            bar.tick('Tick number ' + i);
            if (bar.complete) {
                clearInterval(timer);
                done();
            }
            i++;
        }, 100);
    });

    lab.test('two in a row', (done)=> {
        console.log('\n');

        let options = {
            label: 'Progress bar',
            total: 5
        };

        let bar = Bar(options);
        let timer= (options, callback) => {

            let i = 1;

            timer = setInterval(()=>{

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

    lab.test('Without overwrite', (done)=> {
        console.log('\n');

        let options = {
            label: 'Progress bar without overwrite',
            total: 33,

            show:{
                overwrite:false,
                bar:{
                    color:'\x1b[0;31m',
                    completed:'.',
                    tick_per_progress:2
                },
                percent:{color:'\x1b[1;37m'},
                count:{color:'\x1b[0;36m'},
                time:{color:'\x1b[0;34m'}
            }
        };

        let bar = Bar(options);
        let i=1;
        let timer = setInterval(()=>{
            // if (bar.counter>25){return}
            bar.tick('Tick number '+i);
            if (bar.complete) {
                clearInterval(timer);
                done();
            }
            i++;
        }, 100);
    });



    lab.test('Custom draw function', (done)=> {
        console.log('\n');
        let util=require('util');
        let options = {
            label: 'Assume progress bar',
            total: 33
        };

        let draw=(bar)=>{

            let str=util.format(
                '\r%s%s | %s | %s%s miliseconds%s ',
                '\x1b[0;34m',
                bar.label,
                bar.defaultFormats('bar'), // pull in default progress bar
                bar.show.time.color,
                Math.round((new Date().valueOf() - bar.timer)),
                '\x1b[0;37m' // end with white
            );

            bar.stream.write(str); //show
        };

        let bar = Bar(options, draw);
        let i=1;
        let timer = setInterval(()=>{
            // if (bar.counter>20){return}
            bar.tick('Tick number '+i);
            if (bar.complete) {
                clearInterval(timer);
                done();
            }
            i++;
        }, 100);
    });
});