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
type linjie = {
    v1: number,
    v2: number,
    e: number,
    hasVisited?: boolean,

}
class AdjacencyList {
    data: Array<linjie>
    constructor(data: Array<linjie>) {
        this.data = data
    }
}

let io: iostream = new iostream();

(async function main() {
    let graph: number[][] = [
        [1, 0, 0, 1, 1],
        [1, 1, 0, 0, 0],
        [0, 0, 1, 1, 0],
        [0, 1, 1, 0, 1]
    ]
    graph = [[1,0,0,1,0,1],
    [1,1,0,0,0,0],
    [0,1,1,0,0,0],
    [0,0,0,1,1,0],
    [0,0,1,0,1,1]]


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
    let maxPath: number[] = []
    let allChoose: number[][] = choose(new Array(graph.length).fill(0).map((item, index) => index), 2)
    function GuanlianjuzhenToLinjiebiao(graph: number[][]): AdjacencyList {
        let data: linjie[] = []
        for (let j = 0; j < graph[0].length; j++) {
            let v1 = -1, v2 = -1
            for (let i = 0; i < graph.length; i++) {
                if (graph[i][j] == 1 && v1 == -1) {
                    v1 = i
                } else if (graph[i][j] == 1 && v1 != -1) {
                    v2 = i
                    data.push({ v1, v2, e: j })
                }
            }
        }
        return new AdjacencyList(data)
    }
    for (let allChooseItem of allChoose) {
        let linjiebiao: AdjacencyList = GuanlianjuzhenToLinjiebiao(graph)
        function findMaxPath(startV: number, endV: number, linjie: AdjacencyList, ans: number[][], pathNow: number[] = [], vVisited: number[] = []) {
            if (startV == endV) {
                // pathNow.push(endV)
                if (pathNow.length > ans.length) {
                    ans[0] = [...pathNow]
                }
                return
            }
            for (let i = 0; i < linjie.data.length; i++) {
                // if(linjie.data[i].hasVisited) continue
                if (linjie.data[i].v1 == startV && !vVisited.includes(linjie.data[i].v2)) {
                    pathNow.push(linjie.data[i].v2)
                    vVisited.push(linjie.data[i].v2)
                    findMaxPath(linjie.data[i].v2, endV, linjie, ans, pathNow, vVisited)
                    pathNow.pop()
                    vVisited.pop()
                } else if (linjie.data[i].v2 == startV && !vVisited.includes(linjie.data[i].v1)) {
                    pathNow.push(linjie.data[i].v1)
                    vVisited.push(linjie.data[i].v1)
                    findMaxPath(linjie.data[i].v1, endV, linjie, ans, pathNow, vVisited)
                    pathNow.pop()
                    vVisited.pop()

                }
            }
        }
        let ans: number[][] = []
        findMaxPath(allChooseItem[0], allChooseItem[1], linjiebiao, ans, [allChooseItem[0]], [allChooseItem[0]])
        let ansE: number[] = []
        for (let i = 0; i < ans[0].length - 1; i++) {
            for (let j = 0; j < linjiebiao.data.length; j++) {
                if ((linjiebiao.data[j].v1 == ans[0][i] && linjiebiao.data[j].v2 == ans[0][i + 1]) || (linjiebiao.data[j].v2 == ans[0][i] && linjiebiao.data[j].v1 == ans[0][i + 1])) {
                    ansE.push(linjiebiao.data[j].e)
                }
            }
        }
        // io.print("ans",allChooseItem, ans[0], ansE)
        if (ansE.length % 2 != 0 && ansE.length >= maxPath.length) {
            maxPath = [...ansE]
        }
    }
    io.print("找到最长交错路径：", maxPath.map(item => { return 'e' + (item + 1) }).toString())
    io.print("最大匹配：", maxPath.filter((item, index) => { return index % 2 == 0 }).map(item => { return 'e' + (item + 1) }).toString())
    let linjiebiao: AdjacencyList = GuanlianjuzhenToLinjiebiao(graph)
    linjiebiao.data = linjiebiao.data.concat(JSON.parse(JSON.stringify(linjiebiao.data)))
    // io.print(linjiebiao)

    let minPath: number[] = new Array(1000)
    function dfs(startV: number, endV: number, linjie: AdjacencyList, path: number[] = []) {
        if (startV == endV) {
            // io.print(path)
            let a = new Set(path)
            if (linjie.data.length / 2 == a.size) {
                if (minPath.length > path.length) {
                    minPath = [...path]
                }
                return
            }
        }
        for (let i = 0; i < linjie.data.length; i++) {
            if (linjie.data[i].hasVisited) continue
            if (linjie.data[i].v1 == startV) {
                path.push(linjie.data[i].e)
                linjie.data[i].hasVisited = true
                dfs(linjie.data[i].v2, endV, linjie, path)
                path.pop()
                linjie.data[i].hasVisited = false
            } else if (linjie.data[i].v2 == startV) {
                path.push(linjie.data[i].e)
                linjie.data[i].hasVisited = true
                dfs(linjie.data[i].v1, endV, linjie, path)
                path.pop()
                linjie.data[i].hasVisited = false
            }
        }
    }

    dfs(0, 0, linjiebiao)
    io.print("最佳环游：",minPath.map(item => { return 'e' + (item + 1) }).toString())
    io.close();
})()