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
    // fixme: 使用文件夹下的 html 无法加载其中的 js
    // var fileContent = fs.readFileSync('./html/upload_files/index.html');
	var fileContent = fs.readFileSync('./index.html');
    res.write(fileContent);
    res.end();
  } 
  else if (url == '/upload') {
    // 接收上传的文件
    var parser = new formidable.IncomingForm();
    parser.parse(req, function(err, fileds, files) {
      if (!err) {
        fs.exists(uploadFileDir , function(exists){
          if(!exists){
            fs.mkdir(uploadFileDir , function(callBack){
              console.log("创建文件夹成功！");
            });
          }
		  files.filebtn.forEach(file => {
			let fileContent = fs.readFileSync(file.filepath);
			fs.writeFileSync(uploadFileDir + '/' + file.originalFilename, fileContent);
			res.write(uploadFileDir + '/' + file.originalFilename);
		  });
          res.end();
        });
      }
    })
  } 
  else if (url == '/list'){
	let fileListHtml = fs.readFileSync('./html/file_list/index.html');
	res.write(fileListHtml);
	res.end();
  }
  else {
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
server.listen(8088);
