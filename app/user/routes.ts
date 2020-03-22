import express from "express";
import {
    Login as LoginController,
    Signup as SignupController,
    Logout as LogoutController,
    Grant as GrantController,
    Revoke as RevokeController,
    Permissions as PermissionsController,
    Role as RoleController,
    Roles as RolesController
} from "./controllers";

const router: express.Router = express.Router();

router.post("/signup", SignupController);
router.post("/login", LoginController);
router.post("/logout", LogoutController);
router.post("/grant", GrantController);
router.post("/revoke", RevokeController)
router.get("/permissions", PermissionsController)
router.get("/role", RoleController)
router.get("/roles", RolesController); 

export default router;