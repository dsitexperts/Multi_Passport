var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var adminSchema = mongoose.Schema({
	local: {
		username: String,
		password: String
	}
});

adminSchema.methods.generateHash = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
}

adminSchema.methods.validPassword = function(password){
	return bcrypt.compareSync(password, this.local.password);
}

module.exports = mongoose.model('Admin', adminSchema);