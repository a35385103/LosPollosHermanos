// src/menu.ts
import express from 'express';
import connection from './ConnectToDB.ts';

const mRouter = express.Router();

/**
 * GET /api/menu/getAll
 * 取得所有菜單項目
 */
mRouter.get('/getAll', (req, res) => {
    const sql = `
        SELECT id, name, category, price, description, available, created_at
        FROM menu
        ORDER BY id ASC
    `;

    connection.query(sql, (err, results) => {
        if (err) {
            console.error("MySQL error (GET /menu/getAll):", err);
            return res
                .status(500)
                .json({ success: false, error: "Database error while fetching menu items" });
        }

        res.json(results);
    });
});

/**
 * POST /api/menu/add
 * 新增一筆菜單資料
 */
mRouter.post('/add', (req, res) => {
    console.log("received menu data:", req.body);

    const { name, category, price, description, available } = req.body;

    if (!name || price === undefined || price === null || isNaN(Number(price))) {
        return res
            .status(400)
            .json({ success: false, error: "Name and price are required" });
    }

    const sql = `
        INSERT INTO menu (name, category, price, description, available)
        VALUES (?, ?, ?, ?, ?)
    `;

    const params = [
        name,
        category || null,
        Number(price),
        description || null,
        (available === 0 || available === "0") ? 0 : 1
    ];

    connection.query(sql, params, (err, result) => {
        if (err) {
            console.error("MySQL error (POST /menu/add):", err);
            return res
                .status(500)
                .json({ success: false, error: "Database error while adding menu item" });
        }

        res.json({ success: true, id: (result as any).insertId });
    });
});

export default mRouter;
