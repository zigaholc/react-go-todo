package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

type Todo struct {
	ID    int    `json:"id"`
	Title string `json:"title"`
	Done  bool   `json:"done"`
	Body  string `json:"body"`
}

func main() {

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3000",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	// Create a new slice of todos
	todos := []Todo{}

	// Check if the api is working
	app.Get("/healthcheck", func(c *fiber.Ctx) error {
		return c.SendString("OK")
	})

	// Handle the POST method ( create new todo )
	app.Post("/api/todos", func(c *fiber.Ctx) error {
		todo := &Todo{}

		if err := c.BodyParser(todo); err != nil {
			return err
		}

		// Create an ID for the new todo
		todo.ID = len(todos) + 1

		// Append the new todo to the existing todos slice
		todos = append(todos, *todo)

		// Return all todos
		return c.JSON(todos)

	})

	// Handle the PATCH method ( set the DONE parameter )
	app.Patch("/api/todos/:id/done", func(c *fiber.Ctx) error {
		// Get the ID passed in the URL
		id, err := c.ParamsInt("id")

		if err != nil {
			return c.Status(401).SendString("Invalid ID!")
		}

		// Loop through all todos
		for index, todo := range todos {
			// If the ID matches the passed ID set the DONE parameter
			for todo.ID == id {
				todos[index].Done = true
				break // exit the for loop
			}
		}
		// Return all todos
		return c.JSON(todos)
	})

	// Handle the GET method ( return all todos )
	app.Get("/api/todos", func(c *fiber.Ctx) error {
		return c.JSON(todos)
	})

	log.Fatal(app.Listen(":4000"))
}
