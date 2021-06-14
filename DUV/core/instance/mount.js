import VNode from "../vdom/vnode.js";
import { vmodel } from "./grammer/vmodel.js";
import { prepareRender, getTemplate2Vnode, getVnode2Template } from "./render.js";

export function initMount(Due) {
    Due.prototype.$mount = function (el) {
        let vm = this;
        let rootDom = document.getElementById(el);
        mount(vm, rootDom);
    }
}

export function mount(vm, elm) {
    console.log(elm);
    //进行挂载
    vm._vnode = constructVNode(vm, elm, null);
    console.log(vm._vnode.elm.nodeValue);
    //预备渲染
    prepareRender(vm, vm._vnode);
    getTemplate2Vnode();
    getVnode2Template();
}

//深度优先搜索构建虚拟dom树
function constructVNode(vm, elm, parent) {
    //vmodel找到标签上的属性
    analysisAttr(vm, elm, parent)
    let vnode = null;
    let children = [];
    let text = getNodeText(elm);
    let data = null;
    let nodeType = elm.nodeType;
    let tag = elm.nodeName;
    vnode = new VNode(tag, elm, children, text, data, parent, nodeType);
    let childs = vnode.elm.childNodes;
    for (let i = 0; i < childs.length; i++) {
        let childNodes = constructVNode(vm, childs[i], vnode);
        if (childNodes instanceof VNode) {//返回单一节点
            vnode.children.push(childNodes)
        } else {//返回节点数组
            vnode.children = vnode.children.concat(childNodes)
        }
    }
    return vnode;
}
//获取文本节点的内容
function getNodeText(elm) {
    if (elm.nodeType === 3) {
        return elm.nodeValue;
    } else {
        return '';
    }
}

//得到标签的属性
function analysisAttr(vm, elm, parent) {
    if (elm.nodeType == 1) {
        let attrNames = elm.getAttributeNames();//拿到标签上的attr值
        if (attrNames.indexOf('v-model') > -1) {
            vmodel(vm, elm, elm.getAttribute('v-model'));
        }
    }
}
