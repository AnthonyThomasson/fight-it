package generator

import (
	"context"
	"os"
)

func TestGetIntro(story *Story) {
	g := NewAIGenerator(context.Background(), os.Getenv("OPENAI_API_KEY"))
	_, err := g.getIntro(story)
	if err != nil {
		panic(err)
	}
}
