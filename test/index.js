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
        console.log('');
        let options = {
            info: 'Progress stuff',
            total: 30,
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

    lab.test('tick only completed rows', (done)=>{
        console.log('')
        let options = {
            info: 'Progress stuff',
            total: 30,
            show:{'only_at_completed_rows':true}
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

    lab.test('two in a row with date', (done)=> {
        console.log('\n');

        let options = {
            info: 'Progress stuff',
            total: 40,
            show:{
                overwrite:false,
                bar:{
                    tick_per_progress:4,
                    incompleted:'-'
                },
                active:{date:true}}
        };

        let bar = Bar(options);
        let timer= (options, callback) => {

            let i = 1;

            timer = setInterval(()=>{

                // if (bar.counter>5){return}
                bar.tick('Tick number '+i);
                if (bar.complete) {
                    clearInterval(timer);
                    bar.setInfo('Progress other stuff after reset')
                        .setTotal(9)
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
            // if (bar.counter>30){return}
            bar.tick('Tick number '+i);
            if (bar.complete) {
                clearInterval(timer);
                done();
            }
            i++;
        }, 100);
    });

    lab.test('Without overwrite only at completed rows', (done)=> {
        console.log('\n');

        let options = {
            info: 'Without overwrite only at completed rows',
            total: 36,

            show:{
                active:{
                    date:true,
                    percent:false,
                    count:false,
                    time:false
                },
                overwrite:false,
                only_at_completed_rows:true,
                bar:{
                    color:'\x1b[0;31m',
                    completed:'.',
                    tick_per_progress:2,
                    length:6
                },
                label:{color:'\x1b[1;37m'},
                info:{color:'\x1b[0;36m'},
                tick:{color:'\x1b[0;34m'}
            }
        };

        let bar = Bar(options);
        let i=1;
        let timer = setInterval(()=>{
            // if (bar.counter>30){return}
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
            // if (bar.counter>20){return}
            bar.tick('Tick number '+i);
            if (bar.complete) {
                clearInterval(timer);
                done();
            }
            i++;
        }, 100);
    });

    lab.test('test JSON.stringify', (done)=> {
        let bar = Bar();
        bar=JSON.stringify(bar);
        Code.expect(bar).to.be.a.string()
        done()

    });

    lab.test('setLabel', (done)=>{
        console.log('')
        let options = {
            info: 'Progress stuff',
            total: 30,
        };

        let bar = Bar(options);
        bar.setLabel('BAAAR');
        Code.expect(bar.label=='BAAAR')
        done()

    });

});