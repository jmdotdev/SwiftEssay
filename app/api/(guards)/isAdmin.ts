import jwt from "jsonwebtoken";

export default function isAdmin(token: string): boolean {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: string;
        role: string;
    };
    if (decoded.role !== 'admin') {
        return false;
    }
    return true;
}