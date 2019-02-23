import bodyParser from "body-parser";
import express from "express";
import jwt from "jsonwebtoken";

import { connectToDatabase } from "./config/database";
import { appVariables } from "./config/app-variables";
import { headerProcessor } from './middlewares/header-processor';
import loginMiddleware from './middlewares/authentication';
import { userController } from "./controllers/user.controller";
import { authenticationController } from "./controllers/authentication.controller";
import { teamController } from './controllers/team.controller';
// Create connection to database
connectToDatabase();

// Create Express server
const app = express();
const router = express.Router();

app.set('port', process.env.PORT || appVariables.applicationPort);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => { headerProcessor(req, res, next); });

// app.use('/authentication', authenticationController(router));
app.use('/users', userController(router));
app.use('/teams', teamController(router));

// given token when login / validating email successfully
app.use(['/users/verification/:token', '/authentication/login'], loginMiddleware);


// Check for token
app.use(((req, res, next) => {
    const token = req.body.token || req.query.token || req.headers["x-access-token"];

    if (token) {
        jwt.verify(token, appVariables.secret, (error, decoded) => {
            if (error) {
                return res.json({ success: false, message: "Failed to authenticate token" });
            }

            req.decoded = decoded;
            next();
        });
    } else {
        return res.status(403).send({
            success: false,
            message: "No token provided."
        });
    }
}));

export default app;
