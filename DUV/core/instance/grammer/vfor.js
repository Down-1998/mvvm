import { getValue } from "../../utils/ObjectUtil.js";
import VNode from "../../vdom/vnode.js"
export function vforInit(vm, elm, parent, instruction) {
    let virtualNode = new VNode(elm.nodeName, elm, [], '', getVirtualNodeData(instruction)[2], parent, 0);
    virtualNode.instruction = instruction;
    parent.elm.removeChild(elm);
    parent.elm.appendChild(document.createTextNode(''));
    let resultSet = analysisInstruction(vm, instruction, elm, parent);
    return virtualNode;
}

function getVirtualNodeData(instruction) {
    let insSet = instruction.trim().split(" ");
    if (insSet.length != 3 || insSet[1] != "in" && insSet[1] != "of") {
        throw new Error('error');
    }
    return insSet;
}
//分析list在data中的值
function analysisInstruction(vm, instruction, elm, parent) {
    let insSet = getVirtualNodeData(instruction)
    let dataSet = getValue(vm._data, insSet[2]);
    if (!dataSet) {
        throw new Error('error');
    }
    let resultSet = []
    for (let i = 0; i < dataSet.length; i++) {
        let tempDom = document.createElement(elm.nodeName);
        tempDom.innerHTML = elm.innerHTML;
        let env = analysisKV(insSet[0], dataSet[i], i);//获取局部变量
        tempDom.setAttribute('env', JSON.stringify(env));//将局部变量设置到标签上
        parent.elm.appendChild(tempDom);
        resultSet.push(tempDom);
    }
    return resultSet;
}

//分析局部变量
function analysisKV(instruction, value, index) {
    if (/([a-zA-Z0-9_$]+)/.test(instruction)) {
        instruction = instruction.trim();
        instruction = instruction.substring(1, instruction.length - 1);
    }
    let keys = instruction.split(',')//(key,index)这种情况
    if (keys.length == 0) {
        throw new Error('error')
    }
    let obj = {};
    if (keys.length >= 1) {
        obj[keys[0].trim()] = value;

    }
    if (keys.length >= 2) {
        obj[keys[1].trim()] = index
    }
    return obj;
}