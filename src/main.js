/*
 * @Author: xiongsheng
 * @Date:   2016-08-16 17:23:26
 * @Last Modified by:   xiongsheng
 * @Last Modified time: 2016-10-27 17:04:12
 */

'use strict';
import './bizTransfer';
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
        title: 'ccccc',
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
    // keyDict: {
    //     id: 'groupId',
    //     title: 'groupTitle',
    //     chosen: 'selected'
    // }
    noContent: '木有东西'

});

// $('#bizComponent').bizTransfer('addItems', addItems);
console.log($('#bizComponent').bizTransfer('getTargets'))

