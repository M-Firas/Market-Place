import * as CustomError from '../errors/index.js';
import { isTokenValid } from "../utils/jwt.js";

export const authenticateUser = async (req, res, next) => {
    let token;
    // check header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer')) {
        token = authHeader.split(' ')[1];
    }
    // check cookies
    else if (req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        throw new CustomError.UnauthenticatedError('Authentication invalid');
    }
    try {
        const payload = isTokenValid(token);

        // Attach the user and his permissions to the req object
        req.user = {
            userId: payload.user.userId,
        };

        next();
    } catch (error) {
        throw new CustomError.UnauthenticatedError('Authentication invalid');
    }
};