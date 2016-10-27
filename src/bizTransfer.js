/*
* @Author: xiongsheng
* @Date:   2016-10-24 15:10:54
* @Last Modified by:   xiongsheng
* @Last Modified time: 2016-10-27 18:05:10
*/

'use strict';

export default class BizTransfer {
    constructor(transfer, options) {
        this.options = $.extend({}, options || {});
        this.dataSource = this.options.dataSource || [];
        this.keyDict = this.options.keyDict || {id: 'id', title: 'title', chosen: 'chosen'};
        this.noContent = this.options.noContent || '请新增选项';

        this.$el = $(transfer);
        this.$el.append(this.getHtml((this.options.titles || ['请选择', '已选择']), (this.options.styles || [])));

        this.$leftListHeader = this.$el.find('.js-left-list .biz-transfer-list-header');
        this.$rightListHeader = this.$el.find('.js-right-list .biz-transfer-list-header');
        this.$leftListBody = this.$el.find('.js-left-list .biz-transfer-list-content');
        this.$rightListBody = this.$el.find('.js-right-list .biz-transfer-list-content');
        this.init();
    }

    getHtml(titles, styles) {
        const leftStyle = styles[0] ?　`width:${styles[0].width};height:${styles[0].height}` : '',
            rightStyle = styles[1] ?　`width:${styles[1].width};height:${styles[1].height}` : ''
        return `<div class="biz-transfer">
            <div class="biz-transfer-list js-left-list" style=${leftStyle}>
                <div class="biz-transfer-list-header js-left-header">
                    <input type="checkbox" title=" " id="leftSelectAll" class="js-leftSelectAll"/>
                    <span>${titles[0]}</span>
                </div>
                <div class="biz-transfer-list-body">
                    <ul class="biz-transfer-list-content">
                    </ul>
                </div>
            </div>
            <div class="biz-transfer-operation">
                <button class="js-add"><span class="icon-right"></span></button>
                <button class="js-remove"><span class="icon-left"></span></button>
            </div>
            <div class="biz-transfer-list js-right-list" style=${rightStyle}>
                <div class="biz-transfer-list-header js-right-header">
                    <input type="checkbox" title=" " id="rightSelectAll" class="js-rightSelectAll"/>
                    <span>${titles[1]}</span>
                </div>
                <div class="biz-transfer-list-body">
                    <ul class="biz-transfer-list-content">
                    </ul>
                </div>
            </div>
        </div>`.trim();
    }

    init() {
        this.render();
        this.initEvents();
        this.$el.find('button').bizButton();
    }

    initEvents() {
        this.bindSelect();
        this.bindButton();
    }

    render() {
        if (this.dataSource.length) {
            this.$leftListBody.html('');
            this.dataSource.map((value, index)=>{
                this.$leftListBody.append(
                    `<li class="biz-transfer-list-content-item" key=${value[this.keyDict.id]} chosen=${value[this.keyDict.chosen]} >
                        <span>${value[this.keyDict.title]}</span>
                    </li>`.trim()
                );
            });
        } else {
            this.$leftListBody.html(`<li class="biz-transfer-list-content-item" style="text-align:center">
                <span>${this.noContent}</span>
            </li>`.trim());
        }
        if (this.getTargets().length) {
            this.$rightListBody.html('');
            this.getTargets().map((value, index)=>{
                this.$rightListBody.append(
                    `<li class="biz-transfer-list-content-item" key=${value[this.keyDict.id]} chosen=${value[this.keyDict.chosen]}>
                        <span>${value[this.keyDict.title]}</span>
                    </li>`.trim()
                );
            })
        }
        this.createSelect();
    }

    addItems(items) {
        if(items.length) {
            this.dataSource.push(...items);
            this.addOption(items, 'left');
        }
    }

    //在dataSource中通过chosen字段获得被选中项列表
    getTargets() {
        return this.dataSource.filter(data=>{
            return data[this.keyDict.chosen];
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
            this.dataSource.map((value, index)=>{
                $(this.$leftListBody.find('li')[index]).prepend(`<input type="checkbox" title="" /> `)
            });
            this.getTargets().map((value, index)=>{
                $(this.$rightListBody.find('li')[index]).prepend(`<input type="checkbox" title=""  />`)
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
            const indexList = this.getSelectedIndex('left'),
                addList = [];
            if (indexList.length > 0) {
                indexList.map((value, index)=>{
                    const $li = $(this.$leftListBody.find('li')[value]);
                    $li.addClass('biz-transfer-disabled')
                        .attr('chosen', true).find(':checkbox')
                        .bizCheckbox('disable').bizCheckbox('uncheck');

                    this.dataSource[value][this.keyDict.chosen] = true;
                    addList.push(this.dataSource[value]);
                });
                this.$el.find('.js-leftSelectAll').bizCheckbox('uncheck');
                this.addOption(addList, 'right');

                if (this.options.onChange) {
                    this.options.onChange();
                }
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
                            return data[this.keyDict.id] == targetKeys[index]
                        }),
                        $leftLi = $(this.$leftListBody.find('li')[leftIndex]);

                    $leftLi.removeClass('biz-transfer-disabled')
                        .attr('chosen', false).find(':checkbox')
                        .bizCheckbox('enable');
                    this.dataSource[leftIndex][this.keyDict.chosen] = false;

                    $rightLi.push(this.$rightListBody.find('li')[value]);
                });

                $($rightLi).remove();
                this.$el.find('.js-rightSelectAll').bizCheckbox('uncheck');

                if (this.options.onChange) {
                    this.options.onChange();
                }
            } else {
                return false;
            }
        });
    }

    addOption(dataList, position) {
        if (dataList.length > 0) {
            const $liList = [];
            dataList.map((value, index)=> {
                const $li = $(
                    `<li class="biz-transfer-list-content-item" key=${value[this.keyDict.id]} chosen=${value[this.keyDict.chosen]} >
                        <input type="checkbox" title="" />
                        <span>${value[this.keyDict.title]}</span>
                    </li>`.trim()
                );
                $liList.push($li[0])
            });
            if (position == 'right') {
                this.$rightListBody.prepend($liList);
            } else {
                this.$leftListBody.append($liList);
            }
            $($liList).find(':checkbox').bizCheckbox();
        }
    }


    /**
     * 获取勾选行序号
     * @return {Array}
     */
    getSelectedIndex(position) {
        const indexList = [];
        if (position == 'left') {
            this.$leftListBody.find('.biz-checkbox-checked').map((index, label)=>{
                indexList.push(Array.from(this.$leftListBody.find('.biz-label')).findIndex(item=>item==label));
            });
        } else {
            this.$rightListBody.find('.biz-checkbox-checked').map((index, label)=>{
                indexList.push(Array.from(this.$rightListBody.find('.biz-label')).findIndex(item=>item==label));
            });
        }
        return indexList;
    }


}


const dataKey = 'bizTransfer';
$.extend($.fn, {
    bizTransfer(method, options) {
        let bizTransfer;
        switch (method) {
            case 'addItems':
                bizTransfer = $(this).data(dataKey);
                if (bizTransfer) {
                    bizTransfer.addItems(options);
                }

            case 'getTargets':
                bizTransfer = $(this).data(dataKey);
                if (bizTransfer) {
                    return bizTransfer.getTargets();
                }

            default:
                if (!$(this).data(dataKey)) {
                    $(this).data(dataKey, new BizTransfer(this, method));
                }
        }
        return this;
    }
});
