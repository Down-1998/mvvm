import { getValue } from "../../utils/ObjectUtil.js";

export function checkVon(vm, vnode) {
    if (vnode.nodeType != 1) {
        return;
    }
    let attrNames = vnode.elm.getAttributeNames();
    for (let i = 0; i < attrNames.length; i++) {
        if (attrNames[i].indexOf('v-on:') == 0 || attrNames[i].indexOf('@') == 0) {
            //               keydown                   enter
            von(vm, vnode, attrNames[i].split(':')[1], vnode.elm.getAttribute(attrNames[i]));
        }
    }
}
//给标签绑定事件
function von(vm, vnode, event, name) {
    let method = getValue(vm._methods, name);
    if (method) {
        vnode.elm.addEventListener(event, proxyEvecute(vm, method))
    }
}

function proxyEvecute(vm, method) {
    return function () {
        method.call(vm);
    }
}