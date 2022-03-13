import { User } from "./types";

export function saveUserInfo(user:User):void{
    localStorage.setItem('userId',user.id);
}

export function getUserId():string{
    return localStorage.getItem('userId')!;
}