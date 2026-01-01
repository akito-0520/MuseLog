FROM golang:1.23-alpine AS builder

WORKDIR /app
COPY . .

RUN CGO_ENABLED=0 go build -o server main.go

FROM alpine:latest

# Create a non-root user and group for running the server
RUN addgroup -S servergroup && adduser -S serveruser -G servergroup

# Use a non-privileged working directory
WORKDIR /home/server
COPY --from=builder /app/server .

# Ensure the binary is owned by the non-root user
RUN chown serveruser:servergroup /home/server/server

EXPOSE 8000

# Run the server as the non-root user
USER serveruser
CMD ["./server"]
