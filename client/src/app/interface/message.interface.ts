import { UserInterface } from './user.interface';
import { Action } from './action.interface';

export interface Message
{
    from?:UserInterface;
    content?:string;
    action?:Action;
}