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
	if len(args) < 2 {
		panic("Missing arguments")
	}
	charRef := args[0]
	testType := args[1]

	character := getTestData(charRef)

	fmt.Printf("Testing %s for %s\nFrom seed: %v\n", testType, charRef, character.Seed)

	if testType == "name" && character.Name == "" {
		generator.TestGetCharacterName(character)
	} else if testType == "physical" && character.PhysicalDiscription == "" {
		generator.TestGetCharacterPhysicalDescription(character)
	} else if testType == "backstory" && character.Backstory == "" {
		generator.TestGetCharacterBackstory(character)
	} else if testType == "weapon" && character.Weapon == "" {
		generator.TestGetCharacterWeapon(character)
	} else {
		fmt.Println("Error: Invalid test type")
		panic("Invalid test type")
	}

	setTestData(charRef, character)
}

func getTestData(ref string) *generator.Character {
	jsonData, err := os.ReadFile("test/character/data/" + ref + ".json")
	if err != nil {
		fmt.Println("Error reading file")
		panic(err)
	}

	var character generator.Character
	json.Unmarshal(jsonData, &character)

	return &character
}

func setTestData(ref string, character *generator.Character) {
	jsonData, err := json.Marshal(character)
	if err != nil {
		fmt.Printf("Error marshalling character: %v", character)
		panic(err)
	}

	err = os.WriteFile("test/character/data/"+ref+".json", jsonData, 0o644)
	if err != nil {
		fmt.Println("Error writing file")
		panic(err)
	}
}
