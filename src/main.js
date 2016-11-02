/*
 * @Author: xiongsheng
 * @Date:   2016-08-16 17:23:26
 * @Last Modified by:   xiongsheng
 * @Last Modified time: 2016-11-02 11:58:09
 */

'use strict';
import './bizTransferEs5';
import './jquery.bizui.css';
import './bizTransfer.css';

const data = [
    {
        id: 1,
        title: 'xiongsheng',
        chosen: false
    },{
        id: 2,
        title: 'guoqi',
        chosen: true
    },{
        id: 3,
        title: 'wubo',
        chosen: false
    },{
        id: 4,
        title: 'qianlu',
        chosen: false
    },{
        id: 5,
        title: 'chenzhen',
        chosen: true
    },{
        id: 6,
        title: 'wenchao',
        chosen: false
    }
];
const addItems = [{
        id: 7,
        title: 'guomeiqing',
        chosen: false
    },{
        id: 8,
        title: 'eee',
        chosen: false
    }]
$('#bizComponent').bizTransfer({
    dataSource: data,
    onChange: function () {
        console.log('change');
    },
    titles: ['过去', '未来'],
    // keyMap: {
    //     id: 'groupId',
    //     title: 'groupTitle',
    //     chosen: 'selected'
    // }
    noContent: '木有东西'

});

$('.js-new').click((e) => {
    $('#bizComponent').bizTransfer('addItems', addItems);
});
$('.js-getVal').click((e) => {

    console.log($('#bizComponent').bizTransfer('getValue'));
});

$('.js-select').click((e)=> {
    $('#bizComponent').bizTransfer('select', [6]);
});


