//Note: the .js is not required as Node assumes these files are javascript
//node modules to include
var Discord = require("discord.js")
var winston = require('winston')
//bot modules
var RPSManager = require("./RPSManager.js")
var cenaModule = require("./cenaModule.js")
//initial bot setup
var bot = new Discord.Client({autoReconnect: true});
var AuthDetails = require("./auth.json");
var botVersion = "0.5";
var botStartTime = new Date();
//These three required for the fs.readdirSync()
var fs = require( "fs" );
var path = require( "path" );
var process = require( "process" );

var rpsManager = new RPSManager(bot);

//---------------------------- WINSTON ----------------------------||
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
//-------------------------WINSTON  ENDSTON------------------------||

//Table catcher object constructor
function TableCatcher(channel){
	this.currentEmotionalState = 0;
	this.emotionalState = ["┬─┬ノ( ゜-゜ノ)", "┬─┬ノ(ಠ益ಠノ)", "┬─┬ノ(ಥ益ಥノ)", "(/ .□.)\ ︵╰(゜Д゜)╯︵ /(.□. \)"]
	this.lastFlipTimestamp = new Date();
	this.channel = channel;
	this.tableBroken = false;
}
var tableCatcherArray = new Array(); //Keeps all TableCatcher objects

bot.on("disconnected", function(){
	winston.info("** Shamebot disconnected at " + new Date() + " **");
});

bot.on("ready", function(){
	winston.info("|| -- Shamebot ready for input at " + new Date() + " -- ||");
});

bot.on("message", function(message)
{
	//don't listen for self messages
	if (message.author.id == bot.user.id){
		return;
	}
	//Make all message content lower case so all triggers can be written lower case and always work.
	var lowerCaseMessage = message.content.toLowerCase();

	//help
	if(message.content.includes("!help")){
		bot.reply(message, "Availible commands *(all commands start with !)* :\r" +
		"help\r" +
		"uptime\r" +
		"battle begin *@player1* *@player2*");
	}

	//about
	if(message.content.includes("!about")){
		bot.reply(message, "ShameBot Version " + botVersion + "\r" +
		"Stack: Discord.js, Node.js, Ubuntu, Digital Ocean, GitHub, and pm2.\r" +
		"Find us on GitHub!\r" +
		"https://github.com/B1anc0N1n0/SDG_Discord_Bot\r" +
		"@B1anc0N1n0 @DaKing @TeckHybrid");
	}

	//uptime
	if(message.content.includes("!uptime")){
		var botUptime = Math.abs(new Date() - botStartTime);
		var x = botUptime / 1000;
		var uptimeSeconds = Math.floor(x % 60);
		x /= 60;
		var uptimeMinutes = Math.floor(x % 60);
		x /= 60;
		var uptimeHours = Math.floor(x % 24);
		x /= 24;
		var uptimeDays = Math.floor(x);
		botUptime = "D:H:M:S - " + uptimeDays + ":" + uptimeHours + ":" + uptimeMinutes + ":" + uptimeSeconds;
		bot.reply(message, botUptime);
	}

	//John Cena
	if(lowerCaseMessage.includes("and his name is") ||
		lowerCaseMessage.includes("and his name was") ||
		message.content.includes("\uD83C\uDFBA")){
			cenaModule(bot, message);
	}

	//Table Catcher
	if(message.content.includes("(╯°□°）╯︵ ┻━┻")){
		var channelHasCatcher = false;
		if (tableCatcherArray.length > 0){ //Make sure there's at least 1 object in the array
			for (var i = 0; i < tableCatcherArray.length; i++){ //loop through array to see if object already exists for channel
				var currentTableCatcher = tableCatcherArray[i]; //set new var to current array object
				if (currentTableCatcher.channel.equals(message.channel)){//if the we find an object already exists for the channel
					channelHasCatcher = true;//set flag to true that channel already has object
					if (currentTableCatcher.tableBroken == true && Math.abs(new Date() - currentTableCatcher.lastFlipTimestamp) < 300000){//if table is broken and it's been less than 5 minutes
						bot.reply(message, "*TABLE SHATTERS*: Shamebot's sick of your shit. He'll be back to save the tables in a few minutes.")
					}else if (currentTableCatcher.tableBroken == true && Math.abs(new Date() - currentTableCatcher.lastFlipTimestamp) >= 300000){//if table is broken but it's been 5 minutes or more
						currentTableCatcher.tableBroken = false;
						bot.reply(message, currentTableCatcher.emotionalState[currentTableCatcher.currentEmotionalState]);
						currentTableCatcher.lastFlipTimestamp = new Date();
						currentTableCatcher.currentEmotionalState++;
					}else{//else -> table is not broken...
						if (Math.abs(new Date() - currentTableCatcher.lastFlipTimestamp) <= 30000){
							bot.reply(message, currentTableCatcher.emotionalState[currentTableCatcher.currentEmotionalState]);
							currentTableCatcher.lastFlipTimestamp = new Date();
							if (currentTableCatcher.currentEmotionalState <= currentTableCatcher.emotionalState.length - 2){
								currentTableCatcher.currentEmotionalState++;
							}else {
								//bot.reply(message, currentTableCatcher.emotionalState[currentTableCatcher.currentEmotionalState]);
								currentTableCatcher.currentEmotionalState = 0;
								currentTableCatcher.tableBroken = true;
							}
						}else if (Math.abs(new Date() - currentTableCatcher.lastFlipTimestamp) > 30000){
							var timePast = Math.abs(new Date() - currentTableCatcher.lastFlipTimestamp);
							var numberOfIncrementsPast = (timePast / 30000) - 1; //30 seconds is one increment

							if (numberOfIncrementsPast < 1){
								//return previous table catch emotion
								currentTableCatcher.currentEmotionalState--;
								bot.reply(message, currentTableCatcher.emotionalState[currentTableCatcher.currentEmotionalState]);
								currentTableCatcher.lastFlipTimestamp = new Date();
							}else {
								//decrease emotional states equal to the number of increments to a minimum of 0
								numberOfIncrementsPast = Math.floor(numberOfIncrementsPast);
								if (currentTableCatcher.currentEmotionalState - numberOfIncrementsPast <= 0){
									currentTableCatcher.currentEmotionalState = 0;
									bot.reply(message, currentTableCatcher.emotionalState[0]);
								}else {
									currentTableCatcher.currentEmotionalState -=  numberOfIncrementsPast;
									bot.reply(message, currentTableCatcher.emotionalState[currentTableCatcher.currentEmotionalState]);
								}
							}

							if (currentTableCatcher.currentEmotionalState <= currentTableCatcher.emotionalState.length - 2){
								currentTableCatcher.currentEmotionalState++;
							}else {
								bot.reply(message, currentTableCatcher.emotionalState[currentTableCatcher.currentEmotionalState]);
								currentTableCatcher.currentEmotionalState = 0;
								currentTableCatcher.tableBroken = true;
							}
						}
					}
				}
			}
			if (channelHasCatcher == false){
				tableCatcherArray.push(new TableCatcher(message.channel));
				var currentTableCatcher = tableCatcherArray[tableCatcherArray.length - 1];
				bot.reply(message, currentTableCatcher.emotionalState[currentTableCatcher.currentEmotionalState]);
				currentTableCatcher.lastFlipTimestamp = new Date();
				currentTableCatcher.currentEmotionalState++;
			}
		}else{
			tableCatcherArray[0] = new TableCatcher(message.channel);
			var currentTableCatcher = tableCatcherArray[0];
			bot.reply(message, currentTableCatcher.emotionalState[currentTableCatcher.currentEmotionalState]);
			currentTableCatcher.lastFlipTimestamp = new Date();
			currentTableCatcher.currentEmotionalState++;
		}
	}
	//KoolAid - just the KoolAid man. Ohhhh yeeahh!
	if(lowerCaseMessage.includes("oh no") ||
		lowerCaseMessage.includes("hey koolaid")){
		bot.sendFile(message.channel, "./koolaid.jpg","koolaid.jpg", (err, message) => {
			if(err)
				winston.error("couldn't send image:", err);
		});
	}

  // Rock, Paper, Scissors
	if (message.content.substring(0, 7) == "!battle") {
	    rpsManager.parseCommand(message);
	}
	if (message.channel.isPrivate && rpsManager.isBattleOn()) {
	    rpsManager.parseCommand(message);
	}

	// Macho Man!
	if(lowerCaseMessage.includes("savage")) {
		bot.reply(message, "Ohhhh yeah brother!");
		winston.info("A Wild Savage Appeared!");
		bot.sendFile(message.channel, "./savage.jpg","savage.jpg", (err, message) => {
			if(err)
				winston.error("Couldn't send image:", err);
		});
	}

		// Tiny Rick!!!!
		if(lowerCaseMessage.includes("tiny rick")) {
			bot.reply(message, "I'm Tiny Rick!!!!!");
			bot.sendFile(message.channel, "./tinyRick.jpg","tinyRick.jpg", (err, message) => {
				if(err)
					winston.error("couldn't send image:", err);
			});
		}
});

bot.loginWithToken(AuthDetails.token);
