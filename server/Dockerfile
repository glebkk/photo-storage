FROM golang:alpine

WORKDIR /app

ADD go.mod .
COPY . .

RUN go build -o app cmd/app/main.go

CMD ["sleep", "3", "&&", "./app", "--config", "./config/config.yaml"]