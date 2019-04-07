<template>
    <div>
        <ul>
            <li v-for="(v, i) in list" :key="i" v-if="v.status === '1'">{{v.text}}</li>
        </ul>
    </div>
</template>
<script>
    export default{
        name: 'responsive',
        data() {
            return {
                list: []
            }
        },
        methods: {
            defineReactive() {
                function defineReactive(obj, key, val) {
                    Object.defineProperty(obj, key, {
                        enumerable: true,
                        configurable: true,
                        get: function() {
                            console.log('get');
                            return val;
                        },
                        set: function(newVal) {
                            console.log('set');
                            val += newVal;
                        }
                    });
                }
                let obj = {name: '成龙大哥', say: '：其实我之前是拒绝拍这个游戏广告的，'};
                let arr = [1,2,3,4,5];
                Object.keys(obj).forEach(k => {
                    defineReactive(obj, k, obj[k]);
                });
                console.log(obj);
//            arr.forEach((v, i) => {
//                defineReactive(arr, i, v);
//            });
//            arr[0] = 'oh nanana';
//            console.log(arr[0]);
            },
            proxyReactive() {
                let data = {
                    name: '渣渣辉'
                };
                class Dep {
                    constructor() {
                        this.subs = new Set();
                    }
                    addSub(sub) {
                        this.subs.add(sub);
                    }
                    notify(key) {
                        this.subs.forEach(sub => {
                            sub.update();
                        });
                    }
                }
                class Watcher {
                    constructor(obj, key, cb) {
                        this.obj = obj;
                        this.key = key;
                        this.cb = cb; // 回调
                        this.value = this.get(); // 获取老数据
                    }
                    get() {
                        Dep.target = this;
                        let value = this.obj[this.key];
                        Dep.target = null;
                        return value;
                    }
                    // 将订阅者放入待更新队列等待批量更新
                    update() {
                        let newVal = this.obj[this.key];
                        if (this.value !== newVal) {
                            this.cb(newVal);
                            this.value = newVal;
                        }
                    }
                }
                function Observer(obj) {
                    Object.keys(obj).forEach(key => { // 做深度监听
                        if (typeof obj[key] === 'object') {
                            obj[key] = Observer(obj[key]);
                        }
                    });
                    let dep = new Dep();
                    let handler = {
                        get: function (target, key, receiver) {
                            Dep.target && dep.addSub(Dep.target);
                            return Reflect.get(target, key, receiver);
                        },
                        set: function (target, key, value, receiver) {
                            let result = Reflect.set(target, key, value, receiver);
                            dep.notify();
                            return result;
                        }
                    };
                    return new Proxy(obj, handler)
                }
                function print1(data) {
                    console.log('我系', data);
                }
                function print2(data) {
                    console.log('我今年', data);
                }
                data = Observer(data);
                new Watcher(data, 'name', print1);
                data.name = '杨过'; // 我系 杨过

                new Watcher(data, 'age', print2);
                data.age = '24'; // 我今年 24
                console.log(data);
            }
        },
        mounted() {
//            setTimeout(_ => {
//                this.list = [{text: 666, status: '0'}, {text: 666, status: '0'}, {text: 666, status: '0'}];
//            },1000);
//            setTimeout(_ => {
//                this.list.forEach((v, i) => {
////                    this.list[i] = {text: i};
//                    v.text = i;
//                    v.status = '1';
//                });
//                console.log(this.list);
//            },2000)
            this.proxyReactive();
            let obj = {};
            let handler = {
                get: function(target, key, receiver) {
                    console.log('get', key);
                    return Reflect.get(target, key, receiver);
                },
                set: function(target, key, value, receiver) {
                    console.log('set', key, value);
                    return Reflect.set(target, key, value, receiver);
                },
                deleteProperty(target, key) {
                    console.log('delete', key);
                    delete target[key];
                    return true;
                }
            };
//            let data = new Proxy(obj, handler);
//            console.log(data.name);
//            data.name = '尹天仇';
//            console.log(data.name);
//            delete data.name;

//            let arr = ['尹天仇', '我是一个演员', '柳飘飘', '死跑龙套的'];
//            let array = new Proxy(arr, handler);
//            array[1] = '我养你啊';
//            array[3] = '先管好你自己吧，傻瓜。';
//            console.log(array);
        }
    }
</script>
<style lang="scss">

</style>