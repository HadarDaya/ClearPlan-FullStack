/**
 * This file provides helper functions to manage JWT-based authentication on the client side.
 * It includes utilities to:
 * - Extract the current username and user ID from the JWT token stored in localStorage.
 * - Check if the user is authenticated by validating token presence and expiration.
 * - Log out the user by removing the stored token.
 */
import { jwtDecode } from "jwt-decode";

// Define the expected shape of the JWT payload
interface JwtPayload {
    curUserName?: string;
    curUserId?: string;
    exp?: number; // expiration timestamp
}

/**
 * Extracts the username from the JWT token stored in localStorage.
 * @returns The username if found and valid, otherwise null.
 */
export function getUserNameFromToken(): string | null {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const decoded = jwtDecode<JwtPayload>(token);
        return decoded.curUserName ?? null;
    } catch (error) {
        console.error("Invalid token:", error);
        return null;
    }
}

/**
 * Extracts the user ID from the JWT token stored in localStorage.
 * @returns The user ID if found and valid, otherwise null.
 */
export function getUserIdFromToken(): string | null {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const decoded = jwtDecode<JwtPayload>(token);
        return decoded.curUserId ?? null;
    } catch (error) {
        console.error("Invalid token:", error);
        return null;
    }
}

/**
 * Logs the user out by removing the JWT token from localStorage.
 */
export function logout(): void {
    localStorage.removeItem("token");
}