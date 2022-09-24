module.exports = grammar({
  name: 'smithy',
  extras: $ => [
    /\s/,
    ',',
    $.documentation_comment,
    $.comment
  ],

  rules: {
    source_file: $ =>
      seq(
        optional($.control_section),
        optional($.metadata_section),
        optional($.definition_section)
      ),

    control_section: $ => repeat1($.control_statement),
    control_statement: $ => seq('$', $.node_object_key, ':', $.node_value),

    metadata_section: $ => repeat1($.metadata_statement),
    metadata_statement: $ => seq("metadata", $.node_object_key, '=', $.node_value),

    definition_section: $ => seq($.namespace_statement, optional($.use_section), optional($.definition_statements)),

    namespace_statement: $ => seq('namespace', $.namespace),

    use_section: $ => repeat1($.use_statement),
    use_statement: $ => seq('use', $.absolute_root_shape_id),

    definition_statements: $ => repeat1($.definition_statement),
    definition_statement: $ => choice($.shape_statement, $.apply_statement),

    shape_statement: $ => seq(optional($.trait_statements), $.shape_body),

    apply_statement: $ => choice($.apply_statement_singular, $.apply_statement_block),
    apply_statement_singular: $ => seq('apply', $.shape_id, $.trait),
    apply_statement_block: $ => seq('apply', $.shape_id, '{', optional($.trait_statements), '}'),

    trait_statements: $ => repeat1($.trait),
    trait: $ => seq('@', $.shape_id, optional($.trait_body)),
    trait_body: $ => seq('(', optional($.trait_body_value), ')'),
    trait_body_value: $ => choice($.trait_structure, $.node_value),
    trait_structure: $ => repeat1($.trait_structure_kvp),
    trait_structure_kvp: $ => seq($.node_object_key, ':', $.node_value),

    shape_body: $ => choice(
      $.simple_shape_statement,
      $.enum_shape_statement,
      $.list_statement,
      $.map_statement,
      $.structure_statement,
      $.union_statement,
      $.service_statement,
      $.resource_statement,
      $.operation_statement
    ),

    simple_shape_statement: $ => seq($.simple_type_name, $.identifier, optional($.mixins)),

    enum_shape_statement: $ => seq($.enum_type_name, $.identifier, optional($.mixins), $.enum_members),
    enum_type_name: $ => choice('enum', 'intEnum'),
    enum_members: $ => seq('{', repeat($.enum_member), '}'),
    enum_member: $ => seq($.identifier, optional($.value_assignment)),

    list_statement: $ => seq($.list_type_name, $.identifier, optional($.mixins), $.shape_members),
    list_type_name: $ => choice('list', 'set'),

    map_statement: $ => seq('map', $.identifier, optional($.mixins), $.shape_members),

    structure_statement: $ => seq('structure', $.identifier, optional($.structure_resource), optional($.mixins), $.shape_members_with_assignment),
    structure_resource: $ => seq('for', $.shape_id),

    union_statement: $ => seq('union', $.identifier, optional($.mixins), $.shape_members),

    service_statement: $ => seq('service', $.identifier, optional($.mixins), $.node_object),

    resource_statement: $ => seq('resource', $.identifier, optional($.mixins), $.node_object),

    operation_statement: $ => seq('operation', $.identifier, optional($.mixins), $.operation_body),
    operation_body: $ => seq('{', repeat($.operation_member), '}'),
    operation_member: $ => choice(
      $.explicit_member,
      seq($.identifier, $.inline_structure),
      seq($.identifier, ':', '[', repeat($.identifier) ,']')
    ),

    inline_structure: $ => seq(':=', optional($.trait_statements), optional($.structure_resource), optional($.mixins), $.shape_members_with_assignment),

    shape_members_with_assignment: $ => seq('{', repeat($.shape_member_with_assignment), '}'),
    shape_member_with_assignment: $ => seq(
      optional($.trait_statements),
      choice($.elided_member, $.explicit_member),
      optional($.value_assignment)
    ),

    shape_members: $ => seq('{', repeat($.shape_member), '}'),
    shape_member: $ => seq(optional($.trait_statements), choice($.elided_member, $.explicit_member)),
    elided_member: $ => seq('$', $.identifier),
    explicit_member: $ => seq($.identifier, ':', $.shape_id),

    value_assignment: $ => seq('=', $.node_value),

    mixins: $ => seq('with', '[', repeat1($.shape_id), ']'),

    node_value: $ => choice(
      $.node_object,
      $.node_array,
      $.number,
      $.node_keywords,
      $.node_string_value
    ),
    node_object: $ => seq('{', repeat($.node_object_kvp), '}'),
    node_object_kvp: $ => seq($.node_object_key, ':', $.node_value),
    node_object_key: $ => choice($.quoted_text, $.identifier),
    node_array: $ => seq('[', repeat($.node_value), ']'),
    node_string_value: $ => choice($.shape_id, $.text_block, $.quoted_text),

    shape_id: $ => prec.left(seq($.root_shape_id, optional($.shape_id_member))),
    root_shape_id: $ => choice($.absolute_root_shape_id, $.identifier),
    absolute_root_shape_id: $ => seq($.namespace, '#', $.identifier),
    namespace: $ => seq($.identifier, repeat(seq('.', $.identifier))),
    shape_id_member: $ => seq('$', $.identifier),

    node_keywords: $ => /true|false|null/,

    identifier: $ => /([_]*)([a-zA-Z])([a-zA-Z0-9_]*)/,
    text_block: $ => /"""(.*?)"""/,
    quoted_text: $ => /"([^"]*)"/,
    simple_type_name: $ => /blob|boolean|string|byte|short|integer|long|float|double|bigInteger|timestamp|document/,

    number: $ => /\d+/,

    comment: $ => seq('//', /.*/),
    documentation_comment: $ => seq('///', /.*/),
  }
});
