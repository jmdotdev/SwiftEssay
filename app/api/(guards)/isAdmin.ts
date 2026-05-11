import jwt from "jsonwebtoken";

export default function isAdmin(token: string): { userId: string; role: string } | null {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
            userId: string;
            role: string;
        };
        if (decoded.role !== 'admin') {
            return null;
        }
        return decoded;
    } catch {
        return null;
    }
}