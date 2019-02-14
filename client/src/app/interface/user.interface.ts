export interface UserInterface {
    id?: string;
    name?: string;
    avatar?: string;
    role?:string;
    status?:string;
}

export enum UserEnum
{
    JOINED = 'JOINED',
    JOINING = 'JOINING',
    SEEKING = 'SEEKING'
}