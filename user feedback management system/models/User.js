class User {
    constructor({ username, hashedPassword }) {
        this.username = username;
        this.hashedPassword = hashedPassword;
        this.feedbacks = [];
    }
}

const users = [];

module.exports = { User, users };
