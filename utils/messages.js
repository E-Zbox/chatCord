const moment = require("moment");

const formatMessage = (id, username, text, users) => ({
    id,
    username,
    text,
    time: moment().format("h:mm a"),
    users,
});

module.exports = formatMessage;
