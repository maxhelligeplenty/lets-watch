import { UserInterface } from './user.interface';

export interface Message
{
    from?:UserInterface;
    content?:string;
}