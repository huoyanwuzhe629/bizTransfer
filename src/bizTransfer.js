/*
* @Author: xiongsheng
* @Date:   2016-10-24 15:10:54
* @Last Modified by:   xiongsheng
* @Last Modified time: 2016-10-25 19:07:17
*/

'use strict';

const html = `<div class="biz-transfer">
    <div class="biz-transfer-list js-left-list">
        <div class="biz-transfer-list-header">
            <span>请选择人群</span>
        </div>
        <div class="biz-transfer-list-body">
            <ul class="biz-transfer-list-content">
            </ul>
        </div>
    </div>
    <div class="biz-transfer-operation">
        <button ><span>添加</span></button>
        <button ><span>移除</span></button>
    </div>
    <div class="biz-transfer-list js-right-list">
        <div class="biz-transfer-list-header">
            <span>已选择人群</span>
        </div>
        <div class="biz-transfer-list-body">
            <ul class="biz-transfer-list-content">
            </ul>
        </div>
    </div>
</div>`;
const leftSelectPrefix = 'biz-transfer-left-list',
    rightSelectPrefix = 'biz-transfer-right-list';

export default class BizTransfer {
    constructor(transfer, options) {
        this.options = $.extend({}, options || {});
        this.dataSource = this.options.dataSource || [];
        this.$el = $(transfer);
        this.$el.append(html);

        this.$leftListHeader = this.$el.find('.js-left-list .biz-transfer-list-header');
        this.$rightListHeader = this.$el.find('.js-right-list .biz-transfer-list-header');
        this.$leftListBody = this.$el.find('.js-left-list .biz-transfer-list-content');
        this.$rightListBody = this.$el.find('.js-right-list .biz-transfer-list-content');
        this.init();
    }

    init() {
        this.render();
        this.createSelect();
    }

    render() {
        if (this.dataSource.length) {
            this.dataSource.map((value, index)=>{
                this.$leftListBody.append(`<li class="biz-transfer-list-content-item" chosen=${value.chosen}  ><span>${value.title}</span></li>`);
            });
        }
        if (this.getTargets().length) {
            this.getTargets().map((value, index)=>{
                this.$rightListBody.append(`<li class="biz-transfer-list-content-item"><span>${value.title}</span></li>`);
            })
        }
    }

    //获得被选中项的id列表
    getTargets() {
        return this.dataSource.filter(data=>{
            return data.chosen;
        })
    }

    getTargetKeys() {
        return Array.from(this.getTargets.keys());
    }

    /**
     * 创建Checkbox控件
     * @protected
     */
    createSelect() {
        if (this.dataSource.length) {
            this.$leftListHeader.prepend(`<input type="checkbox" title=" " class="js-leftSelectAll"/>`);
            this.$rightListHeader.prepend(`<input type="checkbox" title=" " class="js-rightSelectAll"/>`)
            this.dataSource.map((value, index)=>{
                $(this.$leftListBody.find('li')[index]).prepend(`<input type="checkbox" title=""  key=${value.id} /> `)
            });
            this.getTargets().map((value, index)=>{
                $(this.$rightListBody.find('li')[index]).prepend(`<input type="checkbox" title=""  key=${value.id}/>`)
            });
        }
        this.$el.find(':checkbox').bizCheckbox();
        this.$leftListBody.find('li[chosen=true]').addClass('biz-transfer-disabled');
        this.$leftListBody.find('li[chosen=true]').find(':checkbox').bizCheckbox('disable');
    }

    /**
     * 创建Checkbox控件
     * @protected
     */
    bindSelect() {
        var self = this;
        this.$main.on('click.bizTableSelectAll', '.biz-table-head th .biz-label', function(e) {
            var selected = $(e.target).hasClass('biz-checkbox-checked'),
                checkbox = self.$tableBody.find(':checkbox'),
                tr = self.$tableBody.find('tr[class!="sum"]');
            if (selected) {
                checkbox.bizCheckbox('check');
                tr.addClass('selected');
                if (self.options.onSelect) {
                    self.options.onSelect.call(self, self.options.data, e);
                }
            } else {
                checkbox.bizCheckbox('uncheck');
                tr.removeClass('selected');
                if (self.options.onSelect) {
                    self.options.onSelect.call(self, [], e);
                }
            }
        }).on('click.bizTableSelectOne', '.biz-table-body td .biz-label', function(e) {
            var selected = $(e.target).hasClass('biz-checkbox-checked'),
                selectedCount = self.$tableBody.find('.biz-checkbox-checked').length,
                selectAll = self.$tableHead.find(':checkbox'),
                tr = $(e.target).parent().parent(),
                rowCount = self.options.data.length;
            if (selectedCount === rowCount) {
                selectAll.bizCheckbox('check');
            } else {
                selectAll.bizCheckbox('uncheck');
            }
            if (selected) {
                tr.addClass('selected');
            } else {
                tr.removeClass('selected');
            }
            if (self.options.onSelect) {
                self.options.onSelect.call(self, $.map(self.getSelectedIndex(), function(item, index) {
                    return self.options.data[item];
                }), e);
            }
        });
    }

    /**
     * 获取勾选行序号
     * @return {Array}
     * @protected
     */
    getSelectedIndex() {
        return $.map(this.$tableBody.find('.biz-checkbox-checked'), function(label, index) {
            return parseInt($(label).attr('for').replace(selectPrefix, ''), 10) - 1;
        });
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
