
// 사용할 모듈을 로드한다.
var config = require('./config'),
	mongoose = require('mongoose');

// MongoDB 커넥션 풀을 이용해 커넥션 생성
var CreateConnection = function CreateConnection() {
	var connection = mongoose.createConnection(config.db);

	return connection;
};

CreateConnection.instance = null;

// 생성된 커넥션이 있다면 해당 커넥션을 리턴하고
// 없다면 새로운 커넥션을 만들어 리턴한다.
CreateConnection.getConnection = function () {
	if (this.instance === null) {
		this.instance = new CreateConnection();
	}
	return this.instance;
};

module.exports = CreateConnection.getConnection();
