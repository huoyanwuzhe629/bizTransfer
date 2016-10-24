/*
* @Author: xiongsheng
* @Date:   2016-10-24 15:10:54
* @Last Modified by:   xiongsheng
* @Last Modified time: 2016-10-24 17:10:05
*/

'use strict';

export default class BizTransfer {
    constructor(transfer, options) {
        this.options = $.extend({}, options || {});
        this.$el = $(transfer);
        this.init();
    }

    init() {
        const html = `<div class="selectbox">
            <div class="select-bar">
                <select multiple="multiple" id="select1">
                    <option value="超级管理员">超级管理员</option>
                    <option value="信息发布员">信息发布员</option>
                    <option value="财务管理员">财务管理员</option>
                </select>
            </div>

            <div class="btn-bar">
                <p><span id="add"><input type="button" class="btn" value=">" title="移动选择项到右侧"></span></p>
                <p><span id="add_all"><input type="button" class="btn" value=">>" title="全部移到右侧"></span></p>
                <p><span id="remove"><input type="button" class="btn" value="<" title="移动选择项到左侧"></span></p>
                <p><span id="remove_all"><input type="button" class="btn" value="<<" title="全部移到左侧"></span></p>
            </div>
            <div class="select-bar">
                <select multiple="multiple" id="select2"><option value="系统管理员">系统管理员</option><option value="普通管理员">普通管理员</option></select>
            </div>
        </div>`;

        this.$el.append(html);

    }


}


const dataKey = 'bizTransfer';
$.extend($.fn, {
    bizTransfer(method, options) {
        switch (method) {
            default:
                if (!$(this).data(dataKey)) {
                    $(this).data(dataKey, new BizTransfer(this, method));
                }
        }
        return this;
    }
});
