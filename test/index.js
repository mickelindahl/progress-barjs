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

    // lab.test('tick', function (done) {
    //
    //     var options = {
    //         label: 'Progress bar',
    //         total: 30,
    //         time: true,
    //     };
    //
    //     var bar = new Bar(options);
    //     var i = 1;
    //     var timer = setInterval(function () {
    //         bar.tick('Tick number ' + i);
    //         if (bar.complete) {
    //             clearInterval(timer);
    //             done();
    //         }
    //         i++;
    //     }, 100);
    // });

    lab.test('two in a row', function (done) {

        let options = {
            label: 'First progress bar',
            total: 5
        };

        let bar = Bar(options);

        let timer= (options, callback) => {

            let i = 1;

            setInterval(function () {
                bar.tick('Tick number ' + i);
                if (bar.complete) {
                    clearInterval(timer);

                    options.label = 'Second progress bar';
                    bar.reset().total(10);

                    if (callback){callback(options);}

                }
                i++;
            }, 100);
        };
        timer(options, timer)

    });


    // lab.test('file stream', function (done) {
    //
    //     console.log(__dirname+'/test/test.txt')
    //     var options = {
    //         label: 'Progress bar',
    //         total: 21,
    //         time:true,
    //         // stream: Fs.createWriteStream(
    //         //     __dirname+'/test.txt', {
    //         //     flags: 'w+',
    //         //     defaultEncoding: 'ascii'
    //         //     }
    //         // )
    //         draw:'single',
    //     };
    //
    //
    //     var bar = new Bar(options);
    //     var i=1;
    //     var timer = setInterval(function () {
    //         bar.tick('Tick number '+i);
    //         if (bar.complete) {
    //             clearInterval(timer);
    //             done();
    //         }
    //         i++;
    //     }, 100);
    // });

});