package controllers

import (
	"fmt"
	"net/http"

	"github.com/labstack/echo/v4"
)

type Response struct {
	Message string `json:"message"`
}

func Hello(c echo.Context) error {
	fmt.Println("Request handled")
	res := &Response{
		Message: "Hello World!",
	}
	return c.JSON(http.StatusOK, res)
}
