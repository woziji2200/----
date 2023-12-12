class iostream {   //ÊäÈëÊä³öÀà
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