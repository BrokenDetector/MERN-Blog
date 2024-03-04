import express from "express";
import * as commentController from "../controllers/commentController";
import * as postController from "../controllers/postController";
import * as userController from "../controllers/userController";
const router = express.Router();

// User
router.post("/check-auth", userController.verify_token, userController.get_user);

router.post("/sign-up", userController.create_user);

router.post("/sign-in", userController.login);

router.get("/users", userController.verify_token, userController.get_users);

router.post("/update-user/", userController.verify_token, userController.update_user);

router.post("/delete-user/:id", userController.verify_token, userController.delete_user);

// Posts
router.get("/posts", postController.get_posts);

router.get("/post/:slug", postController.get_post);

router.post("/create-post", userController.verify_token, postController.create_post);

router.post("/update-post/:id", userController.verify_token, postController.update_post);

router.post("/delete-post/:id", userController.verify_token, postController.delete_post);

// Comments
router.get("/comments", userController.verify_token, commentController.get_comments);

router.get("/get-comments/:id", commentController.get_post_comments);

router.post("/create-comment", userController.verify_token, commentController.create_comment);

router.post("/update-comment/:id", userController.verify_token, commentController.update_comment);

router.post("/delete-comment/:id", userController.verify_token, commentController.delete_comment);

export default router;
