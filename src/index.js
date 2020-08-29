import JSZip from 'jszip'
import saveAs from 'jszip/vendor/FileSaver'
class ToJSZip {
    constructor(srcs, fileName) {
        return new Promise(async(resolve, reject) => {
            if (!Array.isArray(srcs)) {
                this.srcs = [srcs]
            } else {
                this.srcs = srcs
            }
            
            this.zip = new JSZip();
            this.folder = this.zip.folder(fileName);
            await this.compress()
                .catch(err => {
                    reject(err)
                })
            this.zip.generateAsync({ type: "blob" })
            .then(function(content) {
                saveAs(content, fileName + ".zip");
                resolve(content)
            });
        })
    }
    async compress() {
        return new Promise(async(resolve, reject) => {
            for (let i = 0; i < this.srcs.length; i++) {
                let name, path
                if (typeof this.srcs[i] == "object") {
                    name = this.srcs[i].name
                    path = this.srcs[i].path
                } else {
                    name = /[^/]+$/.exec(this.srcs[i])[0]
                    path = this.srcs[i]
                }
                let oReq = await this.request(path).catch(function(err) {
                    reject(err)
                })
                if (oReq) {
                    let blob = oReq.response;
                    this.folder.file(name, blob)
                }
            }
            resolve()
        })
    }
    async request(src)  {
        return new Promise((resolve, reject) => {
            let oReq = new XMLHttpRequest();
            oReq.open("GET", src, true);
            oReq.responseType = "blob";
            oReq.onreadystatechange = function() {
                if (oReq.readyState == oReq.DONE) {
                    if (oReq.status === 200) {
                        resolve(oReq)
                    } else {
                        reject(oReq)
                    }
                }
            }
            oReq.send();
        })
    }

}

function RafiJSZip(srcs, fileName) {
    return new ToJSZip(srcs, fileName)
}
function RafiFile(url, name) {
    return new Promise((resolve, reject) => {
        if (!name) {
            name = url.split('/')
            name = name[name.length - 1]
        }
        let xhr = null
        if (XMLHttpRequest) {
            xhr = new XMLHttpRequest()
        } else {
            xhr = new ActiveXObject('Microsoft.XMLHTTP')
        }
        xhr.open('GET', url, true)
        xhr.responseType = 'blob' // 设置返回类型blob
        // 定义请求完成的处理函数，请求前也可以增加 加载框/禁用下载按钮的相关逻辑
        xhr.onload = function() {
            let data = {
                status: this.status,
                response: this.response,
                url: this.ajaxUrl,
                name: name
            }
            if (this.status === 200) {
                let blob = this.response
                saveAs(blob, name)
                resolve(data)
            }
            reject(data)
        }
        xhr.send() //发送ajax请求
    })
}
const jsDown = {toJSZip:RafiJSZip,toFile:RafiFile}
module.exports = jsDown;
let _global = (function() { return this || (0, eval)('this'); }());
!('jsDown' in _global) && (_global.jsDown = jsDown);