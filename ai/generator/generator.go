package generator

import (
	"context"
)

type aiGenerator struct {
	ctx context.Context
	key string
}

func NewAIGenerator(ctx context.Context, key string) *aiGenerator {
	return &aiGenerator{
		key: key,
		ctx: ctx,
	}
}
