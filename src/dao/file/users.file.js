import FileManager from "./file.manager.js"

export default class Users extends FileManager {
  constructor(filename = "./src/databases/db.users.json") {
    super(filename)
  }

  getUserById = async (id) => this.getById(id)
  getUserByEmail = async (email) => {
    const users = await this.get()
    return users.find((u) => u.email === email)
  }
  getUsers = async () => this.get() 

  createUser = async (user) => this.add(user)

  updateUser = async (user, value, field = "password") => {
    const updateObj = { ...user }
    updateObj[field] = value
    return this.update(user.id, updateObj)
  }

  deleteUser = async (uid) => this.delete(uid)
}