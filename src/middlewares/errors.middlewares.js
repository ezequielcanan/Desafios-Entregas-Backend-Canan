import EErrors from "../errors/enums.js"

export default (error, req, res, next) => {
  req.logger.error("Error: " + error)

  switch (error.code) {
    case EErrors.INVALID_TYPES_ERROR:
      return res.status(400).json({ status: "error", error: error.name, cause: error.cause })
      break

    default:
      res.status(500).json({ status: 'error', error: 'Unhandled error' })
      break;
  }


}