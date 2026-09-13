const { pool, secret } = require('../config');
const jwt = require("jsonwebtoken");



const verifyToken = async (req, res, next) => {
    try {
        //const authorization = req.headers["x-access-token"];
        const { authorization } = req.headers;
        console.log('AUTHORIZATION:',authorization);
        if (!authorization) {
            return res.status(409).json({ message: "no token provided" });
        }
        //const token = authorization.split(" ")[1];
        const token = authorization;
        
        const decoded = jwt.verify(token, secret.SECRET);
        const dniUser = decoded.dni;
        //console.log(token);
        const user = await pool.query(`select * from usuarios where dni=$1`, [dniUser]);

        //console.log(user.rows[0])

        if (user.rowCount == 0) {
            return res.status(403).json({ message: "invalid token, user not found" });
        } 
        
        next();

    } catch (error) {
        return res.status(404).json({ message: "Unauthorized" });
    }
}


/* 
const verifyToken = async (req, res, next) => {
    try {
        //const token = req.headers["x-access-token"];
        const { authorization } = req.headers;
        console.log(authorization)
        if (!authorization) {
            return res.status(402).json({ message: "no token provided" });
        }
        const token = authorization.split(" ")[1];
        const decoded = jwt.verify(token, secret.SECRET);
        const dniUser = decoded.dni;
        const user = await pool.query('select * from usuarios where dni=$1', [dniUser]);

        //console.log(user.rows[0])

        if (user.rowCount == 0) {
            return res.status(403).json({ message: "invalid token, user not found" });
        } else {
            next();
        }

    } catch (error) {
        return res.status(404).json({ message: "Unauthorized" });
    }
}
 */




module.exports = {
    verifyToken
}



