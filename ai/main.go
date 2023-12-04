package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/AnthonyThomasson/fight-it/ai/generator"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	generator := generator.NewAIGenerator(context.Background(), os.Getenv("OPENAI_API_KEY"))

	story, err := generator.StartStory()
	if err != nil {
		log.Fatal(err)
	}
	fmt.Print(story)
}
