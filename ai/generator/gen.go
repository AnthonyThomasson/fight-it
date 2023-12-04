package generator

import (
	_ "embed"
	"os"
)

func (g *aiGenerator) getIntro(player *character, opponent *character) (string, error) {
	examplesYml := "examples/story_intro.yml"

	client := newAiClient(g.ctx, g.key)
	client.setSystemMessage("Write an introduction to a story leading up to a fight between two characters. Write it from the prospective of the \"player\" character.")
	client.setDebugMode(os.Getenv("DEBUG_AI") == "true")
	client.setFrequencyPenalty(0.7)
	client.setTemperature(1.0)
	message := `
		Write an introduction to a story from the prospective of the "player" character. The story should lead up to the moment before the fight starts: 
		
		player
		"""
		NAME: ` + player.Name + `
		WEAPON: ` + player.Weapon + `

		` + player.Backstory + `
		"""

		opponent
		"""
		NAME: ` + opponent.Name + `
		WEAPON: ` + opponent.Weapon + `

		` + opponent.Backstory + `
		"""
	`
	result, err := client.generateFrom(message, &examplesYml)
	if err != nil {
		return "", err
	}
	return result, nil
}

func (g *aiGenerator) getCharacterWeapon(character character) (string, error) {
	examplesYml := "examples/meta_weapon.yml"

	client := newAiClient(g.ctx, g.key)
	client.setSystemMessage("Decide a weapon for a character based on a description of them.")
	client.setDebugMode(os.Getenv("DEBUG_AI") == "true")
	client.setFrequencyPenalty(0.7)
	client.setTemperature(1.0)
	message := `
		Decide which weapon the character uses based on the following description of them:
		
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
	return result, nil
}

func (g *aiGenerator) getCharacterPhysicalDescription(character character) (string, error) {
	examplesYml := "examples/meta_physical_description.yml"

	client := newAiClient(g.ctx, g.key)
	client.setSystemMessage("Expand a description of a character into a physical description.")
	client.setDebugMode(os.Getenv("DEBUG_AI") == "true")
	client.setFrequencyPenalty(0.7)
	client.setTemperature(1.0)
	message := `
		Expand the following into a physical description of a character:
		
		"""
		NAME: ` + character.Name + `

		` + character.Seed + `
		"""
	`
	result, err := client.generateFrom(message, &examplesYml)
	if err != nil {
		return "", err
	}
	return result, nil
}

func (g *aiGenerator) getCharacterBackstory(character character) (string, error) {
	examplesYml := "examples/meta_backstory.yml"

	client := newAiClient(g.ctx, g.key)
	client.setSystemMessage("Expand a description of a character into a backstory.")
	client.setDebugMode(os.Getenv("DEBUG_AI") == "true")
	client.setFrequencyPenalty(0.7)
	client.setTemperature(1.0)
	message := `
		Expand the following into a backstory for a character: 

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
	return result, nil
}

func (g *aiGenerator) getCharacterName(character character) (string, error) {
	examplesYml := "examples/meta_name.yml"

	client := newAiClient(g.ctx, g.key)
	client.setSystemMessage("You are picking a name for a character based on a description of them.")
	client.setDebugMode(os.Getenv("DEBUG_AI") == "true")
	client.setFrequencyPenalty(0.7)
	client.setTemperature(1.0)
	message := `
		Pick a name for a character based on the following description: 
		
		"""
		` + character.Seed + `
		"""
	`
	result, err := client.generateFrom(message, &examplesYml)
	if err != nil {
		return "", err
	}
	return result, nil
}
