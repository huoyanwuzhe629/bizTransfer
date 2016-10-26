/*
 * @Author: xiongsheng
 * @Date:   2016-08-16 17:23:26
 * @Last Modified by:   xiongsheng
 * @Last Modified time: 2016-10-26 14:40:39
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
$('#bizComponent').bizTransfer({
    dataSource: data
});
