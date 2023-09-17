package generator

import (
	"bufio"
	"context"
	"fmt"
	"os"

	openai "github.com/sashabaranov/go-openai"
)

type aiClient struct {
	ctx context.Context

	messages  []openai.ChatCompletionMessage
	client    *openai.Client
	debugMode bool

	frequencyPenalty float32
	temperature      float32
}

func newAiClient(ctx context.Context, key string) *aiClient {
	return &aiClient{
		ctx: ctx,

		client:    openai.NewClient(key),
		debugMode: false,

		frequencyPenalty: 0.0,
		temperature:      1.0,
	}
}

func (c *aiClient) setDebugMode(value bool) *aiClient {
	c.debugMode = value
	return c
}

func (c *aiClient) setSystemMessage(message string) *aiClient {
	c.messages = append(c.messages, openai.ChatCompletionMessage{
		Role:    openai.ChatMessageRoleSystem,
		Content: message,
	})
	return c
}

func (c *aiClient) setFrequencyPenalty(value float32) *aiClient {
	c.frequencyPenalty = value
	return c
}

func (c *aiClient) setTemperature(value float32) *aiClient {
	c.temperature = value
	return c
}

func (c *aiClient) generateFrom(message string, exampleFile *string) (string, error) {
	exampleMessages, err := parseExamples(*exampleFile)
	if err != nil {
		return "", err
	}

	c.messages = append(c.messages, exampleMessages...)

	reader := bufio.NewReader(os.Stdin)
	response := ""

	c.messages = append(c.messages, openai.ChatCompletionMessage{
		Role:    openai.ChatMessageRoleUser,
		Content: message,
	})

	var resp openai.ChatCompletionResponse
	for {

		lastMessage := c.messages[len(c.messages)-1]
		if lastMessage.Role != openai.ChatMessageRoleAssistant {

			resp, err = c.client.CreateChatCompletion(
				c.ctx,
				openai.ChatCompletionRequest{
					Model:            openai.GPT4,
					Messages:         c.messages,
					FrequencyPenalty: c.frequencyPenalty,
					Temperature:      c.temperature,
				},
			)
			if err != nil {
				return "", err
			}
		}

		if c.debugMode {

			fmt.Println("\nPrompt:")
			fmt.Println(message)
			fmt.Println("\nAnswer:")
			fmt.Println(resp.Choices[0].Message.Content)
			fmt.Println("\n\nDEBUG: Are you happy with this response?")
			happy, _ := reader.ReadString('\n')
			if happy == "y\n" || happy == "yes\n" {

				fmt.Println("\n\nDEBUG: do you want to save it?")
				save, _ := reader.ReadString('\n')
				if save == "y\n" || save == "yes\n" {
					err := saveExample(*exampleFile, message, resp.Choices[0].Message.Content)
					if err != nil {
						return "", err
					}
				}
				break
			}

			for {
				fmt.Println("\n\nDEBUG: \n1) Prompt it again to modify.\n2) Edit and replace.")
				modifyType, _ := reader.ReadString('\n')
				if modifyType == "1\n" {

					fmt.Println("\n\nDEBUG: Prompt it again to modify it.")
					modifier, _ := reader.ReadString('\n')
					c.messages = append(c.messages, openai.ChatCompletionMessage{
						Role:    openai.ChatMessageRoleAssistant,
						Content: resp.Choices[0].Message.Content,
					})
					c.messages = append(c.messages, openai.ChatCompletionMessage{
						Role:    openai.ChatMessageRoleUser,
						Content: modifier,
					})

					break
				} else if modifyType == "2\n" {
					fmt.Println("\n\nDEBUG: Enter the modified response.")
					editedResponse, _ := reader.ReadString('\n')
					editedResponse = editedResponse[:len(editedResponse)-1]
					c.messages = append(c.messages, openai.ChatCompletionMessage{
						Role:    openai.ChatMessageRoleAssistant,
						Content: editedResponse,
					})
					resp.Choices[0].Message.Content = editedResponse
					break
				} else {
					fmt.Println("\n\nDEBUG: Invalid option.")
				}
			}
		} else {
			response = resp.Choices[0].Message.Content
			break
		}
	}

	return response, nil
}
