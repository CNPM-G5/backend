const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authRepo = require("../Repositories/auth.repository");

function appError(status, message) {
    const err = new Error(message);
    err.status = status;
    return err;
}

function validateGmail(email) {
    return typeof email === "string" && email.toLowerCase().endsWith("@gmail.com");
}

const register = async ({ name, email, password }) => {
    if (!name || !email || !password) {
        throw appError(400, "Vui lòng điền đầy đủ thông tin");
    }

    if (!validateGmail(email)) {
        throw appError(400, "Email phải có định dạng @gmail.com");
    }

    const existing = await authRepo.findUserIdByEmail(email);

    if (existing) {
        throw appError(409, "Email đã được sử dụng");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await authRepo.createUser({ name, email, hashedPassword });

    const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    return {
        message: "Đăng ký thành công",
        token,
        user
    };
};

const login = async ({ email, password }) => {
    if (!email || !password) {
        throw appError(400, "Vui lòng nhập email và password");
    }

    if (!validateGmail(email)) {
        throw appError(400, "Email phải có định dạng @gmail.com");
    }

    const user = await authRepo.findUserByEmailWithPassword(email);

    if (!user) {
        throw appError(401, "Email hoặc mật khẩu không đúng");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw appError(401, "Email hoặc mật khẩu không đúng");
    }

    const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    return {
        message: "Đăng nhập thành công",
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
};

const getProfile = async (userId) => {
    return await authRepo.findProfileById(userId);
};

const changePassword = async ({ userId, oldPassword, newPassword }) => {
    const user = await authRepo.findPasswordHashByUserId(userId);

    if (!user) {
        throw appError(404, "Không tìm thấy người dùng");
    }

    const validPassword = await bcrypt.compare(oldPassword, user.password);
    if (!validPassword) {
        throw appError(400, "Mật khẩu cũ không đúng");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await authRepo.updatePasswordByUserId({ userId, hashedPassword });

    return { message: "Đổi mật khẩu thành công" };
};

const updateProfile = async ({ userId, name }) => {
    if (!name) {
        throw appError(400, "Name is required");
    }

    const user = await authRepo.updateProfileNameByUserId({ userId, name });

    return {
        message: "Profile updated",
        user,
    };
};

const updateAvatar = async ({ userId, avatarUrl }) => {
    if (!avatarUrl || !avatarUrl.trim()) {
        throw appError(400, "Invalid avatar URL");
    }

    const user = await authRepo.updateAvatarByUserId({ userId, avatarUrl });

    if (!user) {
        throw appError(404, "User not found");
    }

    return {
        message: "Avatar updated",
        user,
    };
};

const uploadAvatar = async ({ userId, filePath }) => {
    if (!filePath) {
        throw appError(400, "Upload failed");
    }

    const user = await authRepo.updateAvatarByUserId({ userId, avatarUrl: filePath });

    if (!user) {
        throw appError(404, "User not found");
    }

    return {
        message: "Upload avatar success",
        user,
    };
};

module.exports = {
    register,
    login,
    getProfile,
    changePassword,
    updateProfile,
    updateAvatar,
    uploadAvatar
};