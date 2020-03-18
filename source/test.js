Promise.all = (arr) => {
    let resultList = new Array(arr.length);
    return new Promise((resolve, reject) => {
        let temp = 0;
        for (let i = 0, len = arr.length; i < len; i++) {
            arr[i].then((res, rej) => {
                if (!rej) {
                    resultList[i] = (res);
                    if (temp == arr.length) {
                        resolve(resultList);
                    }
                    temp++;
                } else {
                    reject(rej);
                }
            })
        }
    })
};
var a = { name: 'demo' };
var b = new Object({ name: 'demo' });
var func = function () {
    this.name = 'demo';
}
var c = new func();
var demo = { name: 'demo' };
var d = Object.create(demo);
//	借助原型链实现继承
function Parent2() {
    this.name = 'name2';
    this.play = [1, 2, 3];
}
function Child2() {
    this.type = 'chilid2';
}
Child2.prototype = new Parent2();
console.log(new Child2());
var s1 = new Child2();
var s2 = new Child2();
console.log(s1.play, s2.play);	//[1,2,3] [1,2,3]
s1.play.push(4);
console.log(s1.play, s2.play);	//[1,2,3,4] [1,2,3,4]
// 组合方式
function Parent3() {
    this.name = 'name3';
    this.play = [1, 2, 3];
}
function Child3() {
    Parent3.call(this);
    this.type = 'chilid3';
}
Child3.prototype = new Parent3();
var s3 = new Child3();
var s4 = new Child3();
s3.play.push(4);
console.log(s3.play, s4.play);
function Parent4() {
    this.name = '4';
    this.play = [1, 2, 3];
}
function Child4() {
    Parent4.call(this);
    this.type = 'chilid4';
}
Child4.prototype = Parent4.prototype;
var s5 = new Child4();
var s6 = new Child4();
s5.play.push(4);
console.log(s5.play, s6.play);
console.log(s5 instanceof Child4, s5 instanceof Parent4);	// true true
console.log(s5.constructor);	// Parent4
// 因为子类的prototype就是父类的实例，他的constructor是从父类直接拿过来的

function Parent5() {
    this.name = '5';
    this.play = [1, 2, 3];
}
function Child5() {
    Parent5.call(this);
    this.type = 'chilid5';
}
Child5.prototype = Object.create(Parent5.prototype);
Child5.prototype.constructor = Child5;
var s5 = new Child5();
var s6 = new Child5();
s5.play.push(4);
console.log(s5.play, s6.play);
console.log(s5 instanceof Child5, s5 instanceof Parent5); // true true
console.log(s5.constructor); // Child5