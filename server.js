/**
 * Created by Administrator on 2015/11/19.
 */

var http = require('http');
var fs = require('fs');
var formidable = require('formidable');
var filename;
var n = 0;
var re = /(\.js)$|(\.css)$/;
var json1 = {
  'success': 1,
  'msg': []
};
// 用于存储上传文件的文件夹
var uploadFileDir = 'uploads';
var server = http.createServer(function(req, res) {
  res.writeHead(200, {
    'Content-type': 'text/html;charset=UTF8',
    'charset': 'UTF-8'
  });
  var url = req.url;
  n++;
  // 打印所有的网络请求地址
  console.log("请求 " + n + ' : ' + url);
  if (url == '/') {
    // 默认 index.html
    var fileContent = fs.readFileSync('./index.html');
    res.write(fileContent);
    res.end();
  } else if (url == '/upload') {
    // 接收上传的文件
    var parser = new formidable.IncomingForm();
    parser.parse(req, function(err, fileds, files) {
      //console.log(files)
      if (!err) {
        // fs.access(uploadFileDir, constants.F_OK, (err) => {
        //   console.log(`${uploadFileDir} ${err ? 'does not exist' : 'exists'}`);
        // });


        fs.exists(uploadFileDir , function(exists){
          if(!exists){
            fs.mkdir(uploadFileDir , function(callBack){
              console.log("创建文件夹成功！");
            });
          }
          for (var name in files) {
            console.log(name);
            var imgBox = files[name];
            var fileContent = fs.readFileSync(imgBox.path);
            fs.writeFileSync(uploadFileDir + '/' + imgBox.name, fileContent);
            //json1.msg.push(imgBox.name);
            //console.log(json1)
            // res.write({'success':1,'msg':imgBox.name})
          }
          // var str1=JSON.stringify(json1);
          res.write(uploadFileDir + '/' + imgBox.name);
          res.end();
        });
      }

    })
  } else {
    filename = url.replace(/^\//, '');
    if (url == '/favicon.ico') {
      return false;
    }
    fs.exists(filename, function(exists) {
      if (exists) {
        if (re.test(url)) {
          console.log(url)
          var httpFile = fs.readFileSync('.' + url);
          //console.log(httpFile);
          if (httpFile) {
            res.write(httpFile);

          }
          res.end();
          return false;

        }
        fileContent = fs.readFileSync('./' + filename);
        res.writeHead(200, {
          'Content-Type': 'image/jpeg'
        });
        res.write(fileContent);

      }
      res.end();
    })
  }
});
server.listen(8080);
