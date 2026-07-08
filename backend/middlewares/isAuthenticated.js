import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized, Please login to access this resource",
                success: false
            });
        }

        const decode = await jwt.verify(token, process.env.SECRET_KEY); //JWT seceret key is used to verify the token
        if (!decode) {
            return res.status(401).json({
                message: "Invalid token, Please login to access this resource",
                success: false
            });
        };
        req.userId = decode.userId; // we are storing the user id in the request object so that we can use it in the next middleware or controller
        next(); // we are calling the next middleware or controller
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            message: "Invalid token, Authorization failed",
            success: false
        });
    }
}
export default isAuthenticated;