var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/chihuo');//；连接数据库
var Schema = mongoose.Schema;   //  创建模型
var UserSchema = new Schema({
    name: String,
    password: String,
    logindate : Date
}); //  定义了一个新的模型，但是此模式还未和users集合有关联
module.exports = mongoose.model('User',UserSchema);  //  与users集合关联