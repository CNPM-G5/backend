const authService = require("../services/auth.service");

function handleError(res, err) {
    const status = err.status || 500;
    return res.status(status).json({
        message: err.message || "Lỗi server",
    });
}

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const result = await authService.register({ name, email, password });
        return res.status(201).json(result);
    } catch (err) {
        return handleError(res, err);
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login({ email, password });
        return res.json(result);
    } catch (err) {
        return handleError(res, err);
    }
};

const getProfile = async (req, res) => {
    try {
        const result = await authService.getProfile(req.user.id);
        return res.json(result);
    } catch (err) {
        return handleError(res, err);
    }
};

const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const result = await authService.changePassword({
            userId: req.user.id,
            oldPassword,
            newPassword,
        });
        return res.json(result);
    } catch (err) {
        return handleError(res, err);
    }
};

const updateProfile = async (req, res) => {
    try {
        const { name } = req.body;
        const result = await authService.updateProfile({
            userId: req.user.id,
            name,
        });
        return res.json(result);
    } catch (err) {
        return handleError(res, err);
    }
};

const updateAvatar = async (req, res) => {
    try {
        const { avatar_url } = req.body;
        const result = await authService.updateAvatar({
            userId: req.user.id,
            avatarUrl: avatar_url,
        });
        return res.json(result);
    } catch (err) {
        return handleError(res, err);
    }
};

const uploadAvatar = async (req, res) => {
    try {
        const file = req.file || req.files?.[0];
        const result = await authService.uploadAvatar({
            userId: req.user.id,
            filePath: file?.path,
        });
        return res.json(result);
    } catch (err) {
        return handleError(res, err);
    }
};

module.exports = {
    register,
    login,
    getProfile,
    changePassword,
    updateProfile,
    updateAvatar,
    uploadAvatar,
};