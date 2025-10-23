const db = require("../config/db");
const multer = require("multer");
const path = require("path");

const categoryController = {
    async create_category(req, res) {
        try {
            // Define multer storage
            const storage = multer.diskStorage({
                destination: (req, file, cb) => {
                    cb(null, "../src/public/categories"); // save in folder
                },
                filename: (req, file, cb) => {
                    const ext = path.extname(file.originalname);
                    cb(null, Date.now() + ext); // unique filename
                },
            });
            const upload = multer({ storage }).single("category_image");
            // Call upload
            upload(req, res, async function (err) {
                if (err) {
                    return res.status(400).json({
                        status: false,
                        message: "Image upload failed",
                        error: err.message,
                    });
                }
                try {
                    // Now req.body is available (after Multer processed)
                    const { category_name } = req.body;
                    if (!category_name) {
                        return res.status(400).json({
                            status: false,
                            message: "Category name is required",
                        });
                    }
                    let cat_image = null;
                    if (req.file) {
                        cat_image = `${req.file.filename}`;
                    }
                    const [result] = await db.promise().query(
                        "INSERT INTO category (category_name, category_image) VALUES (?, ?)",
                        [category_name, cat_image]
                    );
                    return res.status(200).json({
                        status: true,
                        message: "Category created successfully",
                        insert_category: result.insertId,
                    });
                } catch (error) {
                    return res.status(500).json({
                        status: false,
                        message: "Database error",
                        error: error.message,
                    });
                }
            });
        } catch (err) {
            return res.status(500).json({
                status: false,
                message: "Server error",
                error: err.message,
            });
        }
    },
    async fetch_category(req, res) {
        try {
            const [result] = await db.promise().query("SELECT * FROM category");
            return res.status(200).json({
                status: true,
                message: "Category fetched successfully",
                categories: result,
            });
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: "Database error",
                error: error.message,
            });
        }
    },
    async edit_category(req, res) {
        try {
            const id = req.params.id;
            const [result] = await db.promise().query("SELECT * FROM category WHERE id = ?", [id]);
            if (result.length > 0) {
                return res.status(200).json({
                    status: true,
                    message: "Category fetched successfully",
                    categories: result,
                });
            } else {
                return res.status(401).json({
                    status: false,
                    message: "Category Doesn't exist",
                    categories: result,
                });
            }

        } catch (err) {
            return res.status(500).json({
                status: false,
                message: "Database error",
                error: err.message,
            });
        }
    },
    async update_category(req, res) {
        try {
            let cat_image = null;
            const storage = multer.diskStorage({
                destination: (req, file, cb) => {
                    cb(null, '../src/public/categories');
                },
                filename: (req, file, cb) => {
                    const ext = path.extname(file.originalname);
                    cb(null, Date.now() + ext);
                }
            });

            const upload = multer({ storage }).single('category_image');
            upload(req, res, async function (err) {
                if (err) {
                    return res.status(400).json({
                        status: false,
                        message: "Image upload failed",
                        error: err.message,
                    });
                }
                if (req.file) {
                    cat_image = `${req.file.filename}`;
                }
                try {
                    const id = req.params.id;
                    const { category_name } = req.body;
                    if (!cat_image) {
                        const [result] = await db.promise().query("UPDATE category SET category_name = ? WHERE id = ?", [category_name, id]);
                        return res.status(200).json({
                            status: true,
                            message: "Category updated successfully",
                            categories: result.affectedRows,
                        });
                    } else {
                        const [result] = await db.promise().query("UPDATE category SET category_name = ?, category_image = ? WHERE id = ?", [category_name, cat_image, id]);
                        return res.status(200).json({
                            status: true,
                            message: "Category updated successfully",
                            categories: result.affectedRows,
                        });
                    }
                } catch (err) {
                    return res.status(500).json({
                        status: false,
                        message: "failed to save the image",
                        error: err.message,
                    });
                }
            });
        } catch (err) {
            return res.status(500).json({
                status: false,
                message: "Database error",
                error: err.message,
            });
        }
    },
    async delete_category(req, res) {
        try {
            const id = req.params.id;
            const [result] = await db.promise().query("DELETE FROM category WHERE id = ?", [id]);
            return res.status(200).json({
                status: true,
                message: "Category deleted successfully",
                categories: result.affectedRows,
            });
        } catch (err) {
            return res.status(500).json({
                status: false,
                message: "Database error",
                error: err.message,
            });
        }
    }
};

module.exports = categoryController;
