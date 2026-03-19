import { Store, StoreConfig } from "@datorama/akita";
import { Injectable } from "@angular/core";
import { partialUser } from "../../intrefaces/partialUser";

export interface AuthState {
    connectedUser?: partialUser
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