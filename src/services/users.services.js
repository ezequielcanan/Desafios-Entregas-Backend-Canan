export default class UsersService {
  constructor(dao) {
    this.dao = dao
  }

  getUserById = async (id) => {
    const user = await this.dao.getUserById(id)
    return user
  }

  getUsers = async () => this.dao.getUsers()

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

  updateLastConnection = async (user) => {
    const result = await this.dao.updateUser(user, Date.now(), "last_connection")
    return result
  }

  switchRole = async (user) => {
    const role = user?.role != "admin" ? (user?.role == "user" ? "premium" : "user") : "admin"
    const result = await this.dao.updateUser(user, role, "role")
    return result
  }

  deleteUser = async (uid) => this.dao.deleteUser(uid)

  deleteInactiveUsers = async () => {
    const users = await this.getUsers()
    await Promise.all(users.map(async (user) => {
      const now = new Date()
      now.setMinutes(now.getMinutes() - 1) //esto seria en 2 horas, solo de prueba se pasa a min
      console.log(user?.last_connection, now, user?.last_connection < now)

      if (user?.last_connection < now && user?.role != "admin") return await this.dao.deleteUser(user?._id)
    }))
    return "ok"
  }
}