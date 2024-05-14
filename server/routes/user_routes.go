package routes

import (
	"fiber-mongo-api/controllers"

	"github.com/gofiber/fiber/v2"
)

func UserRoute(app *fiber.App) {
	app.Post("/user", controllers.CreateUser)
	app.Get("/user/:userId", controllers.GetAUser)
	app.Put("/user/:userId/addTransaction", controllers.AddTransaction)
	app.Put("/user/:userId/transactions/:transactionId", controllers.FindAndUpdateTransaction)
	app.Delete("/user/:userId/transactions/:transactionId/delete", controllers.DeleteTransaction)
}
