const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader){
            return res.status(401).json({ message: 'Access Denied: No or invalid token format' });
        }
        token = authHeader.split(' ')[1];
        const decode = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decode.user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

module.exports = authMiddleware;