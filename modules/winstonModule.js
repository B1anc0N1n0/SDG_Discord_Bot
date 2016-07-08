var winston = require('winston');

exports.createWinstonFileTransport = function() {
  winston.add( //add transport (console is default)
  	winston.transports.File, { //add File transport type
  		filename: 'standardLog.log', //base filename
  		level: 'info', //level at which to log messages
  		json: true, //log in JSON format
  		timestamp: true, //append timestamp to log if true
  		dirname: './logs', //directory name
  		maxsize: 10000000, //size in bytes where roll over will occur
  		maxFiles: 0, //# of files to keep after roll over occurs
  		tailable: true //keep roll over in ascending order so that most current file is always base file name
  	}
  )
};
