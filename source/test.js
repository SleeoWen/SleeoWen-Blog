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