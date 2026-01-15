import { pool } from '../config/dbConfig.js';

export async function getSwipe(req, res, next) {

    const { distanceLimitKm } = req.body;
    try {
        const [users] = await pool.query(`
                SELECT id, username, full_name, birth_date, gender, bio, ST_Distance_Sphere(coords, ST_GeomFromText(?)) AS distance 
                FROM users 
                WHERE ST_Distance_Sphere(coords, ST_GeomFromText(?)) <= ?`, [req.user.coords, req.user.coords, distanceLimitKm * 1000]);
        const [existingSwipes] = await pool.query('SELECT receiver_id FROM swipes WHERE sender_id = ?', [req.user.id]);
        const swipedUserIds = existingSwipes.map(swipe => swipe.receiver_id);
        
        // Filter out current user and already swiped users
        const availableUsers = users.filter(user => 
            user.id !== req.user.id && !swipedUserIds.includes(user.id)
        );
        
        if (availableUsers.length === 0) {
            return res.status(200).json({ user: null });
        }
        
        const randomIndex = Math.floor(Math.random() * availableUsers.length);
        const randomUser = availableUsers[randomIndex];
        
        res.status(200).json({ user: randomUser });
    }
    catch (error) {
        next(error);
    }
}