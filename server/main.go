package main

import (
	"fiber-mongo-api/configs"
	"fiber-mongo-api/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	app := fiber.New()

	//run database
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:5173", // Allow requests from this origin
		AllowMethods:     "GET,POST,PUT,DELETE",
		AllowHeaders:     "Origin, Content-Type, Accept",
		AllowCredentials: false,
	}))

	configs.ConnectDB()
	routes.UserRoute(app)
	app.Listen(":8080")
}
