package generator

import (
	_ "embed"
	"os"

	"gopkg.in/yaml.v3"
)

func (g *aiGenerator) StoryIntro() (string, error) {
	examplesYml := "examples/story_intro.yml"

	meta, err := g.storyMeta()
	if err != nil {
		return "", err
	}
	metaYml, err := yaml.Marshal(meta)
	if err != nil {
		return "", err
	}

	client := newAiClient(g.ctx, g.key)
	client.setSystemMessage("You are generating the start of a story introducing a boxing match.")
	client.setDebugMode(os.Getenv("DEBUG_AI") == "true")
	client.setFrequencyPenalty(1.5)
	client.setTemperature(1.0)
	result, err := client.generateFrom("Generate an intro to the story based on this yml: \n\n \"\"\"\n"+string(metaYml)+"\n\"\"\"", &examplesYml)
	if err != nil {
		return "", err
	}
	return result, nil
}
