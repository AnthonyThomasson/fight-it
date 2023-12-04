package generator

import (
	_ "embed"
)

type story struct {
	Progression *progression  `yaml:"progression"`
	Fight       *fightDetails `yaml:"fight"`
}

type progression struct {
	Intro string `yaml:"intro"`
}

type fightDetails struct {
	Player                  *character `yaml:"player"`
	Opponent                *character `yaml:"opponent"`
	BattlegroundDescription string     `yaml:"battleground_description"`
}

type character struct {
	Seed                string `yaml:"seed"`
	Name                string `yaml:"name"`
	PhysicalDiscription string `yaml:"pyhsical_discription"`
	Backstory           string `yaml:"backstory"`
	Weapon              string `yaml:"weapon"`
}

func (g *aiGenerator) StartStory() (*story, error) {
	story := story{}
	g.writeIntro(&story)
	return &story, nil
}

func (g *aiGenerator) writeIntro(story *story) (string, error) {
	err := g.writeCharacters(story)
	if err != nil {
		return "", err
	}

	intro, err := g.getIntro(story.Fight.Player, story.Fight.Opponent)
	if err != nil {
		return "", err
	}

	return intro, nil
}

func (g *aiGenerator) writeCharacters(story *story) error {
	// reader := bufio.NewReader(os.Stdin)

	// fmt.Println("\nEnter a description of the player:")
	// playerShortDescription, _ := reader.ReadString('\n')
	playerShortDescription := "a traveling samurai"

	// fmt.Println("\nEnter a description of the opponent:")
	// opponentShortDescription, _ := reader.ReadString('\n')
	opponentShortDescription := "a roman legionary"

	player, err := g.generateCharacter(playerShortDescription)
	if err != nil {
		return err
	}
	opponent, err := g.generateCharacter(opponentShortDescription)
	if err != nil {
		return err
	}
	story.Fight = &fightDetails{}
	story.Fight.Player = player
	story.Fight.Opponent = opponent

	return nil
}

func (g *aiGenerator) generateCharacter(description string) (*character, error) {
	character := character{}
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
