const knex = require("../database/knex");
const { hash, compare } = require("bcryptjs");

class User {
  async create(req, res) {
    const { name, email, password } = req.body;

    const userExists = await knex("users").where({ email });

    if (userExists.length !== 0) {
      return res.status(400).json({ message: "Email already exists!" });
    } else {
      const hashedPass = await hash(password, 7);

      await knex("users").insert({ name, email, password: hashedPass });
      return res.status(200).json({ message: "User created!" });
    }
  }

  async update(req, res) {
    const { newName, newEmail, oldPassword, newPassword } = req.body;
    const { id } = req.params;

    const userInfo = await knex("users").where({ id });

    const userFromEmail = await knex("users").where({ email: newEmail });


    if (userFromEmail[0] && userFromEmail[0].id !== userInfo[0].id) {
      return res.status(400).json({ message: "Email already in use!" });
    }

    if (!oldPassword && newPassword) {
      return res.status(400).json({ message: "Insert your former password!" });
    }
    if (oldPassword && newPassword) {
      const passMatch = await compare(oldPassword, userInfo[0].password);

      if (!passMatch) {
        return res.status(400).json({ message: "Former password dont match." });
      }

      const hashedPass = await hash(newPassword, 7);
      userInfo[0].password = hashedPass ?? userInfo[0].password;
    }

    userInfo[0].name = newName ?? userInfo[0].name;
    userInfo[0].email = newEmail ?? userInfo[0].email;

    await knex("users")
      .update({
        name: userInfo[0].name,
        email: userInfo[0].email,
        password: userInfo[0].password,
        updated_at: knex.fn.now(),
      })
      .where({ id });

    return res.status(200).json({message: 'User updated!'})
  }
}

module.exports = User;
