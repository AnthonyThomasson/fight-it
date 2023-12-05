package generator

import (
	"bufio"
	_ "embed"
	"fmt"
	"os"
)

type Story struct {
	Progression *Progression  `json:"progression"`
	Fight       *FightDetails `json:"fight"`
}

type Progression struct {
	Intro string `json:"intro"`
}

type FightDetails struct {
	Player                  *Character `json:"player"`
	Opponent                *Character `json:"opponent"`
	BattlegroundDescription string     `json:"battleground_description"`
}

type Character struct {
	Seed                string `json:"seed"`
	Name                string `json:"name"`
	PhysicalDiscription string `json:"pyhsical_discription"`
	Backstory           string `json:"backstory"`
	Weapon              string `json:"weapon"`
}

func (g *aiGenerator) StartStory() (*Story, error) {
	story := Story{}
	g.writeIntro(&story)
	return &story, nil
}

func (g *aiGenerator) writeIntro(s *Story) (string, error) {
	err := g.writeCharacters(s)
	if err != nil {
		return "", err
	}

	intro, err := g.getIntro(s)
	if err != nil {
		return "", err
	}

	return intro, nil
}

func (g *aiGenerator) writeCharacters(s *Story) error {
	reader := bufio.NewReader(os.Stdin)

	fmt.Println("\nEnter a description of the player:")
	playerShortDescription, _ := reader.ReadString('\n')

	fmt.Println("\nEnter a description of the opponent:")
	opponentShortDescription, _ := reader.ReadString('\n')

	player, err := g.generateCharacter(playerShortDescription)
	if err != nil {
		return err
	}
	opponent, err := g.generateCharacter(opponentShortDescription)
	if err != nil {
		return err
	}

	s.Fight = &FightDetails{}
	s.Fight.Player = player
	s.Fight.Opponent = opponent

	return nil
}

func (g *aiGenerator) generateCharacter(description string) (*Character, error) {
	character := Character{}
	character.Seed = description
	characterName, err := g.getCharacterName(character)
	if err != nil {
		return nil, err
	}
	character.Name = characterName
	characterPysicalDescription, err := g.getCharacterPhysicalDescription(character)
	if err != nil {
		return nil, err
	}
	character.PhysicalDiscription = characterPysicalDescription
	characterBackstory, err := g.getCharacterBackstory(character)
	if err != nil {
		return nil, err
	}
	character.Backstory = characterBackstory

	weapon, err := g.getCharacterWeapon(character)
	if err != nil {
		return nil, err
	}
	character.Weapon = weapon

	return &character, nil
}
