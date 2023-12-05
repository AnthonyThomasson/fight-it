package main

import (
	"encoding/json"
	"fmt"
	"os"

	"github.com/AnthonyThomasson/fight-it/ai/generator"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load(".env")
	if err != nil {
		panic(err)
	}
	args := os.Args[1:]
	if len(args) < 3 {
		panic("Missing arguments")
	}
	playerInput := args[0]
	opponentInput := args[1]
	testType := args[2]

	story := getStoryData()
	player := getCharacterData(playerInput)
	opponent := getCharacterData(opponentInput)

	if testType == "intro" {
		fmt.Printf("Testing story intro for %s vs %s\n", playerInput, opponentInput)

		story.Fight.Player = player
		story.Fight.Opponent = opponent
		// storyJson, _ := json.Marshal(story)
		fmt.Printf("Story: %+v\n", opponent.Seed)
		generator.TestGetIntro(story)
	}

	setStoryData(story)
}

func getStoryData() *generator.Story {
	jsonData, err := os.ReadFile("test/story/data/story.json")
	if err != nil {
		fmt.Println("Error reading file")
		panic(err)
	}

	var story generator.Story
	json.Unmarshal(jsonData, &story)

	return &story
}

func setStoryData(story *generator.Story) {
	jsonData, err := json.Marshal(story)
	if err != nil {
		fmt.Printf("Error marshalling story: %v", story)
		panic(err)
	}

	err = os.WriteFile("test/story/data/story.json", jsonData, 0o644)
	if err != nil {
		fmt.Println("Error writing file")
		panic(err)
	}
}

func getCharacterData(ref string) *generator.Character {
	jsonData, err := os.ReadFile("test/character/data/" + ref + ".json")
	if err != nil {
		fmt.Println("Error reading file")
		panic(err)
	}

	var character generator.Character
	json.Unmarshal(jsonData, &character)

	return &character
}
