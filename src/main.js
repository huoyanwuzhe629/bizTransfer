/*
 * @Author: xiongsheng
 * @Date:   2016-08-16 17:23:26
 * @Last Modified by:   xiongsheng
 * @Last Modified time: 2016-10-25 18:06:37
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
    },
];
$('#bizComponent').bizTransfer({
    dataSource: data
});
