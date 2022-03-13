import { JwtObject } from "./types";
import jwt from 'jsonwebtoken';


export function signJwt(obj: JwtObject):string{
    return jwt.sign(obj, getJwtSecret(),{
        expiresIn: '7d'
    });
}

export function verifyJwt(token: string): JwtObject {
    return jwt.verify(token, getJwtSecret()) as JwtObject;
}

// Throws on bad tokens
function getJwtSecret(): string{
    const secret = process.env.JWT_SECRET;
    if(!secret){
        console.error('Missing JWT secret');
        process.exit(1);
    }
    return secret!;
}