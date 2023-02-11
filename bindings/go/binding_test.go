package tree_sitter_smithy_test

import (
	"testing"

	tree_sitter "github.com/smacker/go-tree-sitter"
	"github.com/tree-sitter/tree-sitter-smithy"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_smithy.Language())
	if language == nil {
		t.Errorf("Error loading Smithy grammar")
	}
}
