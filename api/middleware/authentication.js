import * as CustomError from '../errors/index.js';
import { isTokenValid } from "../utils/jwt.js";

const authenticateUser = async (req, res, next) => {
    const token = req.signedCookies.token;

    //checking if the token exists
    if (!token) {
        throw new CustomError.UnauthenticatedError('Authentication Invalid')
    }

    //authenticating the user
    try {
        const { username, userId, email, avatar } = isTokenValid({ token })
        req.user = { username, userId, email, avatar };
        next()
    } catch (error) {
        throw new CustomError.UnauthenticatedError('Authentication Invalid')
    }
}

export {
    authenticateUser
}