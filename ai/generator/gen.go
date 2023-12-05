package generator

import (
	_ "embed"
	"os"
)

func (g *aiGenerator) getIntro(s *Story) (string, error) {
	examplesYml := "examples/story_intro.json"

	client := newAiClient(g.ctx, g.key)
	client.setDebugMode(os.Getenv("DEBUG_AI") == "true")
	client.setFrequencyPenalty(0.7)
	client.setTemperature(1.0)

	client.setSystemMessage(`Write an introduction to a story leading up to a fight between two characters.`)
	client.setSystemMessage(`Your response should be under 200 words`)
	client.setSystemMessage(`
		Write the story in first person perspective of the following character:
		"""
		NAME: ` + s.Fight.Player.Name + `
		WEAPON: ` + s.Fight.Player.Weapon + `

		` + s.Fight.Player.Seed + `

		` + s.Fight.Player.PhysicalDiscription + `

		` + s.Fight.Player.Backstory + `
		"""
		`)
	client.setSystemMessage(`

		End the introduction with the character staring down the following character. They should both be staring earchother down when the introduction ends:
		"""
		NAME: ` + s.Fight.Opponent.Name + `
		WEAPON: ` + s.Fight.Opponent.Weapon + `

		` + s.Fight.Opponent.Seed + `

		` + s.Fight.Opponent.PhysicalDiscription + `

		` + s.Fight.Opponent.Backstory + `
		"""
	`)
	message := `Write the introduction ending right before a fight takes place`
	result, err := client.generateFrom(message, &examplesYml)
	if err != nil {
		return "", err
	}
	s.Progression.Intro = result
	return result, nil
}

func (g *aiGenerator) getCharacterWeapon(character Character) (string, error) {
	examplesYml := "examples/character_weapon.json"

	client := newAiClient(g.ctx, g.key)
	client.setSystemMessage(`
		Pick a weapon for a character a character whos details are delimited by triple quotes. The name of the character is prefixed with "NAME: ".

		You should only pick one weapon.
		The weapon should be usable to fight another character.
	`)
	client.setDebugMode(os.Getenv("DEBUG_AI") == "true")
	client.setFrequencyPenalty(0.7)
	client.setTemperature(1.0)
	message := `
		"""
		NAME: ` + character.Name + `

		` + character.Seed + `

		` + character.PhysicalDiscription + `

		` + character.Backstory + `
		"""
	`
	result, err := client.generateFrom(message, &examplesYml)
	if err != nil {
		return "", err
	}
	character.Weapon = result
	return result, nil
}

func (g *aiGenerator) getCharacterPhysicalDescription(character Character) (string, error) {
	examplesYml := "examples/character_physical_description.json"

	client := newAiClient(g.ctx, g.key)
	client.setSystemMessage(`
		Create a pysical description of a character whos details are delimited by triple quotes. The name of the character is prefixed with "NAME: ".

		Your response should be no longer than 100 words.
	`)
	client.setDebugMode(os.Getenv("DEBUG_AI") == "true")
	client.setFrequencyPenalty(0.7)
	client.setTemperature(1.0)
	message := `
		"""
		NAME: ` + character.Name + `

		` + character.Seed + `
		"""
	`
	result, err := client.generateFrom(message, &examplesYml)
	if err != nil {
		return "", err
	}
	character.PhysicalDiscription = result
	return result, nil
}

func (g *aiGenerator) getCharacterBackstory(character Character) (string, error) {
	examplesYml := "examples/character_backstory.json"

	client := newAiClient(g.ctx, g.key)
	client.setSystemMessage(`
		Create a backstory for a character whos details are delimited by triple quotes. The name of the character is prefixed with "NAME: ".

		Your response should be no longer than 200 words.
	`)
	client.setDebugMode(os.Getenv("DEBUG_AI") == "true")
	client.setFrequencyPenalty(0.7)
	client.setTemperature(1.0)
	message := `
		"""
		NAME: ` + character.Name + `
		
		` + character.Seed + `

		` + character.PhysicalDiscription + `
		"""
	`
	result, err := client.generateFrom(message, &examplesYml)
	if err != nil {
		return "", err
	}
	character.Backstory = result
	return result, nil
}

func (g *aiGenerator) getCharacterName(character Character) (string, error) {
	examplesYml := "examples/character_name.json"

	client := newAiClient(g.ctx, g.key)
	client.setSystemMessage("Pick a name for a character whos details are delimited by triple quotes.")
	client.setDebugMode(os.Getenv("DEBUG_AI") == "true")
	client.setFrequencyPenalty(0.7)
	client.setTemperature(1.0)
	message := `
		"""
		` + character.Seed + `
		"""
	`
	result, err := client.generateFrom(message, &examplesYml)
	if err != nil {
		return "", err
	}
	character.Name = result
	return result, nil
}
