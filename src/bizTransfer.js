/*
* @Author: xiongsheng
* @Date:   2016-10-24 15:10:54
* @Last Modified by:   xiongsheng
* @Last Modified time: 2016-10-26 17:14:32
*/

'use strict';

const html = `<div class="biz-transfer">
    <div class="biz-transfer-list js-left-list">
        <div class="biz-transfer-list-header js-left-header">
            <span>请选择人群</span>
        </div>
        <div class="biz-transfer-list-body">
            <ul class="biz-transfer-list-content">
            </ul>
        </div>
    </div>
    <div class="biz-transfer-operation">
        <button class="js-add"><span>添加</span></button>
        <button class="js-remove"><span>移除</span></button>
    </div>
    <div class="biz-transfer-list js-right-list">
        <div class="biz-transfer-list-header js-right-header">
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
        this.initEvents();
    }

    initEvents() {
        this.bindSelect();
        this.bindButton();
    }

    render() {
        if (this.dataSource.length) {
            this.$leftListBody.html('');
            this.dataSource.map((value, index)=>{
                this.$leftListBody.append(`<li class="biz-transfer-list-content-item" key=${value.id} chosen=${value.chosen}  ><span>${value.title}</span></li>`);
            });
        }
        if (this.getTargets().length) {
            this.$rightListBody.html('');
            this.getTargets().map((value, index)=>{
                this.$rightListBody.append(`<li class="biz-transfer-list-content-item" key=${value.id} ><span>${value.title}</span></li>`);
            })
        }
    }

    //在dataSource中通过chosen字段获得被选中项的id列表
    getTargets() {
        return this.dataSource.filter(data=>{
            return data.chosen;
        })
    }

    //通过右边框的li中的key值得到右边框中各项的id值
    getTargetKeys() {
        const $li = this.$rightListBody.find('li'),
            targetKeys = [];

        this.getSelectedIndex('right').map((value, index)=> {
            targetKeys.push($($li[value]).attr('key'));
        });

        return targetKeys;
    }

    /**
     * 创建Checkbox控件
     * @protected
     */
    createSelect() {
        if (this.dataSource.length) {
            this.$leftListHeader.prepend(`<input type="checkbox" title=" " id="leftSelectAll" class="js-leftSelectAll"/>`);
            this.$rightListHeader.prepend(`<input type="checkbox" title=" " id="rightSelectAll" class="js-rightSelectAll"/>`)
            this.dataSource.map((value, index)=>{
                $(this.$leftListBody.find('li')[index]).prepend(`<input type="checkbox" title=""   id=${leftSelectPrefix + index} /> `)
            });
            this.getTargets().map((value, index)=>{
                $(this.$rightListBody.find('li')[index]).prepend(`<input type="checkbox" title="" id=${rightSelectPrefix + index}  />`)
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
        this.$el.on('click', '.js-left-header .biz-label', (e)=>{
            const selected = $(e.target).hasClass('biz-checkbox-checked'),
                $checkbox = this.$leftListBody.find('li[chosen=false]').find(':checkbox');

            if (selected) {
                $checkbox.bizCheckbox('check');
            } else {
                $checkbox.bizCheckbox('uncheck');
            }
        }).on('click', '.js-right-header .biz-label', (e)=>{
            const selected = $(e.target).hasClass('biz-checkbox-checked'),
                $checkbox = this.$rightListBody.find(':checkbox');

            if (selected) {
                $checkbox.bizCheckbox('check');
            } else {
                $checkbox.bizCheckbox('uncheck');
            }
        });
    }

    //button点击事件
    bindButton() {
        //添加
        this.$el.on('click', '.js-add', (e)=>{
            const indexList = this.getSelectedIndex('left');
            if (indexList.length > 0) {
                indexList.map((value, index)=>{
                    const $li = $(this.$leftListBody.find('li')[value]);
                    $li.addClass('biz-transfer-disabled')
                        .attr('chosen', true).find(':checkbox')
                        .bizCheckbox('disable').bizCheckbox('uncheck');

                    this.dataSource[value].chosen = true;
                    this.addOption(this.dataSource[value]);
                });
                this.$el.find('.js-leftSelectAll').bizCheckbox('uncheck');
            } else {
                return false;
            }
        });

        //移除
        this.$el.on('click', '.js-remove', (e)=>{
            const indexList = this.getSelectedIndex('right'),
                targetKeys = this.getTargetKeys(),
                $rightLi = [];
            if (indexList.length > 0) {
                indexList.map((value, index)=>{
                    const leftIndex = this.dataSource.findIndex(data=>{
                            return data.id == targetKeys[index]
                        }),
                        $leftLi = $(this.$leftListBody.find('li')[leftIndex]);

                    $leftLi.removeClass('biz-transfer-disabled')
                        .attr('chosen', false).find(':checkbox')
                        .bizCheckbox('enable');
                    this.dataSource[leftIndex].chosen = false;

                    $rightLi.push(this.$rightListBody.find('li')[value]);
                });

                $($rightLi).remove();
                this.$el.find('.js-rightSelectAll').bizCheckbox('uncheck');
            } else {
                return false;
            }
        });
    }

    addOption(data) {
        const $li = $(`<li class="biz-transfer-list-content-item" key=${data.id}>
            <input type="checkbox" title="" id=${rightSelectPrefix + (this.getTargets().length-1)}  />
            <span>${data.title}</span>
        </li>`);
        this.$rightListBody.prepend($li);
        $li.find(':checkbox').bizCheckbox();
    }

    removeOption(data) {

    }

    /**
     * 获取勾选行序号
     * @return {Array}
     */
    getSelectedIndex(position) {
        const indexList = [];
        if (position == 'left') {
            this.$leftListBody.find('.biz-checkbox-checked').map((index, label)=>{
                indexList.push(parseInt($(label).attr('for').replace(leftSelectPrefix, ''), 10));
            });
        } else {
            this.$rightListBody.find('.biz-checkbox-checked').map((index, label)=>{
                indexList.push(parseInt($(label).attr('for').replace(rightSelectPrefix, ''), 10));
            });
        }
        return indexList;
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
