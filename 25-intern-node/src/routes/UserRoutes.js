const routes =require("express").Router()
const userController =require("../controllers/UserController")
routes.get("/alluser",userController.getAlluser)
routes.post("/user/login",userController.loginUser)
routes.post("/user",userController.signup)
routes.post("/addpic",userController.addUserWithFile)
// routes.post("/adduser",userController.addUser)
routes.delete("/user/:id",userController.deleteUser)
routes.get("/userbyid/:id",userController.getUserById)
routes.put("/updateduser/:id",userController.getUserByIdandUpdate)
routes.put("/updateuserphoto/:id", userController.updateUserPhoto);
routes.post("/user/resetpassword",userController.resetpassword)
routes.post("/user/forgotpassword",userController.forgotPassword);


// Add these new routes to your existing UserRoutes.js

// Get user's health insights
routes.get("/:userId/health-insights", userController.getUserHealthInsights);

// Get unread insights count
routes.get("/:userId/health-insights/unread-count", userController.getUnreadInsightsCount);



module.exports = routes
