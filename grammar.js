module.exports = grammar({
  name: 'smithy',
  extras: $ => [
    /\s/,
    $.documentation_comment,
    $.comment
  ],

  rules: {
    // TODO: add the actual grammar rules
    source_file: $ =>
      seq(
        $.preamble,
        repeat($._definition)
      ),

    _definition: $ => choice(
      $.use_statement,
      seq($.trait_statements, $.shape_statement),
      $.shape_statement
    ),

    preamble: $ => seq(
      // repeat($.control_statement),
      repeat($.metadata_statement),
      $.namespace_statement
    ),

    use_statement: $ => seq('use', $.absolute_root_shape_id),
    namespace_statement: $ => seq('namespace', $.namespace),
    metadata_statement: $ => seq('metadata', $.identifier, '=', $.node_value),
    control_statement: $ => seq($.control_var_name, $.node_value),
    shape_statement: $ => choice(
      $.simple_shape_statement,
      $.list_shape_statement,
      $.map_shape_statement,
      $.set_shape_statement,
      $.structure_shape_statement,
      $.union_shape_statement,
      $.operation_shape_statement,
      $.resource_shape_statement,
      $.service_shape_statement
    ),

    absolute_root_shape_id: $ => seq($.namespace, '#', $.identifier),
    root_shape_id: $ => choice($.absolute_root_shape_id, $.identifier),
    shape_id_member: $ => seq('$', $.identifier),
    shape_id: $ => seq($.root_shape_id, repeat($.shape_id_member)),
    control_var_name: $ => seq('$', $.node_object_key, ':'),
    namespace: $ => seq($.identifier, repeat(seq('.', $.identifier))),

    simple_shape_statement: $ => seq($.simple_type_name, $.identifier),
    list_shape_statement: $ => seq('list', $.identifier, $.shape_members),
    set_shape_statement: $ => seq('set', $.identifier, $.shape_members),
    map_shape_statement: $ => seq('map', $.identifier, $.shape_members),
    structure_shape_statement: $ => seq('structure', $.identifier, $.shape_members),
    union_shape_statement: $ => seq('union', $.identifier, $.shape_members),

    service_shape_statement: $ => seq('service', $.identifier, $.node_object),
    operation_shape_statement: $ => seq('operation', $.identifier, $.node_object),
    resource_shape_statement: $ => seq('resource', $.identifier, $.node_object),


    shape_members: $ => choice($.empty_shape_members, $.populated_shape_members),
    empty_shape_members: $ => seq('{', '}'),
    populated_shape_members: $ => seq(
      '{',
      $.shape_member_kvp,
      repeat(seq(',', $.shape_member_kvp)),
      optional(','),
      '}'
    ),
    shape_member_kvp: $ => choice(
      seq($.trait_statements, seq($.identifier, ':', $.shape_id)),
      seq($.identifier, ':', $.shape_id)
    ),

    trait_statements: $ => repeat1($.trait),
    trait: $ => seq('@', $.shape_id, repeat($.trait_body)),
    trait_body: $ => seq('(', $.trait_body_value, ')'),
    trait_body_value: $ => choice($.trait_structure, $.node_value),
    trait_structure: $ => seq($.trait_structure_kvp, repeat(seq(',', $.trait_structure_kvp))),
    trait_structure_kvp: $ => seq($.node_object_key, ':', $.node_value),
    apply_trait_statement: $ => seq('apply', $.shape_id, $.trait),

    comment: $ => seq('//', /.*/),
    documentation_comment: $ => seq('///', /.*/),

    node_value: $ => choice($.node_array, $.node_object, $.node_keywords, $.node_string_value, $.number),
    node_object_key: $ => choice($.quoted_text, $.identifier),
    node_string_value: $ => choice($.shape_id, $.text_block, $.quoted_text),
    node_array: $ => choice($.empty_node_array, $.populated_node_array),
    empty_node_array: $ => seq('[', ']'),
    populated_node_array: $ => seq('[', $.node_value, repeat(seq(',', $.node_value)), optional(','), ']'),
    node_object: $ => choice($.empty_node_object, $.populated_node_object),
    empty_node_object: $ => seq('{', '}'),
    populated_node_object: $ => seq(
      '{',
      $.node_object_kvp,
      repeat(seq(',', $.node_object_kvp)),
      optional(','),
      '}'
    ),
    node_object_kvp: $ => seq($.node_object_key, ':', $.node_value),
    node_keywords: $ => /true|false|null/,

    identifier: $ => /([_]*)([a-zA-Z])([a-zA-Z0-9_]*)/,
    text_block: $ => /"""(.*?)"""/,
    quoted_text: $ => /"([^"]*)"/,
    simple_type_name: $ => /blob|boolean|string|byte|short|integer|long|float|double|bigInteger|timestamp|document/,

    number: $ => /\d+/,
  }
});
