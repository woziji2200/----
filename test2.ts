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

let io: iostream = new iostream();
type linjie = {
    v1: number,
    v2: number,
    e: number,
    hasVisited?: boolean
}

class AdjacencyList {
    data: Array<linjie>
    constructor(data: Array<linjie>) {
        this.data = data
    }
}
class Matrix {
    data: Array<Array<number>>
    getPrototypeOf() {
        return this.data
    }
    deleteRow(row: number) {  // 删除行
        return this.data.splice(row, 1)
    }
    deleteCol(col: number) { // 删除列
        for (let i = 0; i < this.data.length; i++) {
            this.data[i].splice(col, 1)
        }
    }
    getRowLength() {
        return this.data.length
    }
    getColLength() {
        return this.data[0].length
    }
    getSubmatrix(): any {  // 获取最大子矩阵们
        function choose<T>(arr: T[], size: number): T[][] {
            const allResult: T[][] = [];
            (function chooseHelper(arr: T[], size: number, result: T[]): void {
                const arrLen = arr.length;
                if (size > arrLen) {
                    return;
                }
                if (size === arrLen) {
                    allResult.push([...result, ...arr]);
                } else {
                    for (let i = 0; i < arrLen; i++) {
                        const newResult = [...result, arr[i]];

                        if (size === 1) {
                            allResult.push(newResult);
                        } else {
                            const newArr = arr.slice(i + 1);
                            chooseHelper(newArr, size - 1, newResult);
                        }
                    }
                }
            })(arr, size, []);
            return allResult;
        }
        let ans: any = []
        let allChoose: number[][]
        // let MatrixCopy = JSON.parse(JSON.stringify(this.data))
        if (this.getColLength() > this.getRowLength()) {
            // 列数大于行数
            allChoose = choose(new Array(this.getColLength()).fill(0).map((item, index) => { return index }), this.getRowLength() - 1)
            for (let item of allChoose) {
                let MatrixCopy = new Matrix(JSON.parse(JSON.stringify(this.data)))
                let length = MatrixCopy.getColLength()
                let deleteCount = 0
                for (let i = 0; i < length; i++) {
                    // io.print(i, item.indexOf(i), length)
                    if (item.indexOf(i) == -1) {
                        MatrixCopy.deleteCol(i - deleteCount)
                        deleteCount++
                    }
                }
                ans.push({ Matrix: MatrixCopy, e: item, v: new Array(this.getRowLength()).fill(0).map((item, index) => { return index }) })
            }

        } else if (this.getColLength() < this.getRowLength()) {
            // 行数大于列数
            allChoose = choose(new Array(this.getRowLength()).fill(0).map((item, index) => { return index }), this.getColLength() + 1)
            for (let item of allChoose) {
                let MatrixCopy = new Matrix(JSON.parse(JSON.stringify(this.data)))
                let length = MatrixCopy.getRowLength()
                let deleteCount = 0
                for (let i = 0; i < length; i++) {
                    if (item.indexOf(i) == -1) {
                        MatrixCopy.deleteRow(i - deleteCount)
                        deleteCount++
                    }
                }
                ans.push({ Matrix: MatrixCopy, e: new Array(this.getColLength()).fill(0).map((item, index) => { return index }), v: item })
            }
        } else {
            // 行数等于列数
            allChoose = choose(new Array(this.getRowLength()).fill(0).map((item, index) => { return index }), this.getColLength() - 1)
            for (let item of allChoose) {
                let MatrixCopy = new Matrix(JSON.parse(JSON.stringify(this.data)))
                let length = MatrixCopy.getColLength()
                let deleteCount = 0
                for (let i = 0; i < length; i++) {
                    if (item.indexOf(i) == -1) {
                        MatrixCopy.deleteCol(i - deleteCount)
                        deleteCount++
                    }
                }
                ans.push({ Matrix: MatrixCopy, v: new Array(this.getColLength()).fill(0).map((item, index) => { return index }), e: item })
            }
        }

        return ans
    }

    getDeterminant(square: number[][]) { // 获取行列式
        // 方阵约束
        // let square = this.data;
        if (square.length !== square[0].length) {
            throw new Error();
        }
        // 方阵阶数
        let n = square.length;

        let result = 0;
        if (n > 3) {
            // n 阶
            for (let column = 0; column < n; column++) {
                // 去掉第 0 行第 column 列的矩阵
                let matrix = new Array(n - 1).fill(0).map(arr => new Array(n - 1).fill(0));
                for (let i = 0; i < n - 1; i++) {
                    for (let j = 0; j < n - 1; j++) {
                        if (j < column) {
                            matrix[i][j] = square[i + 1][j];
                        } else {
                            matrix[i][j] = square[i + 1][j + 1];
                        }
                    }
                }
                result += square[0][column] * Math.pow(-1, 0 + column) * this.getDeterminant(matrix);
            }
        } else if (n === 3) {
            // 3 阶
            result = square[0][0] * square[1][1] * square[2][2] +
                square[0][1] * square[1][2] * square[2][0] +
                square[0][2] * square[1][0] * square[2][1] -
                square[0][2] * square[1][1] * square[2][0] -
                square[0][1] * square[1][0] * square[2][2] -
                square[0][0] * square[1][2] * square[2][1];
        } else if (n === 2) {
            // 2 阶
            result = square[0][0] * square[1][1] - square[0][1] * square[1][0];
        } else if (n === 1) {
            // 1 阶
            result = square[0][0];
        }
        return result;
    }

    constructor(data: number[][]) {
        this.data = data
    }
}


(async function main() {


    io.print('输入一个相邻矩阵，以空格分割，以回车结尾')
    let xianglinTemp: Array<Array<number>> = []
    // while (true) {
    //     let inputStr: String = await io.input()
    //     if (inputStr === '') {
    //         break
    //     }
    //     xianglinTemp.push(inputStr.split(' ').map((item: String) => { return Number(item) }))
    // }
    // io.print(xianglinTemp)

    /*0 1 1
    1 0 1
    1 1 0 */
    xianglinTemp = [[0, 1, 1], [1, 0, 1], [1, 1, 0]]
    /*0 1 1 1
    1 0 0 1
    1 0 0 1
    1 1 1 0 */
    xianglinTemp = [[0, 1, 1, 1], [1, 0, 0, 1], [1, 0, 0, 1], [1, 1, 1, 0]]
    /*0 1 1 1 0 1
    1 0 0 1 0 1
    1 0 0 1 0 0
    1 1 1 0 1 0
    0 0 0 1 0 1
    1 1 0 0 1 0 */
    xianglinTemp = [[0, 1, 1, 1, 0, 1], [1, 0, 0, 1, 0, 1], [1, 0, 0, 1, 0, 0], [1, 1, 1, 0, 1, 0], [0, 0, 0, 1, 0, 1], [1, 1, 0, 0, 1, 0]]

    let xianglin = new Matrix(xianglinTemp)


    // 相邻矩阵转换邻接表
    function xianglinToLinjiebiao(xianglin2: Matrix): AdjacencyList {
        let linjiebiao: AdjacencyList = new AdjacencyList([])
        for (let i = 0; i < xianglin2.getRowLength(); i++) {
            for (let j = i + 1; j < xianglin2.getColLength(); j++) {
                if (xianglin2.data[i][j] === 1) {
                    linjiebiao.data.push({ v1: Math.min(i, j), v2: Math.max(i, j), e: linjiebiao.data.length })
                }
            }
        }
        return linjiebiao
    }
    let linjiebiao = xianglinToLinjiebiao(xianglin)
    // let linjiebiao = new Matrix([[0, 1, 0, 0], [1, 0, 1, 1], [0, 1, 0, 1], [0, 1, 1, 0],[0,0,0,0]])
    io.print('转化的邻接表：', linjiebiao)




    // 邻接表转换关联矩阵
    function linjiebiaoToGuanlian(linjiebiao2: AdjacencyList, xianglin2: Matrix): Matrix {
        let guanlian: Matrix = new Matrix([])
        for (let i = 0; i < xianglin2.getRowLength(); i++) {
            let temp: Array<number> = []
            for (let j = 0; j < linjiebiao2.data.length; j++) {
                if (linjiebiao2.data[j].v1 == i || linjiebiao2.data[j].v2 == i) {
                    temp.push(1)
                } else {
                    temp.push(0)
                }
            }
            guanlian.data.push(temp)
        }
        return guanlian
    }
    let guanlian = linjiebiaoToGuanlian(linjiebiao, xianglin)
    // let guanlian = new Matrix([[0, 1, 0], [1, 0, 1], [0, 1, 0], [0, 1, 1], [0, 0, 0]])
    // let guanlian = new Matrix([[0, 1, 0, 0], [1, 0, 1, 1], [0, 1, 0, 1]])

    io.print('转化的关联矩阵：', guanlian)



    // 关联矩阵转换生成树
    function shengchengshu(guanlian2: Matrix) {
        let guanlian2Copy = new Matrix(JSON.parse(JSON.stringify(guanlian2.data)))
        let result: any = guanlian2Copy.getSubmatrix()
        result = result.filter((item: any) => {
            let temp = new Matrix(JSON.parse(JSON.stringify(item.Matrix.data)))
            temp.deleteRow(0)
            // io.print(temp.getDeterminant(temp.data))
            return temp.getDeterminant(temp.data) != 0
        })
        return result
    }
    let shengchengshuResult = shengchengshu(guanlian)
    // io.print('生成树：', shengchengshuResult.map((item: any) => { return item.Matrix.data }))
    // io.print('生成树e：', shengchengshuResult.map((item: any) => { return item.e }))
    // io.print('生成树v：', shengchengshuResult.map((item: any) => { return item.v }))
    // io.print(shengchengshuResult)

    // 生成树关联矩阵转邻接表
    function guanlianToLinjiebiao(guanlian2: Matrix, e: number[], v: number[]) {
        let linjiebiao: AdjacencyList = new AdjacencyList([])
        for (let i = 0; i < e.length; i++) {
            let v1 = -1, v2 = -1
            for (let j = 0; j < v.length; j++) {
                if (guanlian2.data[j][i] == 1) {
                    if (v1 == -1 && v2 == -1) {
                        v1 = v[j]
                    } else if (v1 != -1 && v2 == -1) {
                        v2 = v[j]
                        linjiebiao.data.push({ v1: v1, v2: v2, e: e[i] })
                        break
                    }

                }

            }
        }
        return linjiebiao
    }


    shengchengshuResult.forEach((item: { Matrix: Matrix; e: number[]; v: number[] }) => {
        let list = guanlianToLinjiebiao(item.Matrix, item.e, item.v)
        let ListBuji = new AdjacencyList([])
        linjiebiao.data.forEach((item: linjie) => {
            for (let i of list.data) {
                if (i.e == item.e)
                    return
            }
            ListBuji.data.push(item)
        })
        // 求对称差
        function duichencha<T>(...arrs: T[][]): T[] {
            // 将所有数组合并成一个数组
            const mergedArray = arrs.reduce((acc, curr) => acc.concat(curr), []);

            // 使用 Map 来记录元素的出现次数
            const occurrencesMap = new Map<T, number>();

            // 遍历合并后的数组，更新元素的出现次数
            mergedArray.forEach((element) => {
                const occurrences = occurrencesMap.get(element) || 0;
                occurrencesMap.set(element, occurrences + 1);
            });

            // 过滤出在原始数组中只出现一次的元素，即对称差
            const symmetricDifference = Array.from(occurrencesMap.entries())
                .filter(([_, occurrences]) => occurrences === 1)
                .map(([element]) => element);

            return symmetricDifference;
        }
        // 全排列
        function combine<T>(arr: T[]): T[][] {
            const result: T[][] = [];

            function backtrack(start: number, current: T[]) {
                result.push([...current]);

                for (let i = start; i < arr.length; i++) {
                    current.push(arr[i]);
                    backtrack(i + 1, current);
                    current.pop();
                }
            }
            backtrack(0, []);

            return result;
        }
        function dfs(nowV: number, endV: number, ListBuji: AdjacencyList, ans: number[][], e: number[] = []) {
            if (nowV == endV) {
                ans.push(JSON.parse(JSON.stringify(e)))
                // return JSON.parse(JSON.stringify(e))
            }
            for (let i = 0; i < ListBuji.data.length; i++) {
                if (ListBuji.data[i].v1 == nowV) {
                    if (ListBuji.data[i].hasVisited) continue
                    ListBuji.data[i].hasVisited = true
                    e.push(ListBuji.data[i].e)
                    dfs(ListBuji.data[i].v2, endV, ListBuji, ans, e)
                    ListBuji.data[i].hasVisited = false
                    e.pop()
                }
                if (ListBuji.data[i].v2 == nowV) {
                    if (ListBuji.data[i].hasVisited) continue
                    ListBuji.data[i].hasVisited = true
                    e.push(ListBuji.data[i].e)
                    dfs(ListBuji.data[i].v1, endV, ListBuji, ans, e)
                    ListBuji.data[i].hasVisited = false
                    e.pop()
                }
            }
        }
        io.print('生成树的邻接表：', list)




        // 基本回路系统
        let huanlukongjian: number[][] = []
        ListBuji.data.forEach((item: linjie) => {
            let ans: number[][] = []
            dfs(item.v1, item.v2, list, ans)
            ans[0].push(item.e)
            huanlukongjian.push(...ans)
            io.print(`这棵树的e${item.e}的基本回路系统`, ans[0].map((item) => { return 'e' + item }).toString())
        })
        // 环路空间
        let huanlukongjianQuanpailie = combine(huanlukongjian)
        let huanlukongjianAns: Set<number[]> = new Set()
        huanlukongjianQuanpailie.forEach((item) => {
            huanlukongjianAns.add(duichencha(...item))
            // io.print(item, duichencha(...item))
        })
        io.print('这棵树的环路空间：', huanlukongjianAns)



        // 基本割集系统
        let duanjikongjian: number[][] = []
        list.data.forEach((item) => {
            let listGeji: AdjacencyList = new AdjacencyList(JSON.parse(JSON.stringify(list.data)))
            for (let i = 0; i < listGeji.data.length; i++) {
                if (item.v1 == listGeji.data[i].v1 && item.v2 == listGeji.data[i].v2 && item.e == listGeji.data[i].e) {
                    listGeji.data.splice(i, 1)
                    break
                }
            }
            let jibengeji1: number[] = []
            let jibengeji2: number[] = []
            function findTwoPartOfGraph(startV: number, list: AdjacencyList, ans: number[]) {
                for (let i = 0; i < list.data.length; i++) {
                    if (list.data[i].v1 == startV) {
                        if (list.data[i].hasVisited) continue
                        list.data[i].hasVisited = true
                        // io.print(ans)
                        ans.push(list.data[i].v2)
                        findTwoPartOfGraph(list.data[i].v2, list, ans)
                        // ans.pop()
                    } else if (list.data[i].v2 == startV) {
                        if (list.data[i].hasVisited) continue
                        list.data[i].hasVisited = true
                        ans.push(list.data[i].v1)
                        findTwoPartOfGraph(list.data[i].v1, list, ans)
                        // ans.pop()
                    }
                }
            }
            findTwoPartOfGraph(item.v1, new AdjacencyList(JSON.parse(JSON.stringify(listGeji.data))), jibengeji1)
            jibengeji1.push(item.v1)
            findTwoPartOfGraph(item.v2, new AdjacencyList(JSON.parse(JSON.stringify(listGeji.data))), jibengeji2)
            jibengeji2.push(item.v2)
            let jibengejiAns: number[] = []
            // io.print(`这棵树的e${item.e}的基本割集系统`, jibengeji1, jibengeji2)
            for (let i = 0; i < jibengeji1.length; i++) {
                for (let j = 0; j < jibengeji2.length; j++) {
                    for (let k = 0; k < ListBuji.data.length; k++) {
                        if (ListBuji.data[k].v1 == Math.min(jibengeji1[i], jibengeji2[j]) && ListBuji.data[k].v2 == Math.max(jibengeji1[i], jibengeji2[j])) {
                            jibengejiAns.push(ListBuji.data[k].e)
                        }
                    }
                }
            }
            jibengejiAns.push(item.e)
            duanjikongjian.push(jibengejiAns)
            io.print(`这棵树的e${item.e}的基本割集系统`, jibengejiAns.map((item) => { return 'e' + item }).toString())

        });
        // 断集空间
        let duanjikongjianQuanpailie = combine(duanjikongjian)
        let duanjikongjianAns: Set<number[]> = new Set()
        duanjikongjianQuanpailie.forEach((item) => {
            duanjikongjianAns.add(duichencha(...item))
            // io.print(item, duichencha(...item))
        })
        io.print('这棵树的断集空间：', duanjikongjianAns)


    })


    io.close()
})()