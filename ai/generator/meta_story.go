package generator

import (
	_ "embed"
)

type fightDetails struct {
	Player   fighter `yaml:"player"`
	Opponent fighter `yaml:"opponent"`
}

type fighter struct {
	Name        string `yaml:"name"`
	Description string `yaml:"description"`
}

func (g *aiGenerator) storyMeta() (*fightDetails, error) {
	playerName, err := g.getFighterName()
	if err != nil {
		return nil, err
	}
	playerDescription, err := g.getFighterDescription(playerName)
	if err != nil {
		return nil, err
	}

	opponentName, err := g.getFighterName()
	if err != nil {
		return nil, err
	}
	opponentDescription, err := g.getFighterDescription(opponentName)
	if err != nil {
		return nil, err
	}

	return &fightDetails{
		Player: fighter{
			Name:        playerName,
			Description: playerDescription,
		},
		Opponent: fighter{
			Name:        opponentName,
			Description: opponentDescription,
		},
	}, nil
}
