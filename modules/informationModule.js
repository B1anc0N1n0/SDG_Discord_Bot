var botVersion = "0.5";
var botStartTime = new Date();
var winston = require('winston');

var InfoManager = function (bot){
  this.help = function (message){
    bot.reply(message, "Available commands *(all commands start with !)* :\r" +
		"!help\r" +
		"!uptime\r" +
		"!stats\r" +
		"!battle begin *@player1* *@player2*");
  }

  this.about = function (message){
    bot.reply(message, "ShameBot Version " + botVersion + "\r" +
		"Stack: Discord.js, Node.js, Ubuntu, Digital Ocean, GitHub, and pm2.\r" +
		"Find us on GitHub!\r" +
		"https://github.com/B1anc0N1n0/SDG_Discord_Bot\r" +
		"@B1anc0N1n0 @DaKing @TeckHybrid");
  }

  this.stats = function (message){
    bot.reply(message, "Working hard for [" + bot.servers.length + "] Servers " +
    "in [" + bot.channels.length + "] Channels for [" + bot.users.length + "] Users!");
  }

  this.fullStats = function (message){
    var serverNames = [];
    var channelNames = [];
    var userNames = [];

    bot.reply(message, "I've sent you a private message containing your request results.");

    bot.servers.forEach(function(server) {
      serverNames.push (server.name);
    });
    bot.channels.forEach(function(channel) {
      channelNames.push (channel.name);
    });
    bot.users.forEach(function(user) {
      userNames.push (user.name + "#" + user.discriminator);
    });
    bot.sendMessage(message.author, "Here are your full stats as requested:\n\n" +
      "**Servers:**\n\`\`\`" + serverNames+ "\`\`\`" +
      "**Channels:**\n\`\`\`" + channelNames + "\`\`\`" +
      "**Users:**\n\`\`\`" + userNames + "\`\`\`");
  }

  this.uptime = function (message){
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
}

module.exports = InfoManager;
