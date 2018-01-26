var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var userSchema = require('./database/db');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('.html',require('ejs').__express);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

/*插入数据库函数*/
function insert(name,psw){
      //数据格式
    var user =  new userSchema({
                name : name,
                password : psw,
                logindate : new Date()
            });
    user.save(function(err,res){
        if(err){
            console.log(err);
        }
        else{
            console.log(res);
        }
    })
}

app.post('/register', function (req, res) {
    console.log("请求到register接口")
    //处理跨域的问题
    res.setHeader('Content-type','application/json;charset=utf-8')
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    //先查询有没有这个user
    var name = req.body.username;
    var password = req.body.password;
    //密码加密
    // var md5 = crypto.createHash("md5");
    // var newPas = md5.update(UserPsw).digest("hex");
    //通过账号验证
    var updatestr = {name: name};
    console.log(updatestr);
    if(name == ''){
        res.send({status:'success',message:false}) ;
    }
    console.log(updatestr);
    res.setHeader('Content-type','application/json;charset=utf-8')
    userSchema.find(updatestr, function(err, obj){
        if (err) {
            console.log("Error:" + err);
        }
        else {
            console.log(obj);
            if (obj.length == 0) {
                //如果查出无数据,就将账户密码插入数据库
                insert(name,password);
                //返回数据到前端
                res.send({status:'success',message:true})
            }
            else if(obj.length !=0) {
                res.send({status:'success',message:false})
            }
            else {
                res.send({status:'success',message:false})
            }
        }
    })
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000);
module.exports = app;
