// Description:
//   Use hubots redis brain to store useful information
//
// Author:
//   locks
//
// Commands:
//   hubot learn "<key name>" means <value> - Get Hubot to memorize something new
//   hubot relearn "<key name>" means <value> - Overwrite something that Hubot learned before
//   hubot learned - Check all the things Hubot as learned so far
//   hubot remember "<key name>" - Retrieves a specific fact
//   hubot <key name>? - Retrieves a specific fact

const admins = { lala: 'lala' };

module.exports = function memory(robot) {
  const redisUrl = process.env.REDISCLOUD_URL;
  let thoughts = null;

  const actuallyLearnMethod = function actuallyLearnMethod(res, key, value) {
    thoughts[key] = value;
    robot.brain.emit('save');
    res.reply(`gotcha, *'${key}'* means '${value}'`);
  }

  const learnMethod = function learnMethod(res) {
    let [_, key, value] = res.match;

    if ( thoughts[key] ){
      return res.reply `I've already learnt that \" ${key} \" means ${thoughts[key]}`;
    }

    return actuallyLearnMethod(res, key, value);
  }

  const relearnMethod = function relearnMethod(res) {
    let [_, key, value] = res.match;
    return actuallyLearnMethod(res, key, value);
  }
  robot.respond(/learn "([^"]+)" (.+)$/i, res => learnMethod(res));

  robot.respond(/relearn "([^"]+)" (.+)$/i, res => relearnMethod(res));

  rememberMethod = function rememberMethod(res) {
    let [_, match] = res.match;
    if (match in thoughts) {
      return res.send(thoughts[match]);
    }
    return res.send("sorry, I don't know this :(");
  }

  robot.respond(/.*remember "([^"]+)".*/, rememberMethod);
  robot.respond(/([^?]+)\?/, rememberMethod);

  robot.respond(/learned/, (res) => {
    res.reply("check out my brain at http://rampant-stove.surge.sh/");
  });

  robot.respond(/forget "([^"]+)"/i, (res) => {
    let [_, match] = res.match
    let username = message.envelope.user.name

    if(!(username in admins)){
      return res.reply("sorry, you don't have permissions");
    }

    if (match in thoughts) {
      delete robot.brain.data.thoughts[match];
      robot.brain.emit('save');
      return res.reply(`${match}? never heard about it. :wink:`);
    }

    res.reply(`I never learned about ${match}`);
  });

  robot.brain.on('loaded', () => {
    thoughts = robot.brain.data.thoughts || {};
  });
}
