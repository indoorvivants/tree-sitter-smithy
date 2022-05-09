# [Tree Sitter](https://tree-sitter.github.io/tree-sitter/) grammar for [Smithy](https://awslabs.github.io/smithy/index.html)

If you find yourself editing Smithy files in Neovim, you might be interested in this project.

It provides a "good enough" grammar for Smithy, and a set of highlighting queries that 
should give you decent syntax highlighting.

## Installation

Make sure you have [Neovim Treesitter](https://github.com/nvim-treesitter/nvim-treesitter) plugin installed and configured. 

Adding syntax highlighting requires 3 steps:

1. Drop this snippet into your `init.lua`:

    ```lua
    local parser_config = require "nvim-treesitter.parsers".get_parser_configs()
    parser_config.smithy = {
      install_info = {
        url = "https://github.com/indoorvivants/tree-sitter-smithy", -- local path or git repo
        files = {"src/parser.c"},
        -- optional entries:
        branch = "main", -- default branch in case of git repo if different from master
        generate_requires_npm = true, -- if stand-alone parser without npm dependencies
        requires_generate_from_grammar = true, -- if folder contains pre-generated src/parser.c
      },
      filetype = "smithy" -- if filetype does not agrees with parser name
    }
    ```

    and run `:TSInstall smithy`, this should succeed

2. By default, Neovim doesn't recognise `smithy` extension and doesn't have a filetype for it.

    If you are not familiar with filetypes, the simplest way to enable them is to add this line 
    to your `init.lua` script:

    ```lua
    vim.cmd([[au BufRead,BufNewFile *.smithy		setfiletype smithy]])
    ```
3. For some reason, nvim-treesitter doesn't copy the highlighting queries from the repo, so you'll need 
  to take the [`highlights.scm`](./highlights.scm) file and copy it into `.local/share/nvim/site/pack/packer/start/nvim-treesitter/queries/smithy/highlights.scm`

  If there's a better way of doing it, please let me know.

After that, once you restart neovim, you should have highlighting powered by Tree-sitter in your `*.smithy` files
