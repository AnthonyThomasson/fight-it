package generator

import (
	"bufio"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"os"
	"time"

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

func (c *aiClient) addMessage(message string) *aiClient {
	c.messages = append(c.messages, openai.ChatCompletionMessage{
		Role:    openai.ChatMessageRoleUser,
		Content: message,
	})
	return c
}

func (c *aiClient) addResponseMessage(message string) *aiClient {
	c.messages = append(c.messages, openai.ChatCompletionMessage{
		Role:    openai.ChatMessageRoleAssistant,
		Content: message,
	})
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
			for {

				// If there are too many messages, trim down the list
				for {
					// convert list of messages to a single string
					jsonData, err := json.Marshal(&c.messages)
					if err != nil {
						log.Fatalf("error: %v", err)
					}
					if len(jsonData) > 36000 {
						if len(c.messages) >= 3 {
							c.messages = append(c.messages[:1], c.messages[3:]...)
						}
						break
					}
					break
				}

				resp, err = c.client.CreateChatCompletion(
					c.ctx,
					openai.ChatCompletionRequest{
						Model:            openai.GPT3Dot5Turbo,
						Messages:         c.messages,
						FrequencyPenalty: c.frequencyPenalty,
						Temperature:      c.temperature,
					},
				)

				if err != nil {

					e := &openai.APIError{}
					if errors.As(err, &e) {
						switch e.HTTPStatusCode {
						case 429:
							fmt.Println("\nWARING: Rate limit exceeded. Waiting 5 seconds and trying again with a smaller message.")
							time.Sleep(5 * time.Second)
							continue
						default:
							fmt.Println("ERROR: " + err.Error())
						}
					}
					return "", err
				}
				break
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
				response = resp.Choices[0].Message.Content
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
					wfp, err := os.Create("view_prompt.txt")
					if err != nil {
						return "", err
					}
					wf, err := os.Create("edit_answer.txt")
					if err != nil {
						return "", err
					}

					allMessageStr := ""
					for _, message := range c.messages {

						if message.Role == openai.ChatMessageRoleUser {
							allMessageStr += "\n\nUser: " + message.Content + "\n"
							continue
						}
						if message.Role == openai.ChatMessageRoleAssistant {
							allMessageStr += "\n\nAI: " + message.Content + "\n"
							continue
						}
						if message.Role == openai.ChatMessageRoleSystem {
							allMessageStr += "\n\nSystem: " + message.Content + "\n"
							continue
						}
					}

					allMessageStr += "\n\nUser: " + message + "\n"

					wfp.Write([]byte(allMessageStr))
					wf.Write([]byte(resp.Choices[0].Message.Content))
					defer wf.Close()

					fmt.Println("\n\nDEBUG: Enter the modified response in the file \"edit_answer.txt\". When you are finished press \"y\"")
					save, _ := reader.ReadString('\n')
					if save == "y\n" || save == "yes\n" {

						editedResponseBytes, err := os.ReadFile("edit_answer.txt")
						if err != nil {
							return "", err
						}
						editedResponse := string(editedResponseBytes)

						c.messages = append(c.messages, openai.ChatCompletionMessage{
							Role:    openai.ChatMessageRoleAssistant,
							Content: editedResponse,
						})
						resp.Choices[0].Message.Content = editedResponse
					} else {
						fmt.Println("\n\nDEBUG: Invalid option.")
						os.Exit(1)
					}
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
