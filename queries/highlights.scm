
; Keywords

[
  "namespace"
  "service"
  "structure"
  "operation"
] @keyword

(simple_type_name) @type.builtin

[
  ","
  ":"
  "."
] @punctuation.delimiter


[
  "("
  ")"
  "["
  "]"
  "{"
  "}"
  "#"
] @punctuation.bracket

(number) @number
(quoted_text) @string
(comment) @comment

(use_statement
  (absolute_root_shape_id 
    (namespace) @type
    (identifier) @type
  ))

(trait_statements
  (trait 
    (shape_id) @attribute
  ))

(node_string_value 
  (shape_id) @type
)

(trait_body) @local.scope

(identifier) @identifier
