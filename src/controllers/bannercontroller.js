const db = require("../config/db");

const bannerController = {
    create_banner: async (req, res) => {
        try {
            const [result] = await db.promise().query("INSERT INTO banner (image) VALUES (?)", [image]);
            return res.status(200).json({
                status: true,
                message: "Banner created successfully",
                banner: result,
            });
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: "Database error",
                error: error.message,
            });
        }
    },
};

module.exports = bannerController;