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

export async function sendSwipe(req, res, next) {
    const { receiverId, type } = req.body;
    const types = ['like', 'dislike', 'superlike'];
    try{
        if (!types.includes(type)) {
            return res.status(400).json({ message: 'Invalid swipe type' });
        }
        await pool.query('INSERT INTO swipes (sender_id, receiver_id, type) VALUES (?, ?, ?)', [req.user.id, receiverId, type]);
        const [mutualLike] = await pool.query('SELECT * FROM swipes WHERE sender_id = ? AND receiver_id = ? AND (type = "like" OR type = "superlike")', [receiverId, req.user.id]);
        if ((type === 'like' || type === 'superlike') && mutualLike.length > 0) {
            await pool.query('INSERT INTO matches (user_one_id, user_two_id) VALUES (?, ?)', [Math.min(req.user.id, receiverId), Math.max(req.user.id, receiverId)]);
            return res.status(200).json({ message: 'It\'s a match!' });
        }
        res.status(200).json({ message: 'Swipe recorded successfully' });
    }
    catch (error) {
        next(error);
    }
}