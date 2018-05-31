/**
 * CurrentUser Model
 */
export interface CurrentUser {
    name: string;
    uuid: string;
    platform: string;
    username: string;
    phone: string;
    level: number;
    ddd: string;
    cid: number;
    iam: number;
    plan: string;
    accessToken: string;
    apikey: string;
    privatekey: string;
    token_user: string;
    permisos: Object;
    rol: string;
    contact: string;
    ormiggaPro: boolean;
    user_uuid: string;
}

/**
 * User Model
 */
export interface User {
    from: string;
    data: UserData;
    at: string;
    token: string;
    track: number;
}

/**
 * UserData Model
 */
export interface UserData {
    username: string;
    password: string;
    platform: string;
}  