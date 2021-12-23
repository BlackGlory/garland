# garland
A folder hierarchy builder based on tags and symbolic links.

```
Usage: garland [options] [command]

A folder hierarchy builder based on tags and symbolic links

Options:
  -V, --version                 output the version number
  --tag-definitions <filename>  tag definitions file
  -h, --help                    display help for command

Commands:
  tags                          list all tags
  build <blueprint>             build folder hierarchy
  test <expression>             test condition expression
  help [command]                display help for command
```

## Install
```sh
npm install -g garland
# or
yarn add garland
```

## Tag definitions file
The tag definitions file is a YAML file with path and tag pairs.

When used in the `garland build`,
the path in the tag definitions file is relative to the path of the file.

Structure:
```ts
interface ITagDefinitions {
  [path: string]: string[] | ITagDefinitions
}
```

Example 1:
```yaml
example1.com:
  owner1:
    repo1: [tag1, tag2]

  owner2:
    repo2: [tag2, tag3]

example2.com:
  owner3:
    repo3: [tag3, tag4]
```

Example 2 (equivalent to Example 1):
```yaml
example1.com/owner1/repo1: [tag1, tag2]
example1.com/owner2/repo2: [tag2, tag3]
example2.com/owner3/repo3: [tag3, tag4]
```

## Blueprint file
The blueprint file is a YAML file with path and condition expression pairs.

When used in the `garland build`,
the path in the blueprint file is relative to the path of current working directory.

The `$condition` field is used to write related condition expression (see below),
When a path has multiple `$condition` fields,
the logic `and` is implicitly included.

Structure:
```ts
interface IBlueprint {
  [path: string]: {
    $condition?: string
    [path: string]: IBlueprint | null 
  } | null
}
```

Example:
```yaml
# Create a folder `match-condition` and link all items that match condition `tag` there.
match-condition:
  $condition: 'tag'

# Just create a folder `no-condition`.
no-condition:

# Create a folder `match-condition/subpath` and link all items that match condition `tag` there.
match-condition:
  $condition: 'tag'
  subpath:
# Same as
match-condition:
  subpath:
    $condition: 'tag'
# Same as
match-condition/subpath:
  $condition: 'tag'

# Create folder `mulitple-conditions/subpath-a` and `multiple-conditions/subpath-b`.
# Link all items that match condition `(tag) and (tag-a)` there.
# Link all items that match condition `(tag) and (tag-b)` there.
multiple-conditions:
  $condition: 'tag'
  subpath-a:
    $condition: 'tag-a'
  subpath-b:
    $condition: 'tag-b'
```

## Condition expression
Condition expression is a DSL represented by strings,
which is used to perform logical operations on tags.

Tags are used as identifiers in this DSL,
limited by the parser,
identifiers can only use `[a-zA-Z0-9_-]` characters.
Tags that exist are true values,
and tags that do not exist are false values.

Keywords:
- `and`
- `or`
- `not`
- `xor`
- `(`, `)`

Operator precedence:
- `(`, `)`
- `not`
- `and`
- `xor`
- `or`

## Suggestion
The tags used by garland should follow minimalism:
- If you don't use the tag, there is no reason to remain it.
- Do not use tags as a kind of *notes* or *comments*.
- Only add the tags you will use in garland to avoid the number of tags growing to the point of being unmanageable.
