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