
; Keywords

[
  "namespace"
  "service"
  "structure"
  "operation"
  "list"
  "map"
] @keyword

(simple_type_name) @type.builtin
"use" @include

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
    (namespace) @namespace
    (identifier) @type
  ))

(trait_statements
  (trait 
    (shape_id) @attribute
  ))

(node_string_value 
  (shape_id) @type
)

; (trait_body) @local.scope

(shape_member_kvp 
  (identifier) @variable
  (shape_id) @type
)

(structure_shape_statement
  (identifier) @type.definition
)

(operation_shape_statement
  (identifier) @type.definition
)
(list_shape_statement
  (identifier) @type.definition
)
(simple_shape_statement
  (identifier) @type.definition
)
