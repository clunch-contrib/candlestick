import Clunch from 'clunch';
import candlestick from '../index';
import image from './test.clunch';
import data from './candlestick.json';

window.clunch = new (Clunch.series('ui-candlestick', candlestick))({
    el: document.getElementById('root'),
    data: function () {
        return {
            data:data
        };
    },
    render: image,
    methods: {
        doit(target) {
            console.log(target);
        }
    }
});
