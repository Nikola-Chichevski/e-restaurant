const ts = require("../../common/db/text-service");
const { v4: uuidv4 } = require("uuid");
const UserType = require("../../common/models/user-type.enum");
const bcrypt = require("bcrypt");

class AuthService {
  static async login(credentials) {
    const users = ts.readData("users.json");

    const user = users.find(u => u.username === credentials.username);

    if (!user) {
      throw new Error(`Invalid credentials`);
    }

    const validPassword = await bcrypt.compare(
      credentials.password,
      user.password
    );

    if (!validPassword) {
      throw new Error(`Invalid credentials`);
    }

    return user;
  }

  static async register(credentials) {
    const users = ts.readData("users.json");

    const exists = users.some(u => u.username === credentials.username);

    if (exists) {
      throw new Error(
        `User with username: ${credentials.username} already exists.`
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(credentials.password, salt);

    const user = {
      id: uuidv4(),
      username: credentials.username,
      password: hashedPassword,
      type: UserType.user,
    };

    users.push(user);
    ts.writeData("users.json", users);

    return user;
  }

  static async logout() {
      
  }
}

module.exports = AuthService;
