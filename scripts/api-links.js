// Description:
//   Respond to requests for different Ember classes with links from the Ember API
//
// Commands:
//   !api <Class Name>(#methodName optional) - Prints out a link to the Class, or method name mentioned
//   hubot api <Class Name>(#methodName optional) - Prints out a link to the Class, or method name mentioned
//
// Author:
//   brandonjmckay

module.exports = function apiLinks(robot) {
  const docsUrl = 'http://emberjs.com/api/classes/';
  const htmlSuffix = '.html';
  const methodPrefix = '#method_';

  const formatApiLink = function(className, subClassName = '', methodName) {
    return `${docsUrl}${className}${subClassName}${htmlSuffix}${methodName ? methodPrefix + methodName : ''}`;
  }

  const printApiLink = function (res){
    let [_, className, subClassName, methodName] = res.match;
    if (methodName) {
      methodName = methodName.replace('#', '');
    }

    return res.send(formatApiLink(className, subClassName, methodName));
  }

  robot.hear(/^!api (\w*)(\.\w*)?(\#\w*)?/, (res) => printApiLink(res));
  robot.respond(/^api (\w*)(\.\w*)?(\#\w*)?/, (res) => printApiLink(res));
}

