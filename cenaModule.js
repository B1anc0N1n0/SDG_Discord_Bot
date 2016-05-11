//These three required for the fs.readdirSync()
var fs = require( "fs" );
var path = require( "path" );
var process = require( "process" );

var cenaImageFolder = "./cenaImages/";
var cenaImageArray = new Array();
cenaImageArray = fs.readdirSync(cenaImageFolder); //Loops through a given folder and creates an array of file names

var cenaReply = function (bot, message) {
  //Reply message - \uD83C is the unicode trumpet
  bot.reply(message, "\uD83C\uDFBA\uD83C\uDFBA\uD83C\uDFBA\uD83C\uDFBA**JOHN CENA!**\uD83C\uDFBA\uD83C\uDFBA\uD83C\uDFBA\uD83C\uDFBA");
  //Get random image path from array
  var randomCenaImageFilePath = cenaImageArray[Math.floor(Math.random() * cenaImageArray.length)];
  //Reply with random cena image
  bot.sendFile(message.channel, cenaImageFolder.concat(randomCenaImageFilePath),"jonny.png", (err, message) => {
    if(err)
      winston.error("couldn't send image:", err);
  })
}

module.exports = cenaReply;
