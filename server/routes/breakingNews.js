import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

// Import database configuration based on DB_TYPE
const dbType = process.env.DB_TYPE || 'sqlite';
const { query } = dbType === 'sqlite'
    ? await import('../config/database-sqlite.js')
    : await import('../config/database.js');

const router = express.Router();

// Get active breaking news (public)
router.get('/', async (req, res) => {
    try {
        const result = await query('SELECT * FROM breaking_news WHERE is_active = 1 ORDER BY created_at DESC');
        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Error fetching breaking news:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch breaking news' });
    }
});

// Create/Update breaking news (admin)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { content, is_active } = req.body;

        if (!content) {
            return res.status(400).json({ success: false, message: 'Content is required' });
        }

        const result = await query(
            'INSERT INTO breaking_news (content, is_active, created_at, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)',
            [content, is_active ? 1 : 0]
        );

        res.json({
            success: true,
            data: {
                id: result.lastID,
                content,
                is_active: is_active ? 1 : 0
            },
            message: 'Breaking news updated successfully'
        });
    } catch (error) {
        console.error('Error updating breaking news:', error);
        res.status(500).json({ success: false, message: 'Failed to update breaking news' });
    }
});

// Get all breaking news history (admin)
router.get('/history', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const result = await query('SELECT * FROM breaking_news ORDER BY created_at DESC');
        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Error fetching breaking news history:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch history' });
    }
});

// Delete breaking news (admin)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        await query('DELETE FROM breaking_news WHERE id = ?', [id]);
        res.json({ success: true, message: 'Breaking news deleted successfully' });
    } catch (error) {
        console.error('Error deleting breaking news:', error);
        res.status(500).json({ success: false, message: 'Failed to delete breaking news' });
    }
});

export default router;
