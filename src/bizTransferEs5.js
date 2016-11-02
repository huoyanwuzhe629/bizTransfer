/*
* @Author: xiongsheng
* @Date:   2016-11-01 14:37:49
* @Last Modified by:   xiongsheng
* @Last Modified time: 2016-11-02 10:38:03
*/

'use strict';

function BizTransfer (transfer, options) {
    this.options = $.extend({}, options || {});
    this.keyMap = this.options.keyMap || {id: 'id', title: 'title', chosen: 'chosen'};
    this.dataSource = this.formatInput(this.options.dataSource);
    this.noContent = this.options.noContent || '请新增选项';

    this.$el = $(transfer);
    this.$el.append(this.getHtml((this.options.titles || ['请选择', '已选择']), (this.options.styles || [])));

    this.$leftListHeader = this.$el.find('.js-left-list .biz-transfer-list-header');
    this.$rightListHeader = this.$el.find('.js-right-list .biz-transfer-list-header');
    this.$leftListBody = this.$el.find('.js-left-list .biz-transfer-list-content');
    this.$rightListBody = this.$el.find('.js-right-list .biz-transfer-list-content');
    this.init();
}

BizTransfer.prototype.formatInput = function (dataSource) {
    var formatedData = [],
        me = this;
    dataSource = dataSource || [];
    if (dataSource.length) {
        $.each(dataSource, function(index, value) {
            var tmp = {
                id: '',
                title: '',
                chosen: false
            };

            tmp.id = value[me.keyMap.id];
            tmp.title = value[me.keyMap.title];
            if (value[me.keyMap.chosen]) {
                tmp.chosen = value[me.keyMap.chosen];
            }

            formatedData.push(tmp);
        });
    }
    return formatedData;

};

BizTransfer.prototype.formatOutPut = function (targets) {
    var me = this,
        result = [];
    if (targets.length) {
        $.each(targets, function(index, value) {
            var tmp = {};
            tmp[me.keyMap.id] = value.id;
            tmp[me.keyMap.title] = value.title;
            if (me.keyMap.chosen) {
                tmp[me.keyMap.chosen] = value.chosen;
            }
            result.push(tmp);
        });
    }
    return result;
}

BizTransfer.prototype.getHtml = function (titles, styles) {
    var leftStyle = styles[0] ?　'width:' + styles[0].width + ';height:' + styles[0].height : '',
        rightStyle = styles[1] ?　'width:' + styles[1].width + ';height:' + styles[1].height : '',
        html = '<div class="biz-transfer">\
            <div class="biz-transfer-list js-left-list" style= ' + leftStyle + '>\
                <div class="biz-transfer-list-header js-left-header">\
                    <input type="checkbox" title=" " id="leftSelectAll" class="js-leftSelectAll"/>\
                    <span>' + titles[0] + '</span>\
                </div>\
                <div class="biz-transfer-list-body">\
                    <ul class="biz-transfer-list-content">\
                    </ul>\
                </div>\
            </div>\
            <div class="biz-transfer-operation">\
                <button class="js-add biz-transfer-button"><span class="icon-right"></span></button>\
                <button class="js-remove biz-transfer-button"><span class="icon-left"></span></button>\
            </div>\
            <div class="biz-transfer-list js-right-list" style=' + rightStyle + '>\
                <div class="biz-transfer-list-header js-right-header">\
                    <input type="checkbox" title=" " id="rightSelectAll" class="js-rightSelectAll"/>\
                    <span>' + titles[1] + '</span>\
                </div>\
                <div class="biz-transfer-list-body">\
                    <ul class="biz-transfer-list-content">\
                    </ul>\
                </div>\
            </div>\
        </div>';

    return html;
};

BizTransfer.prototype.init = function () {
    this.render();
    this.initEvents();
    this.$el.find('button').bizButton();
};

BizTransfer.prototype.initEvents = function () {
    this.bindSelect();
    this.bindButton();
};

BizTransfer.prototype.render = function () {
    var me = this;
    if (this.dataSource.length) {
        this.$leftListBody.html('');
        $.each(this.dataSource, function(index, value) {
            console.log(value);
            me.$leftListBody.append(
                '<li class="biz-transfer-list-content-item" key="' + value.id + '" chosen=' + value.chosen +'>\
                    <span>' + value.title + '</span>\
                </li>'
            );
        });
    } else {
        this.$leftListBody.html('<li class="biz-transfer-list-content-item" style="text-align:center">\
            <span>' + this.noContent + '</span>\
        </li>');
    }
    if (this.getTargets().length) {
        this.$rightListBody.html('');
        $.each(this.getTargets(), function (index, value){
            console.log(value);
            me.$rightListBody.append(
                '<li class="biz-transfer-list-content-item" key="' + value.id
                    + '" chosen=' + value.chosen +'>\
                    <span>' + value.title + '</span>\
                </li>'
            );
        });
    }
    this.createSelect();
};

BizTransfer.prototype.addItems = function (items) {
    var me = this;
    if(items.length) {
        items = items.filter(function (item) {
            var flag = true;
            $.each(me.dataSource, function(index, value) {
                if (value.id == item.id) {
                    flag = false;
                }
            })
            return flag;
        });
        me.dataSource = me.dataSource.concat(items);
        me.addOption(items, 'left');
    }
};

//在dataSource中通过chosen字段获得被选中项列表
BizTransfer.prototype.getTargets = function () {
    var me = this;
    return this.dataSource.filter(function (data) {
        return data.chosen;
    })
};

//通过右边框的li中的key值得到右边框中各项的id值
BizTransfer.prototype.getTargetKeys = function () {
    var $li = this.$rightListBody.find('li'),
        targetKeys = [];

    $.each(this.getSelectedIndex('right'), function (index, value) {
        targetKeys.push($($li[value]).attr('key'));
    });

    return targetKeys;
};

BizTransfer.prototype.createSelect = function() {
    var me = this;
    if (this.dataSource.length) {
        $.each(this.dataSource, function (index, value){
            $(me.$leftListBody.find('li')[index]).prepend('<input type="checkbox" title="" /> ')
        });
        $.each(this.getTargets(), function (index, value){
            $(me.$rightListBody.find('li')[index]).prepend('<input type="checkbox" title=""  />')
        });
    }
    this.$el.find(':checkbox').bizCheckbox();
    this.$leftListBody.find('li[chosen=true]').addClass('biz-transfer-disabled');
    this.$leftListBody.find('li[chosen=true]').find(':checkbox').bizCheckbox('disable');
};

BizTransfer.prototype.bindSelect = function () {
    var me = this;
    this.$el.on('click', '.js-left-header .biz-label', function(e) {
        var selected = $(e.target).hasClass('biz-checkbox-checked'),
            $checkbox = me.$leftListBody.find('li[chosen=false]').find(':checkbox');

        if (selected) {
            $checkbox.bizCheckbox('check');
        } else {
            $checkbox.bizCheckbox('uncheck');
        }
    }).on('click', '.js-right-header .biz-label', function(e) {
        var selected = $(e.target).hasClass('biz-checkbox-checked'),
            $checkbox = me.$rightListBody.find(':checkbox');

        if (selected) {
            $checkbox.bizCheckbox('check');
        } else {
            $checkbox.bizCheckbox('uncheck');
        }
    });
};

BizTransfer.prototype.moveRight = function(indexList) {
    var me = this,
        addList = [];

    $.each(indexList, function(index, value) {
        var $li = $(me.$leftListBody.find('li')[value]);
        $li.addClass('biz-transfer-disabled')
            .attr('chosen', true).find(':checkbox')
            .bizCheckbox('disable').bizCheckbox('uncheck');

        me.dataSource[value].chosen = true;
        addList.push(me.dataSource[value]);
    });
    me.$el.find('.js-leftSelectAll').bizCheckbox('uncheck');
    me.addOption(addList, 'right');
}

BizTransfer.prototype.moveLeft = function(indexList) {
    var me = this,
        $rightLi = [],
        targetKeys = me.getTargetKeys();


    $.each(indexList, function (index, value) {
        var leftIndex = me.findIndexById(me.dataSource, targetKeys[index]),
            $leftLi = $(me.$leftListBody.find('li')[leftIndex]);

        $leftLi.removeClass('biz-transfer-disabled')
            .attr('chosen', false).find(':checkbox')
            .bizCheckbox('enable');
        me.dataSource[leftIndex].chosen = false;

        $rightLi.push(me.$rightListBody.find('li')[value]);
    });

    $($rightLi).remove();
    me.$el.find('.js-rightSelectAll').bizCheckbox('uncheck');
}

BizTransfer.prototype.bindButton = function() {
    //添加
    var me = this;

    this.$el.on('click', '.js-add', function(e){
        var indexList = me.getSelectedIndex('left');
        if (indexList.length > 0) {
            me.moveRight(indexList);

            if (me.options.onChange) {
                me.options.onChange();
            }
        } else {
            return false;
        }
    });

    //移除
    this.$el.on('click', '.js-remove', function (e) {
        var indexList = me.getSelectedIndex('right');

        if (indexList.length > 0) {
            me.moveLeft(indexList);

            if (me.options.onChange) {
                me.options.onChange();
            }
        } else {
            return false;
        }
    });
};

BizTransfer.prototype.findIndexById = function (dataList, id) {
    var idList = [],
        me = this;

    $.each(dataList, function(index, value) {
        idList.push(value.id);
    });

    return $.inArray(parseInt(id, 10), idList);
}

BizTransfer.prototype.addOption = function (dataList, position) {
    var me = this;
    if (dataList.length > 0) {
        var $liList = [];
        $.each(dataList, function(index, value) {
            var $li = $(
                '<li class="biz-transfer-list-content-item" key="' + value.id
                    + '"  chosen=' + value.chosen + '>\
                    <input type="checkbox" title="" />\
                    <span>' + value.title + '</span>\
                </li>'
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

BizTransfer.prototype.getSelectedIndex = function (position) {
    var indexList = [],
        me = this;
    if (position == 'left') {
        $.each(this.$leftListBody.find('.biz-checkbox-checked'), function (index, label) {
            indexList.push($.inArray(label, me.$leftListBody.find('.biz-label')));
        });
    } else {
        $.each(this.$rightListBody.find('.biz-checkbox-checked'), function (index, label) {
            indexList.push($.inArray(label, me.$rightListBody.find('.biz-label')));
        });
    }
    return indexList;
};

BizTransfer.prototype.getValue = function () {
    var me = this,
        targets = me.getTargets(),
        result = me.formatOutPut(targets);

    return result;

};

BizTransfer.prototype.select = function (idList) {
    var indexList = [],
        me = this;

    $.each(idList, function (index, value) {
        var i = me.findIndexById(me.dataSource, value);
        if (i != '-1' && me.dataSource[i].chosen != true) {
            indexList.push(i);
        }
    });

    me.moveRight(indexList);
};


var dataKey = 'bizTransfer';
$.extend($.fn, {
    bizTransfer: function (method, options) {
        var bizTransfer;
        switch (method) {
            case 'addItems':
                bizTransfer = $(this).data(dataKey);
                if (bizTransfer) {
                    bizTransfer.addItems(options);
                }
                break;

            case 'getValue':
                bizTransfer = $(this).data(dataKey);
                if (bizTransfer) {
                    return bizTransfer.getValue();
                }
                break;

            case 'select':
                bizTransfer = $(this).data(dataKey);
                if (bizTransfer) {
                    return bizTransfer.select(options);
                }
                break;

            default:
                if (!$(this).data(dataKey)) {
                    $(this).data(dataKey, new BizTransfer(this, method));
                }
        }
        return this;
    }
});
