FROM golang:1.23-alpine AS builder

WORKDIR /app
COPY . .

RUN CGO_ENABLED=0 go build -o server main.go

FROM alpine:latest

WORKDIR /root/
COPY --from=builder /app/server .

EXPOSE 8000
CMD ["./server"]
