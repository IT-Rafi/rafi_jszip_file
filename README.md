# rafi_jszip_file

- [npm](#npm)
- [用法](#use)

### Foreword
jszip不能通过地址下载，需要先请求获取文件内容传入到jszip方法里，才能压缩zip文件
如果想要把某些文件放到指定文件夹里的话，需要在name字段并接上指定文件夹名即可
例如：name:小狗+'/PNG/'+ 小狗.png


## npm

```
npm install rafi_jszip_file
```

## use

```
import {toJSZip,toFile} from 'rafi_jszip_file'

//下载资源包
toJSZip(src,'resource')
.then(res=>{
    console.log(res);
})
.catch(err=>{
    console.log(err);
})
//src为下载数,支持以下数据类型

//String 'example.png'
//Array ['example1.png','example.png']
//Object [{name:file1.png,path:'example1.png'},{name:file2.png,path:'example2.png'}]
//resource为压缩包名称


//下载文件
toFile(url,fileName)
.then(res=>{
    console.log(res);
})
.catch(err=>{
    console.log(err);
})
//url为下载地址
//fileName为下载后的文件名称
```