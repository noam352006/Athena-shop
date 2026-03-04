import { Injectable } from "@angular/core";
import { AuthStore } from "./auth.store";
import { User } from "../../intrefaces/user";
import { AuthQuery } from "./auth.query";
import { ShoeItem } from "../../intrefaces/shoeItem";
import { partialUser } from "../../intrefaces/partialUser";

@Injectable({ providedIn: 'root' })
export class AuthService {
    constructor(private store: AuthStore, private authQuery: AuthQuery) { }

    logIn(user: partialUser): void {
        this.store.update({ connectedUser: user });
    }

    logOut(): void {
        this.store.update({ connectedUser: undefined });
    }

    purchase(newShoe: ShoeItem): void {}
        /*this.store.update(state => {
            const user = state.connectedUser;
            if (!user) {
                return {};
            }

            const newHistory = [
                ...(user.purchaseHistory ?? []),
                newShoe
            ];

            return {
                connectedUser: {
                    ...user,
                    purchaseHistory: newHistory
                }
            };
        });
    }*/
}