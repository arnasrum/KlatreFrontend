
interface User {
    id: number,
    name: string,
    email: string,
    access_token?: string,
}

type UserRole = {
    id: number,
    name: string,
    email: string,
    isAdmin: boolean,
    isOwner: boolean,
}

export {User, UserRole}