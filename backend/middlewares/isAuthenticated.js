import jwt from "jsonwebtoken";

//for the user to access protected routes , we will use this middleware to pass it with each request to verify it its a valid authenticated user or not.
const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized, Please login to access this resource",
                success: false
            });
        }

        const decode = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (!decode) {
            return res.status(401).json({
                message: "Invalid token, Please login to access this resource",
                success: false
            });
        };
        // to decode the role and attach it to the request context
        req.userId = decode.userId;
        req.role = decode.role;
        next();
        // the next callback function passes the ressult or acknowledge when everything is in place 

    } catch (error) {
        console.log(error);
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "token_expired",
                success: false
            });
        }
        return res.status(401).json({
            message: "Invalid token, Authorization failed",
            success: false
        });
    }
}
export default isAuthenticated;