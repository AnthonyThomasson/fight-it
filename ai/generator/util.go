package generator

import (
	"embed"
	"math/rand"
	"os"
	"time"

	openai "github.com/sashabaranov/go-openai"
	"gopkg.in/yaml.v3"
)

//go:embed examples/*
var examples embed.FS

type Question struct {
	Question any `yaml:"question"`
	Answer   any `yaml:"answer"`
}

func parseExamples(exampleFile string) ([]openai.ChatCompletionMessage, error) {
	examplesYml, err := examples.ReadFile(exampleFile)
	if err != nil {
		return nil, err
	}

	var messages []openai.ChatCompletionMessage
	var questions []Question
	err = yaml.Unmarshal(examplesYml, &questions)
	if err != nil {
		return nil, err
	}

	// shuffle the examples to be in a random order. This helps the model
	// generate more unique answers on each run.
	rand := rand.New(rand.NewSource(time.Now().UnixNano()))
	for i := len(questions) - 1; i > 0; i-- {
		j := rand.Intn(i + 1)
		questions[i], questions[j] = questions[j], questions[i]
	}

	for _, q := range questions {
		messages = append(messages, openai.ChatCompletionMessage{
			Role:    openai.ChatMessageRoleUser,
			Content: q.Question.(string),
		})

		messages = append(messages, openai.ChatCompletionMessage{
			Role:    openai.ChatMessageRoleAssistant,
			Content: q.Answer.(string),
		})

	}
	return messages, nil
}

func saveExample(exampleFile string, question string, answer string) error {
	examplesYml, err := os.ReadFile("generator/" + exampleFile)
	if err != nil {
		return err
	}

	var questions []Question
	err = yaml.Unmarshal(examplesYml, &questions)
	if err != nil {
		return err
	}

	questions = append(questions, Question{
		Question: question,
		Answer:   answer,
	})

	questionsContent, err := yaml.Marshal(&questions)
	if err != nil {
		return err
	}

	err = yaml.Unmarshal(questionsContent, &questions)
	if err != nil {
		return err
	}

	err = os.WriteFile("generator/"+exampleFile, questionsContent, 0o644)
	if err != nil {
		return err
	}

	return nil
}
