
; Keywords

[
  "namespace"
  "service"
  "structure"
  "operation"
  "list"
  "map"
  "union"
  "resource"
  "set",
  "enum",
  "intEnum"
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
[
  (comment)
  (documentation_comment)
] @comment
[
  ("@")
] @operator

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

(explicit_member
  (identifier) @variable
  (shape_id) @type
)
(elided_member
  (identifier) @variable
)
(structure_statement
  (identifier) @type.definition
)
(operation_statement
  (identifier) @type.definition
)
(list_statement
  (identifier) @type.definition
)
(simple_shape_statement
  (identifier) @type.definition
)
(enum_shape_statement
  (identifier) @type.definition
)
(resource_statement
  (identifier) @type.definition
)
(union_statement
  (identifier) @type.definition
)
(map_statement
  (identifier) @type.definition
)
(service_statement
  (identifier) @type.definition
)
(operation_statement
  (identifier) @type.definition
)
