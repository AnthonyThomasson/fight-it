package generator

import (
	_ "embed"
	"os"
)

func (g *aiGenerator) getFighterDescription(name string) (string, error) {
	examplesYml := "examples/meta_description.yml"

	client := newAiClient(g.ctx, g.key)
	client.setSystemMessage("You are generating a description of a boxer.")
	client.setDebugMode(os.Getenv("DEBUG_AI") == "true")
	client.setFrequencyPenalty(0.7)
	client.setTemperature(1.0)
	result, err := client.generateFrom("Generate a description of the boxer '"+name+"'.", &examplesYml)
	if err != nil {
		return "", err
	}
	return result, nil
}
