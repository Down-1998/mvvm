//拿到data中的模板在在文本标签对应的值
export function getValue(obj, name) {
    if (!obj) {
        return obj;
    }
    let nameList = name.split('.');
    let temp = obj;
    for (let i = 0; i < nameList.length; i++) {
        if (temp[nameList[i]]) {
            temp = temp[nameList[i]]
        } else {
            return undefined;
        }
    }
    return temp;
}

// obj.x.a
export function setValue(obj, data, value) {//vm._data,属性:content,新值
    if (!obj) {
        return;
    }
    let attrList = data.split('.');
    let temp = obj;
    for (let i = 0; i < attrList.length - 1; i++) {
        if (temp[attrList[i]]) {
            temp = temp[attrList[i]]
        } else {
            return
        }
    }
    if (temp[attrList[attrList.length - 1]] !== null) {
        temp[attrList[attrList.length - 1]] = value;
    }
}