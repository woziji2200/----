import { hrtime } from 'process'
class iostream {   //输入输出类
    private readline = require('readline')
    private r1 = this.readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
    input(info?: String): Promise<String> {
        return new Promise((res) => {
            this.r1.question(info || '', (str: String) => {
                res(str)
            })
        })
    }
    print(...info: any) {
        console.log(...info);
    }
    close() {
        this.r1.close()
    }
};


(async function main() {

    let io: iostream = new iostream();

    let xulie: Array<number> = (await io.input('输入一个非负整数序列：')).split(' ').map((item: String) => { return Number(item) })
    io.print('输入的序列为：', xulie.toString())
    // xulie.sort()
    const start = hrtime.bigint(); // 191051479007711n



    let allDergee: number = xulie.reduce((a: number, b: number) => a + b) //所有顶点的度数
    io.print(allDergee % 2 ? '不可以图化' : '可以图化')  //握手定理判断是否可以图化
    if (allDergee % 2) {
        io.close() //关闭输入输出流
        return
    }



    io.print('使用havel算法判断可否简单图化：')
    let xulieTemp: Array<number> = JSON.parse(JSON.stringify(xulie.sort((a, b) => { return b - a })))
    let length: number = xulieTemp.length  //数组长度
    io.print(`初始数组的值         `, xulieTemp)
    for (let i: number = 0; i < length - 1; i++) {
        let first: number = xulieTemp.shift() as number  //删除数组的第一个元素

        xulieTemp = xulieTemp.sort((a, b) => { return b - a })  //对数组进行降序排列
        if (first > xulieTemp.length) {
            io.print('不能简单图化')
            break
        }
        xulieTemp = xulieTemp.map((item, index) => {  //删除第一个元素后，对第1个元素到第first个元素进行减1操作
            if (index < first) {
                return item - 1
            } else {
                return item
            }
        })
        xulieTemp = xulieTemp.sort((a, b) => { return b - a })
        io.print(`第${i + 1}次循环后，数组的值`, xulieTemp)
        if (xulieTemp[0] == 0 && xulieTemp[xulieTemp.length - 1] == 0) {  //如果数组的第一个元素和最后一个元素都为0，则说明数组中的元素都为0
            io.print('可以简单图化')
            break
        }
        if (xulieTemp[xulieTemp.length - 1] < 0) {  //如果数组的最后一个元素小于0，则说明数组中有负数
            io.print('不能简单图化')
            break
        }
    }


    io.print('使用erdos算法判断可否简单图化：')
    let flag = true
    xulie.unshift(0)  //在数组的第一个位置插入一个0，方便下面角标从1开始
    for (let r = 1; r <= length - 1; r++) {
        let rdi = 0
        for (let i = r + 1; i <= length; i++) {
            rdi += Math.min(r, xulie[i])
        }
        let di = 0
        for (let i = 1; i <= r; i++) {
            di += xulie[i]  //计算前r个元素的度数
        }
        
        if (di > rdi + r * (r - 1)) {  //如果前r个元素的度数大于rdi+r(r-1)，则不能简单图化
            flag = false
            break
        }
    }
    io.print(flag ? '可以简单图化' : '不能简单图化')
    if (!flag) {
        io.close() //关闭输入输出流
        return
    }
    xulie.shift()   //删除数组的第一个元素的0





    //使用dfs算法找出所有的相邻矩阵
    //初始化一个二维数组，用来存放相邻矩阵
    let map: Array<Array<number>> = new Array(length);
    for (let i = 0; i < length; i++) {
        map[i] = new Array(length).fill(0);
    }

    let mapAll: Set<string> = new Set();

    function dfs(i: number, j: number, dergee: number) {
        if (dergee == allDergee) {  //如果当前的度数等于所有顶点的度数，则说明可能找到了一个相邻矩阵
            if (xulie.sort().toString() == map.map((item) => { return item.reduce((a, b) => { return a + b }) }).sort().toString()) {
                mapAll.add(JSON.stringify(map)) //如果相邻矩阵的度数和输入的序列的度数相同，则说明找到了一个相邻矩阵
            }
            return;
        }
        for (let ii = i; ii < length; ii++) { //遍历二维数组，找出所有的相邻矩阵
            for (let jj = ii + 1; jj < length; jj++) {
                if (map[ii][jj] == 1) continue; //如果两个顶点已经相邻，则跳过
                if (ii == jj) continue;  //排除自己和自己相邻的情况
                map[ii][jj] = map[jj][ii] = 1; //两个顶点相邻
                dfs(ii, jj, dergee + 2);
                map[ii][jj] = map[jj][ii] = 0; //恢复状态
            }
        }
    }

    dfs(0, 0, 0);


    mapAll.forEach((item) => { //遍历所有的相邻矩阵，判断是否为连通图
        let temp: Array<Array<number>> = JSON.parse(item);
        io.print('邻接矩阵：', temp);
        // io.print(xulie)
        if (xulie[0] == 0) { //如果序列的最后一个元素为0，则说明一定有孤立点
            io.print('不是连通图')
        } else {
            function dfs2(v: number) { //使用dfs算法判断是否为连通图

                for (let i = 0; i < length; i++) {
                    if (temp[v][i] == 1) { //如果两个顶点相邻
                        temp[v][i] = temp[i][v] = 0;  //删除两个顶点的相邻关系  
                        // io.print(temp)
                        dfs2(i); //递归遍历
                    }
                }
                
            }
            dfs2(0)
            let flag = true
            for (let i of temp) {
                if (i.indexOf(1) != -1) { //如果邻接矩阵中还有1，则说明不是连通图
                    flag = false
                    break
                }
            }
            io.print(flag ? '是连通图' : '不是连通图')
        }


    })


    const end = hrtime.bigint()
    io.print(`took ${end - start} nanoseconds`)
    io.close() //关闭输入输出流
})()

