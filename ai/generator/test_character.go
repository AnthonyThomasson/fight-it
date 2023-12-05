package generator

import (
	"context"
	"os"
)

func TestGetCharacterName(character *Character) {
	g := NewAIGenerator(context.Background(), os.Getenv("OPENAI_API_KEY"))
	_, err := g.getCharacterName(*character)
	if err != nil {
		panic(err)
	}
}

func TestGetCharacterBackstory(character *Character) {
	g := NewAIGenerator(context.Background(), os.Getenv("OPENAI_API_KEY"))
	_, err := g.getCharacterBackstory(*character)
	if err != nil {
		panic(err)
	}
}

func TestGetCharacterPhysicalDescription(character *Character) {
	g := NewAIGenerator(context.Background(), os.Getenv("OPENAI_API_KEY"))
	_, err := g.getCharacterPhysicalDescription(*character)
	if err != nil {
		panic(err)
	}
}

func TestGetCharacterWeapon(character *Character) {
	g := NewAIGenerator(context.Background(), os.Getenv("OPENAI_API_KEY"))
	_, err := g.getCharacterWeapon(*character)
	if err != nil {
		panic(err)
	}
}
