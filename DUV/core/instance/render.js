import { getValue } from "../utils/ObjectUtil.js";

//通过模板找到哪些节点用了这个模板
let template2Vnode = new Map();
//通过节点,找到这个节点下有哪些模板
let vnode2Template = new Map();

export function renderMixin(Due) {
    Due.prototype._render = function () {
        renderNode(this, this._vnode);
    }
}

export function renderData(vm, data) {
    let vnodes = template2Vnode.get(data);
    if (vnodes != null) {
        for (let i = 0; i < vnodes.length; i++) {
            renderNode(vm, vnodes[i]);
        }
    }
}
//渲染节点
export function renderNode(vm, vnode) {
    if (vnode.nodeType == 3) {//是文本节点
        let templates = vnode2Template.get(vnode);
        if (templates) {
            console.log(vnode);
            let result = vnode.text;
            for (let i = 0; i < templates.length; i++) {
                let templateValue = getTemplateValue([vm._data, vnode.env], templates[i])//当前节点的参数可以来自于Due对象,还可以来自于父级节点
                if (templateValue) {
                    console.log(templateValue, 11111);
                    result = result.replace('{{' + templates[i] + '}}', templateValue)
                }
            }
            vnode.elm.nodeValue = result;
        }
    } else if (vnode.nodeType == 1 && vnode.tag == 'INPUT') {
        let templates = vnode2Template.get(vnode);
        if (templates) {
            for (let i = 0; i < templates.length; i++) {
                let templateValue = getTemplateValue([vm._data, vm.env], templates[i])
                if (templateValue) {
                    vnode.elm.value = templateValue;
                }
            }
        }
    } else {
        //递归
        for (let i = 0; i < vnode.children.length; i++) {
            renderNode(vm, vnode.children[i])
        }
    }
}

export function prepareRender(vm, vnode) {
    if (vnode == null) {
        return;
    }
    if (vnode.nodeType == 3) {//是个文本节点
        analysisTemplateString(vnode);
    }
    analysisAttr(vm, vnode);
    if (vnode.nodeType == 1) {//标签
        for (let i = 0; i < vnode.children.length; i++) {
            prepareRender(vm, vnode.children[i]);
        }

    }
}

function analysisTemplateString(vnode) {
    let templateStringList = vnode.text.match(/{{[a-zA-Z0-9_.]+}}/g);
    for (let i = 0; templateStringList && i < templateStringList.length; i++) {
        setTemplate2Vnode(templateStringList[i], vnode);
        setVnode2Temlate(templateStringList[i], vnode);
    }
}

function setTemplate2Vnode(template, vnode) {
    let temlatName = getTemplateName(template);
    let vnodeSet = template2Vnode.get(temlatName);
    if (vnodeSet) {
        vnodeSet.push(vnode)
    } else {
        template2Vnode.set(temlatName, [vnode])
    }
}

function setVnode2Temlate(template, vnode) {
    let templateSet = vnode2Template.get(vnode);
    if (templateSet) {
        templateSet.push(getTemplateName(template));
    } else {
        vnode2Template.set(vnode, [getTemplateName(template)])
    }
}

function getTemplateName(template) {
    //判断是否带花括号
    if (template.substring(0, 2) == '{{' && template.substring(template.length - 2, template.length) == '}}') {
        return template.substring(2, template.length - 2);
    } else {
        return template;
    }
}

export function getTemplate2Vnode() {
    console.log(template2Vnode);
}
export function getVnode2Template() {
    console.log(vnode2Template);
}

function getTemplateValue(objs, templateName) {
    for (let i = 0; i < objs.length; i++) {
        let temp = getValue(objs[i], templateName);
        if (temp != null) {
            return temp
        }
    }
    return null;
}

function analysisAttr(vm, vnode) {
    if (vnode.nodeType !== 1) {
        return;
    }
    let attrNames = vnode.elm.getAttributeNames();
    if (attrNames.indexOf('v-model') > -1) {
        setTemplate2Vnode(vnode.elm.getAttribute('v-model'), vnode);
        setVnode2Temlate(vnode.elm.getAttribute('v-model'), vnode);
    }
}