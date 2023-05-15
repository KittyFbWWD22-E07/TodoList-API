import jwt from 'jsonwebtoken';
import { promisify } from 'util';

export const createToken = async (payload, secretMessage) => {
    const asyncSign = promisify(jwt.sign);
    return await asyncSign(
        payload,
        secretMessage,
        {
            expiresIn: '1d'
        })
}

export const verifyToken = async (token, secretMessage) => {
    const asyncVerify = promisify(jwt.verify);
    return await asyncVerify(token, secretMessage);
}