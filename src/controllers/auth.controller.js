const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

// ================= REGISTER =================
const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            message: "Vui lòng điền đầy đủ thông tin"
        });
    }

    try {
        const existing = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [email]
        );

        if (existing.rows.length > 0) {
            return res.status(409).json({
                message: "Email đã được sử dụng"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO users (name, email, password) 
             VALUES ($1, $2, $3) 
             RETURNING id, name, email, role, created_at`,
            [name, email, hashedPassword]
        );

        const user = result.rows[0];

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({
            message: "Đăng ký thành công",
            token,
            user
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi server" });
    }
};

// ================= LOGIN =================
const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Vui lòng nhập email và password"
        });
    }

    try {
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                message: "Email hoặc mật khẩu không đúng"
            });
        }

        const user = result.rows[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Email hoặc mật khẩu không đúng"
            });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            message: "Đăng nhập thành công",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi server" });
    }
};

// ================= PROFILE =================
const getProfile = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT id, name, email, role, created_at FROM users WHERE id = $1",
            [req.user.id]
        );

        res.json({
            user: result.rows[0]
        });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server" });
    }
};

// ================= CHANGE PASSWORD =================
const changePassword = async (req, res) => {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    try {
        const user = await pool.query(
            "SELECT password FROM users WHERE id=$1",
            [userId]
        );

        if (user.rows.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy người dùng" });
        }

        const validPassword = await bcrypt.compare(
            oldPassword,
            user.rows[0].password
        );

        if (!validPassword) {
            return res.status(400).json({ message: "Mật khẩu cũ không đúng" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await pool.query(
            "UPDATE users SET password=$1 WHERE id=$2",
            [hashedPassword, userId]
        );

        res.json({
            message: "Đổi mật khẩu thành công"
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    register,
    login,
    getProfile
};