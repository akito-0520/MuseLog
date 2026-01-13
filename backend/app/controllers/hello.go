package controllers

import (
	"fmt"
	"net/http"

	"github.com/labstack/echo/v4"
)

type HelloResponse struct {
	Message string `json:"message"`
}

func Hello(c echo.Context) error {
	fmt.Println("Request handled")
	res := &HelloResponse{
		Message: "Hello World!",
	}
	return c.JSON(http.StatusOK, res)
}
