import { Store, StoreConfig } from "@datorama/akita";
import { User } from "../../intrefaces/user";
import { Injectable } from "@angular/core";

export interface AuthState {
    connectedUser: User | undefined
}

export function createIntialState(): AuthState {
    const savedUser = localStorage.getItem("connectedUser");
    const user = savedUser ? JSON.parse(savedUser) : undefined;

    return {
        connectedUser: user
    };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'connectedUser' })
export class AuthStore extends Store<AuthState> {
    constructor() {
        super(createIntialState());
    }
}