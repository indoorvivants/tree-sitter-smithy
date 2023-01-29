/* eslint-disable camelcase */
/* eslint-disable-next-line spaced-comment */
/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const primitives = [
  'blob',
  'boolean',
  'byte',
  'document',
  'double',
  'float',
  'integer',
  'long',
  'short',
  'string',
  'timestamp',
  'bigInteger',
  'bigDecimal',
];

module.exports = grammar({
  name: 'smithy',
  extras: ($) => [
    /\s/,
    ',',
    $.documentation_comment,
    $.comment,
  ],

  rules: {
    // TODO: add the actual grammar rules
    source_file: ($) =>
      seq(
        optional($.control_definition),
        optional($.metadata_definition),
        optional($.shape_section),
      ),

    shape_section: ($) => seq(
      $.namespace_statement,
      repeat($._definition),
    ),

    _definition: ($) => choice(
      $.use_statement,
      $.apply_trait_statement,
      $.shape_statement,
    ),

    use_statement: ($) => seq('use', $.absolute_root_shape_id),
    namespace_statement: ($) => seq('namespace', $.namespace),

    metadata_definition: ($) => repeat1($.metadata_statement),
    metadata_statement: ($) => seq('metadata', $.identifier, '=', $.node_value),

    control_definition: ($) => repeat1($.control_statement),
    control_statement: ($) => seq($.control_var_name, $.node_value),

    shape_statement: ($) => seq(optional($.trait_statements), $.shape_body),
    shape_body: ($) => choice(
      $.simple_shape_statement,
      $.list_shape_statement,
      $.map_shape_statement,
      $.set_shape_statement,
      $.structure_shape_statement,
      $.union_shape_statement,
      $.operation_shape_statement,
      $.resource_shape_statement,
      $.service_shape_statement,
      $.enum_shape_statement,
    ),

    absolute_root_shape_id: ($) => seq($.namespace, '#', $.identifier),
    root_shape_id: ($) => choice($.absolute_root_shape_id, $.identifier),
    shape_id_member: ($) => seq('$', $.identifier),
    shape_id: ($) => prec.left(seq($.root_shape_id, repeat($.shape_id_member))),
    control_var_name: ($) => seq('$', $.node_object_key, ':'),
    namespace: ($) => seq($.identifier, repeat(seq('.', $.identifier))),

    simple_shape_statement: ($) => seq($.primitive, $.identifier, optional($.mixins)),
    list_shape_statement: ($) => seq('list', $.identifier, optional($.mixins), $.shape_members),
    set_shape_statement: ($) => seq('set', $.identifier, optional($.mixins), $.shape_members),
    map_shape_statement: ($) => seq('map', $.identifier, optional($.mixins), $.shape_members),
    structure_shape_statement: ($) => seq(
      'structure',
      $.identifier,
      optional($.structure_resource),
      optional($.mixins),
      $.shape_members,
    ),
    union_shape_statement: ($) => seq('union', $.identifier, optional($.mixins), $.shape_members),

    service_shape_statement: ($) => seq('service', $.identifier, optional($.mixins), $.node_object),
    operation_shape_statement: ($) => seq('operation', $.identifier, optional($.mixins), $.operation_body),
    resource_shape_statement: ($) => seq('resource', $.identifier, optional($.mixins), $.node_object),

    enum_shape_statement: ($) => seq(
      choice('enum', 'intEnum'),
      $.identifier,
      optional($.mixins),
      $.enum_members,
    ),
    enum_members: ($) => seq('{', repeat($.enum_member), '}'),
    enum_member: ($) => seq($.identifier, optional($.value_assignment)),

    shape_members: ($) => seq(
      '{',
      repeat($.shape_member),
      '}',
    ),
    shape_member: ($) => seq(
      optional($.trait_statements),
      choice(
        $.shape_member_kvp,
        $.shape_member_elided,
      ),
      optional($.value_assignment),
    ),
    shape_member_kvp: ($) => seq($.identifier, ':', $.shape_id),
    shape_member_elided: ($) => seq('$', $.identifier),

    operation_body: ($) => seq('{', repeat($.operation_member), '}'),
    operation_member: ($) => choice(
      $.shape_member_kvp,
      seq($.identifier, $.inline_structure),
      $.operation_errors,
    ),
    operation_errors: ($) => seq($.identifier, ':', '[', repeat($.operation_error), ']'),
    operation_error: ($) => $.identifier,

    inline_structure: ($) => seq(
      ':=',
      optional($.trait_statements),
      optional($.structure_resource),
      optional($.mixins),
      $.shape_members,
    ),

    trait_statements: ($) => repeat1($.trait),
    trait: ($) => seq('@', $.shape_id, optional($.trait_body)),
    trait_body: ($) => seq('(', optional($.trait_body_value), ')'),
    trait_body_value: ($) => choice($.trait_structure, $.node_value),
    trait_structure: ($) => repeat1($.trait_structure_kvp),
    trait_structure_kvp: ($) => seq($.node_object_key, ':', $.node_value),

    apply_trait_statement: ($) => choice($.apply_statement_singular, $.apply_statement_block),
    apply_statement_singular: ($) => seq('apply', $.shape_id, $.trait),
    apply_statement_block: ($) => seq('apply', $.shape_id, '{', optional($.trait_statements), '}'),

    mixins: ($) => seq('with', '[', repeat1($.shape_id), ']'),
    structure_resource: ($) => seq('for', $.shape_id),
    value_assignment: ($) => seq('=', $.node_value),

    comment: () => seq('//', /.*/),
    documentation_comment: () => seq('///', /.*/),

    node_value: ($) => choice($.node_array, $.node_object, $.literal, $.shape_id),
    node_object_key: ($) => choice($.string, $.identifier),
    node_array: ($) => seq(
      '[',
      repeat($.node_value),
      ']',
    ),
    node_object: ($) => seq(
      '{',
      repeat($.node_object_kvp),
      '}',
    ),
    node_object_kvp: ($) => seq($.node_object_key, ':', $.node_value),

    literal: ($) => choice(
      $.boolean,
      $.null,
      $.number,
      $.string,
    ),

    primitive: () => choice(...primitives),

    boolean: () => choice('true', 'false'),

    null: () => 'null',

    number: () => /\d+/,

    string: ($) => choice($._string_literal, $._multiline_string_literal),
    _string_literal: ($) => seq('"', alias(/[^"]*/, $.string_fragment), '"'),
    _multiline_string_literal: ($) => seq('"""', alias(/[^"\\]*(?:\\.[^"\\]*)*/, $.string_fragment), '"""'),


    identifier: () => /[A-Za-z_][A-Za-z0-9_]*/,
  },
});
