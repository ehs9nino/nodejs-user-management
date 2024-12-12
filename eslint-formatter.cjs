// eslint-formatter.cjs
module.exports = (results) => {
  let output = '';

  results.forEach((result) => {
    if (result.messages.length > 0) {
      result.messages.forEach((message) => {
        output += `${result.filePath}:${message.line}:${message.column} ${message.message} (${message.ruleId})\n`;
      });
    }
  });

  if (output === '') {
    output = '✔ No problems found!\n';
  }

  return output;
};
