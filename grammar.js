/* eslint-disable arrow-parens */
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
  extras: $ => [
    /\s/,
    $.comment,
    $.documentation_comment,
    ',', // commas are whitespace in smithy
  ],

  rules: {
    source_file: $ =>
      seq(
        optional($.control_section),
        optional($.metadata_section),
        optional($.shape_section),
      ),

    control_section: $ => repeat1($.control_statement),
    control_statement: $ => seq($.control_var_name, $.node_value),
    control_var_name: $ => seq('$', alias(choice($.string, $._control_identifier), $.control_key), ':'),

    metadata_section: $ => repeat1($.metadata_statement),
    metadata_statement: $ => seq('metadata', choice($.identifier, $.string), '=', $.node_value),

    shape_section: $ => seq(
      $.namespace_statement,
      repeat($._definition),
    ),

    namespace_statement: $ => seq('namespace', $.namespace),
    namespace: $ => seq($._namespace_identifier, repeat(seq('.', $._namespace_identifier))),

    _definition: $ => choice(
      $.use_statement,
      $.apply_statement,
      $.shape_statement,
    ),

    use_statement: $ => seq('use', $.absolute_root_shape_id),

    shape_statement: $ => seq(repeat($.trait_statement), $.shape_body),
    shape_body: $ => choice(
      $.simple_shape_statement,
      $.enum_statement,
      $.list_statement,
      $.map_statement,
      $.set_statement,
      $.structure_statement,
      $.union_statement,
      $.service_statement,
      $.operation_statement,
      $.resource_statement,
    ),

    absolute_root_shape_id: $ => seq($.namespace, '#', $.identifier),
    root_shape_id: $ => choice($.absolute_root_shape_id, $.identifier),
    shape_id_member: $ => seq('$', $.identifier),
    shape_id: $ => prec.left(seq($.root_shape_id, repeat($.shape_id_member))),

    simple_shape_statement: $ => seq($.primitive, $.identifier, optional($.mixins)),

    enum_statement: $ => seq(
      choice('enum', 'intEnum'),
      $.identifier,
      optional($.mixins),
      $.enum_members,
    ),
    enum_members: $ => seq('{', repeat($.enum_member), '}'),
    enum_member: $ =>
      seq(
        repeat($.trait_statement),
        alias($.identifier, $.enum_field),
        optional($.value_assignment),
      ),

    // Container Types
    list_statement: $ => seq('list', $.identifier, optional($.mixins), $.shape_members),
    map_statement: $ => seq('map', $.identifier, optional($.mixins), $.shape_members),
    set_statement: $ => seq('set', $.identifier, optional($.mixins), $.shape_members),

    structure_statement: $ => seq(
      'structure',
      $.identifier,
      optional($.structure_resource),
      optional($.mixins),
      $.shape_members,
    ),

    union_statement: $ => seq('union', $.identifier, optional($.mixins), $.shape_members),

    service_statement: $ => seq('service', $.identifier, optional($.mixins), $.node_object),

    operation_statement: $ => seq('operation', $.identifier, optional($.mixins), $.operation_body),

    resource_statement: $ => seq('resource', $.identifier, optional($.mixins), $.node_object),

    shape_members: $ => seq('{', repeat($.shape_member), '}'),
    shape_member: $ => seq(
      repeat($.trait_statement),
      choice(
        seq(alias($.identifier, $.field), ':', $.shape_id),
        $.shape_member_elided,
      ),
      optional($.value_assignment),
    ),
    shape_member_elided: $ => seq('$', $.identifier),

    operation_body: $ => seq('{', repeat($.operation_member), '}'),
    operation_member: $ => prec.left(
      choice(
        repeat1(seq(alias($.identifier, $.operation_field), ':', $.shape_id)),
        seq($.identifier, $.inline_structure),
        seq($.operation_errors, optional(',')),
      ),
    ),
    operation_errors: $ => seq(alias($.identifier, $.operation_error_field), ':', '[', repeat($.operation_error), ']'),
    operation_error: $ => $.identifier,

    inline_structure: $ => seq(
      ':=',
      repeat($.trait_statement),
      optional($.structure_resource),
      optional($.mixins),
      $.shape_members,
    ),

    trait_statement: $ => seq('@', $.shape_id, optional($.trait_body)),
    trait_body: $ => seq('(', optional($.trait_body_value), ')'),
    trait_body_value: $ => choice($.trait_structure, alias($.node_value, $.trait_node_value)),
    trait_structure: $ => repeat1(alias($.node_object_kvp, $.trait_object_kvp)),

    apply_statement: $ => choice($.apply_statement_singular, $.apply_statement_block),
    apply_statement_singular: $ => seq('apply', $.shape_id, $.trait_statement),
    apply_statement_block: $ => seq('apply', $.shape_id, '{', repeat($.trait_statement), '}'),

    mixins: $ => seq('with', '[', repeat1($.shape_id), ']'),
    structure_resource: $ => seq('for', $.shape_id),
    value_assignment: $ => seq('=', $.node_value),

    node_value: $ =>
      choice(
        $.node_array,
        $.node_object,
        $.literal,
        $.shape_id,
      ),
    node_array: $ => seq(
      '[',
      repeat($.node_value),
      ']',
    ),
    node_object: $ => seq(
      '{',
      repeat($.node_object_kvp),
      '}',
    ),
    node_object_kvp: $ => seq($.node_object_key, ':', $.node_value),
    node_object_key: $ => choice($.string, alias($.identifier, $.key_identifier)),

    literal: $ => choice(
      $.boolean,
      $.null,
      $.number,
      $.float,
      $.string,
    ),

    primitive: () => choice(...primitives),

    boolean: () => choice('true', 'false'),

    null: () => 'null',

    number: () => seq(optional('-'), /\d+/),

    float: () => seq(optional('-'), /(\d+(\.\d+)?|\.\d+)([Ee][+-]?\d+)?/),

    // Partial credit to https://github.com/tree-sitter/tree-sitter-javascript/blob/15e85e80b851983fab6b12dce5a535f5a0df0f9c/grammar.js#L906
    string: $ => choice($._string_literal, $._multiline_string_literal),
    _string_literal: $ => seq(
      '"',
      repeat(choice(
        $.string_fragment,
        $._escape_sequence,
      )),
      '"',
    ),
    _multiline_string_literal: $ => seq(
      '"""',
      repeat(choice(
        alias($._multiline_string_fragment, $.multiline_string_fragment),
        $._escape_sequence,
      )),
      '"""',
    ),
    // Workaround to https://github.com/tree-sitter/tree-sitter/issues/1156
    // We give names to the token() constructs containing a regexp
    // so as to obtain a node in the CST.
    //
    string_fragment: () =>
      token.immediate(prec(1, /[^"\\]+/)),
    _multiline_string_fragment: () =>
      prec.right(choice(
        /[^"]+/,
        seq(/"[^"]*"/, repeat(/[^"]+/)),
      )),
    _escape_sequence: $ =>
      choice(
        prec(2, token.immediate(seq('\\', /[^abfnrtvxu'\"\\\?]/))),
        prec(1, $.escape_sequence),
      ),
    escape_sequence: () => token.immediate(seq(
      '\\',
      choice(
        /[^xu0-7]/,
        /[0-7]{1,3}/,
        /x[0-9a-fA-F]{2}/,
        /u[0-9a-fA-F]{4}/,
        /u{[0-9a-fA-F]+}/,
      ))),

    identifier: () => /[A-Za-z_][A-Za-z0-9_]*/,
    _control_identifier: () => /[A-Za-z_][A-Za-z0-9_]*/,
    _namespace_identifier: () => /[A-Za-z_][A-Za-z0-9_]*/,

    comment: () => token(seq('//', /.*/)),
    documentation_comment: () => seq('///', /.*/),
  },
});
