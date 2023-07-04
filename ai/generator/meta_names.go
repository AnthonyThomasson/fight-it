package generator

import (
	_ "embed"
	"math/rand"
	"time"

	"gopkg.in/yaml.v3"
)

const meta_names_yml = "examples/static/meta_names.yml"

func (g *aiGenerator) getFighterName() (string, error) {
	content, err := examples.ReadFile(meta_names_yml)
	if err != nil {
		return "", err
	}
	var names []string
	err = yaml.Unmarshal(content, &names)
	if err != nil {
		return "", err
	}
	rand := rand.New(rand.NewSource(time.Now().UnixNano()))
	randomIndex := rand.Intn(len(names))
	return names[randomIndex], nil
}
