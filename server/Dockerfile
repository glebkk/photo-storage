FROM golang:alpine

WORKDIR /app

ADD go.mod .
COPY . .

RUN go build -o app cmd/app/main.go

CMD ["./app", "--config", "./config/config.yaml"]