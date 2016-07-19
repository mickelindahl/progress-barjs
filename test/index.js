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
            total: 10
        };


        var bar = new Bar(options);
        var i=0;
        var timer = setInterval(function () {
            bar.tick('Tick number '+i);
            if (bar.complete) {
                clearInterval(timer);
                done();
            }
            i++;
        }, 100);



    });
});