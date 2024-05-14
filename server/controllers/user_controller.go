package controllers

import (
	"context"
	"fiber-mongo-api/configs"
	"fiber-mongo-api/models"
	"fiber-mongo-api/responses"
	"net/http"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var userCollection *mongo.Collection = configs.GetCollection(configs.DB, "users")
var validate = validator.New()

func CreateUser(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	var user models.User
	defer cancel()

	//validate the request body
	if err := c.BodyParser(&user); err != nil {
		return c.Status(http.StatusBadRequest).JSON(responses.UserResponse{Status: http.StatusBadRequest, Message: "error", Data: &fiber.Map{"data": err.Error()}})
	}

	//use the validator library to validate required fields
	if validationErr := validate.Struct(&user); validationErr != nil {
		return c.Status(http.StatusBadRequest).JSON(responses.UserResponse{Status: http.StatusBadRequest, Message: "error", Data: &fiber.Map{"data": validationErr.Error()}})
	}

	newUser := models.User{
		Id:           primitive.NewObjectID(),
		Name:         user.Name,
		Balance:      user.Balance,
		TotalIncome:  user.TotalIncome,
		TotalExpense: user.TotalExpense,
		Transactions: user.Transactions,
		Expenses:     user.Expenses,
		Income:       user.Income,
	}
	_, err := userCollection.InsertOne(ctx, newUser)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(responses.UserResponse{Status: http.StatusInternalServerError, Message: "error", Data: &fiber.Map{"data": err.Error()}})
	}

	var createdUser models.User
	if err := userCollection.FindOne(ctx, bson.M{"id": newUser.Id}).Decode(&createdUser); err != nil {
		return c.Status(http.StatusInternalServerError).JSON(responses.UserResponse{Status: http.StatusInternalServerError, Message: "error", Data: &fiber.Map{"data": err.Error()}})
	}

	return c.Status(http.StatusCreated).JSON(responses.UserResponse{Status: http.StatusCreated, Message: "success", Data: &fiber.Map{"data": createdUser}})
}

func GetAUser(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	userId := c.Params("userId")
	var user models.User
	defer cancel()

	objId, _ := primitive.ObjectIDFromHex(userId)

	err := userCollection.FindOne(ctx, bson.M{"id": objId}).Decode(&user)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(responses.UserResponse{Status: http.StatusInternalServerError, Message: "error", Data: &fiber.Map{"data": err.Error()}})
	}

	return c.Status(http.StatusOK).JSON(responses.UserResponse{Status: http.StatusOK, Message: "success", Data: &fiber.Map{"data": user}})
}

func AddTransaction(c *fiber.Ctx) error {
	userID := c.Params("userId")
	if userID == "" {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "User ID is required"})
	}

	// Convert the user ID string to an ObjectID
	objID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Invalid User ID"})
	}

	// Find the user by ID
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var user models.User
	err = userCollection.FindOne(ctx, bson.M{"id": objID}).Decode(&user)
	if err != nil {
		return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
	}

	// Parse the transaction details from the request body
	var transaction models.Transaction
	if err := c.BodyParser(&transaction); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}
	transaction.Id = primitive.NewObjectID()
	// Add the transaction to the user's transactions
	switch transaction.TransactionStatus {
	case "paid":
		user.TotalExpense += transaction.Amount
		user.Balance -= transaction.Amount
		user.Transactions = append(user.Transactions, transaction)
		user.Expenses = append(user.Expenses, transaction)
	case "received":
		user.TotalIncome += transaction.Amount
		user.Balance += transaction.Amount
		user.Transactions = append(user.Transactions, transaction)
		user.Income = append(user.Income, transaction)
	default:
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Invalid transaction status"})
	}

	// Update the user in the database
	_, err = userCollection.UpdateOne(ctx, bson.M{"id": objID}, bson.M{"$set": user})
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update user"})
	}

	// Return the updated user
	return c.JSON(fiber.Map{
		"status":  http.StatusOK,
		"message": "success",
		"data":    user,
	})
}

func FindAndUpdateTransaction(c *fiber.Ctx) error {
	userID := c.Params("userId")
	if userID == "" {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "User ID is required"})
	}

	transactionID := c.Params("transactionId")
	if transactionID == "" {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Transaction ID is required"})
	}

	// Convert the user ID string to an ObjectID
	objUserID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Invalid User ID"})
	}

	// Convert the transaction ID string to an ObjectID
	objTransactionID, err := primitive.ObjectIDFromHex(transactionID)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Invalid Transaction ID"})
	}

	// Find the user by ID
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var user models.User
	err = userCollection.FindOne(ctx, bson.M{"id": objUserID}).Decode(&user)
	if err != nil {
		return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
	}

	// Find the transaction within the user's transactions
	var foundTransaction *models.Transaction
	for i, transaction := range user.Transactions {
		if transaction.Id == objTransactionID {
			foundTransaction = &user.Transactions[i]
			break
		}
	}

	if foundTransaction == nil {
		return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "Transaction not found"})
	}

	// Parse the updated transaction details from the request body
	var updatedTransaction models.Transaction
	if err := c.BodyParser(&updatedTransaction); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	updatedTransaction.Id = objTransactionID

	// Update the transaction status if it has changed
	if foundTransaction.TransactionStatus != updatedTransaction.TransactionStatus {
		switch updatedTransaction.TransactionStatus {
		case "paid":
			user.TotalIncome -= foundTransaction.Amount
			user.TotalExpense += (updatedTransaction.Amount)
			user.Balance -= (foundTransaction.Amount + updatedTransaction.Amount)

			for i, t := range user.Income {
				if t.Id == objTransactionID {
					user.Income = append(user.Income[:i], user.Income[i+1:]...)
					user.Expenses = append(user.Expenses, updatedTransaction)
					break
				}
			}

		case "received":
			user.TotalIncome += updatedTransaction.Amount
			user.TotalExpense -= foundTransaction.Amount
			user.Balance += (updatedTransaction.Amount + foundTransaction.Amount)

			for i, t := range user.Expenses {
				if t.Id == objTransactionID {
					user.Expenses = append(user.Expenses[:i], user.Expenses[i+1:]...)
					user.Income = append(user.Income, updatedTransaction)
					break
				}
			}

		default:
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Invalid transaction status"})
		}
	} else {
		switch updatedTransaction.TransactionStatus {
		case "paid":
			user.TotalExpense += (updatedTransaction.Amount - foundTransaction.Amount)
			user.Balance += (-updatedTransaction.Amount + foundTransaction.Amount)
			for i, t := range user.Income {
				if t.Id == objTransactionID {
					user.Expenses = append(user.Expenses[:i], user.Expenses[i+1:]...)
					user.Expenses = append(user.Expenses, updatedTransaction)
				}
			}

		case "received":
			user.TotalIncome += (updatedTransaction.Amount - foundTransaction.Amount)
			user.Balance = user.Balance + updatedTransaction.Amount - foundTransaction.Amount
			for i, t := range user.Income {
				if t.Id == objTransactionID {
					user.Income = append(user.Income[:i], user.Income[i+1:]...)
					user.Income = append(user.Income, updatedTransaction)
				}
			}
		default:
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Invalid transaction status"})
		}

	}
	foundTransaction.TransactionStatus = updatedTransaction.TransactionStatus
	foundTransaction.Date = updatedTransaction.Date
	foundTransaction.Name = updatedTransaction.Name
	foundTransaction.Amount = updatedTransaction.Amount

	// Update the user in the database
	_, err = userCollection.UpdateOne(ctx, bson.M{"id": objUserID}, bson.M{"$set": user})
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update user"})
	}

	// Return the updated transaction
	return c.JSON(fiber.Map{
		"status":  http.StatusOK,
		"message": "success",
		"data":    user,
	})
}

func DeleteTransaction(c *fiber.Ctx) error {
	userID := c.Params("userId")
	if userID == "" {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "User ID is required"})
	}

	transactionID := c.Params("transactionId")
	if transactionID == "" {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Transaction ID is required"})
	}

	// Convert the user ID string to an ObjectID
	objUserID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Invalid User ID"})
	}

	// Convert the transaction ID string to an ObjectID
	objTransactionID, err := primitive.ObjectIDFromHex(transactionID)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Invalid Transaction ID"})
	}

	// Find the user by ID
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var user models.User
	err = userCollection.FindOne(ctx, bson.M{"id": objUserID}).Decode(&user)
	if err != nil {
		return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
	}

	// Parse the updated transaction details from the request body
	var transactioToBeDeleted *models.Transaction
	for i, transaction := range user.Transactions {
		if transaction.Id == objTransactionID {
			transactioToBeDeleted = &user.Transactions[i]
			break
		}
	}

	if transactioToBeDeleted == nil {
		return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "Transaction not found"})
	}


	// Update the transaction status if it has changed

	switch transactioToBeDeleted.TransactionStatus {
	case "paid":
		user.TotalExpense -= transactioToBeDeleted.Amount
		user.Balance += transactioToBeDeleted.Amount
		for i, t := range user.Expenses {
			if t.Id == objTransactionID {
				user.Expenses = append(user.Expenses[:i], user.Expenses[i+1:]...)
			}
		}

	case "received":
		user.TotalIncome -= transactioToBeDeleted.Amount
		user.Balance -= transactioToBeDeleted.Amount
		for i, t := range user.Income {
			if t.Id == objTransactionID {
				user.Income = append(user.Income[:i], user.Income[i+1:]...)
			}
		}
	default:
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Invalid transaction status"})
	}

	for i, t := range user.Transactions {
		if t.Id == objTransactionID {
			user.Transactions = append(user.Transactions[:i], user.Transactions[i+1:]...)
		}
	}

	// Update the user in the database
	_, err = userCollection.UpdateOne(ctx, bson.M{"id": objUserID}, bson.M{"$set": user})
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete user"})
	}

	// Return the updated transaction
	return c.JSON(fiber.Map{
		"status":  http.StatusOK,
		"message": "success",
		"data":    user,
	})
}
