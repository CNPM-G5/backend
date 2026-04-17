const pool = require("../config/db");

const findUserIdByEmail = async (email) => {
    const result = await pool.query(
        "SELECT id FROM users WHERE email = $1",
        [email]
    );

    return result.rows[0] || null;
};

const createUser = async ({ name, email, hashedPassword }) => {
    const result = await pool.query(
        `INSERT INTO users (name, email, password)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, role, created_at`,
        [name, email, hashedPassword]
    );

    return result.rows[0] || null;
};

const findUserByEmailWithPassword = async (email) => {
    const result = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );

    return result.rows[0] || null;
};

const findProfileById = async (userId) => {
    const result = await pool.query(
        "SELECT id, name, email, role, avatar_url, created_at FROM users WHERE id = $1",
        [userId]
    );

    return {
        user: result.rows[0] || null
    };
};

const findPasswordHashByUserId = async (userId) => {
    const user = await pool.query(
        "SELECT password FROM users WHERE id = $1",
        [userId]
    );

    return user.rows[0] || null;
};

const updatePasswordByUserId = async ({ userId, hashedPassword }) => {
    await pool.query(
        "UPDATE users SET password = $1 WHERE id = $2",
        [hashedPassword, userId]
    );
};

const updateProfileNameByUserId = async ({ userId, name }) => {
    const result = await pool.query(
        "UPDATE users SET name = $1 WHERE id = $2 RETURNING id, name, email, avatar_url",
        [name, userId]
    );

    return result.rows[0] || null;
};

const updateAvatarByUserId = async ({ userId, avatarUrl }) => {
    const { rows } = await pool.query(
        "UPDATE users SET avatar_url = $1 WHERE id = $2 RETURNING id, name, email, avatar_url",
        [avatarUrl, userId]
    );

    return rows[0] || null;
};

module.exports = {
    findUserIdByEmail,
    createUser,
    findUserByEmailWithPassword,
    findProfileById,
    findPasswordHashByUserId,
    updatePasswordByUserId,
    updateProfileNameByUserId,
    updateAvatarByUserId,
};