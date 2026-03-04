import { UserRole } from "../enums/userRole.enum";
import { User } from "../intrefaces/user";

const moment = require('moment');

export const usersList: User[] = [
    {
        id: "fgif",
        userName: "noco",
        password: "123456",
        role: UserRole.Manager,
        dateCreated: moment('2024-03-12T08:17:45.321Z'),
        purchaseHistory: [],
    },
    {
        id: "jkghslsgiahy8y753-pq",
        userName: "AlonHagever",
        password: "123123",
        role: UserRole.Client,
        dateCreated: moment('2024-03-12T08:17:45.321Z'),
        purchaseHistory: [],
    },
    {
        id: "fgif",
        userName: "mk",
        password: "111111",
        role: UserRole.Manager,
        dateCreated:moment('2024-03-12T08:17:45.321Z'),
        purchaseHistory: [],
    },
];

