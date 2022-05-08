
; Keywords

[
  "namespace"
  "service"
  "structure"
  "operation"
  "use"
] @keyword

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

; (shape_id (#is-not? local)) @type

(trait) @attribute

; (absolute_root_shape_id (identifier)) @type

(use_statement
  (absolute_root_shape_id 
    (namespace) @type
    (identifier) @type
  ))


; (node_object_key (#is-not? local)) @property

(trait_body) @local.scope

(identifier) @identifier
