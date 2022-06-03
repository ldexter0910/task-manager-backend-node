const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const auth = async (req, res, next) => {
    try {
        const token = req.headers('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, 'thisismypractise');
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
        if (!user) {
            throw new Error();
        }
        req.user = user;
        req.token = token;
        next();
    } catch (e) {
        res.status(401).send({ error: new Error('Please authenticate.') });
    }
}

module.exports = exports = auth;