import db from './db.js';
import bcrypt from 'bcrypt';

// =========================
// CREATE USER
// =========================
const createUser = async (name, email, passwordHash) => {
    const query = `
        INSERT INTO users (
            name,
            email,
            password_hash,
            role_id
        )
        VALUES (
            $1,
            $2,
            $3,
            (SELECT role_id FROM roles WHERE role_name = 'user')
        )
        RETURNING user_id, name, email
    `;

    const result = await db.query(query, [
        name,
        email,
        passwordHash
    ]);

    return result.rows[0];
};

// =========================
// FIND USER BY EMAIL
// =========================
const findUserByEmail = async (email) => {
    const result = await db.query(
        `
        SELECT
            u.user_id,
            u.name,
            u.email,
            u.password_hash,
            r.role_name
        FROM users u
        JOIN roles r
            ON u.role_id = r.role_id
        WHERE u.email = $1
        `,
        [email]
    );

    return result.rows[0] || null;
};

// =========================
// VERIFY PASSWORD
// =========================
const verifyPassword = async (password, passwordHash) => {
    return await bcrypt.compare(password, passwordHash);
};

// =========================
// AUTHENTICATE USER (LOGIN)
// =========================
const authenticateUser = async (email, password) => {
    const user = await findUserByEmail(email);

    if (!user) return null;

    const isMatch = await verifyPassword(password, user.password_hash);

    if (!isMatch) return null;

    // remove password before returning user
    const { password_hash, ...safeUser } = user;

    return safeUser;
};

// =========================
// GET ALL USERS (ADMIN PAGE)
// =========================
const getAllUsers = async () => {
    const result = await db.query(`
        SELECT
            u.user_id,
            u.name,
            u.email,
            r.role_name
        FROM users u
        JOIN roles r
            ON u.role_id = r.role_id
        ORDER BY u.user_id
    `);

    return result.rows;
};

// =========================
// EXPORTS
// =========================
export {
    createUser,
    authenticateUser,
    getAllUsers
};