package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// type User struct {
// 	Id       primitive.ObjectID `json:"id,omitempty"`
// 	Name     string             `json:"name,omitempty" validate:"required"`
// 	Location string             `json:"location,omitempty" validate:"required"`
// 	Title    string             `json:"title,omitempty" validate:"required"`
// }

type Transaction struct {
	Id                primitive.ObjectID `json:"id"`
	Date              time.Time          `json:"date"`
	Name              string             `json:"name"`
	Amount            float64            `json:"amount"`
	TransactionStatus string             `json:"transactionStatus"`
}

type User struct {
	Id           primitive.ObjectID `json:"id,omitempty"`
	Name         string             `json:"name"`
	Balance      float64            `json:"balance"`
	TotalIncome  float64            `json:"totalIncome"`
	TotalExpense float64            `json:"totalExpense"`
	Transactions []Transaction      `json:"transactions"`
	Expenses     []Transaction      `json:"expenses"`
	Income       []Transaction      `json:"income"`
}
