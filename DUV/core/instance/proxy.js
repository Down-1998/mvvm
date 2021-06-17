import { renderData } from './render.js';
import { rebuild } from './mount.js';

const arrProto = Array.prototype;
// vm表示Due对象,obj表示代理对象,namespace表示命名空间
export function constructProxy(vm, obj, namespace) {
    let proxyObj = null;
    if (obj instanceof Array) {
        proxyObj = new Array(obj.length);
        //对数组的每一项作代理
        for (let i = 0; i < obj.length; i++) {
            proxyObj[i] = constructProxy(vm, obj[i], namespace)
        }
        //对数组整体做代理
        proxyObj = proxyArr(vm, obj, namespace);
    } else if (obj instanceof Object) {
        proxyObj = constructObjProxy(vm, obj, namespace)
    } else {
        throw Error('error')
    }
    return proxyObj;
}

// 对数组做代理
function proxyArr(vm, arr, namespace) {
    let obj = {
        eleType: 'Array',
        toString: function () {
            let result = '';
            for (let i = 0; i < arr.length; i++) {
                result += ', ';
            }
            return result.substring(0, result.length - 2);
        },
        push() {

        },
        pop() {

        },
        shift() {

        },
        unshift() {

        }
    }
    defArrayFunc.call(vm, obj, 'push', namespace, vm);
    defArrayFunc.call(vm, obj, 'pop', namespace, vm);
    defArrayFunc.call(vm, obj, 'shift', namespace, vm);
    defArrayFunc.call(vm, obj, 'unshift', namespace, vm);
    arr.__proto__ = obj;
    return arr;
}

//  对数组的方法做代理
function defArrayFunc(obj, func, namespace, vm) {
    Object.defineProperty(obj, func, {
        enumerable: true,
        configurable: true,
        value: function (...args) {
            let original = arrProto[func];
            const result = original.apply(this, args);
            rebuild(vm, getNameSpace(namespace, ''));
            renderData(vm, getNameSpace(namespace, ''));
            console.log(getNameSpace('', obj));
            return result;
        }
    })
}

function constructObjProxy(vm, obj, namespace) {
    let proxyObj = {}
    for (let prop in obj) {
        //对属性做代理
        Object.defineProperty(proxyObj, prop, {
            configurable: true,
            get() {
                return obj[prop];
            },
            set(value) {
                console.log('====');
                obj[prop] = value
                renderData(vm, getNameSpace(namespace, prop))
            }
        })
        //对vm进行代理
        Object.defineProperty(vm, prop, {
            configurable: true,
            get() {
                return obj[prop];
            },
            set(value) {
                console.log('====');
                obj[prop] = value
                renderData(vm, getNameSpace(namespace, prop))
            }
        })
        //递归
        if (obj[prop] instanceof Object) {
            proxyObj[prop] = constructProxy(vm, obj[prop], getNameSpace(namespace, prop))
        }
    }
    return proxyObj;
}

function getNameSpace(nowNameSpace, nowProp) {
    if (nowNameSpace == null || nowNameSpace == '') {
        return nowProp;
    } else if (nowProp == null || nowProp == '') {
        return nowNameSpace;
    } else {
        return nowNameSpace + '.' + nowProp;
    }
}