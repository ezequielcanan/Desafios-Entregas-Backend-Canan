export const authorization = role => {
  return async (req, res, next) => {
    const { user } = req.user
    if (!user) return res.status(401).send({ error: 'Unauthorized' })

    if (!Array.isArray(role)) {
      if (user.role != role) return res.status(403).send({ error: 'No permisions' })
    }
    else {
      if (!role.includes(user.role)) return res.status(403).send({ error: 'No permisions' })
    }

    return next()
  }
}