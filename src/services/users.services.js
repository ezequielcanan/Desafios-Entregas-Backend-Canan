export default class UsersService {
  constructor(dao) {
    this.dao = dao
  }

  getUserById = async (id) => {
    const user = await this.dao.getUserById(id)
    return user
  }

  getUserByEmail = async (email) => {
    const user = await this.dao.getUserByEmail(email)
    return user
  }

  createUser = async (user) => {
    const newUser = await this.dao.createUser(user)
    return newUser
  }

  changeUserPassword = async (user, password) => {
    const result = await this.dao.updateUser(user, password)
    return result
  }

  switchRole = async (user) => {
    const role = user?.role != "admin" ? (user?.role == "user" ? "premium" : "user") : "admin"
    const result = await this.dao.updateUser(user, role, "role")
    return result
  }
}