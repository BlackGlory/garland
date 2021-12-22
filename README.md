# garland
Folder hierarchy builder based on tags and symbolic links.

## Install
```sh
npm install -g garland
# or
yarn add garland
```

## 路径构造
garland发明了一种用YAML编写的路径构造定义文件.
用户通过该文件描述自己想要的层级结构, 然后通过`garland build`构建它.

```yaml
first-layer:
  $condition: 'layer-1'
  second-layer:
    $condition: 'layer-2'
```

关键字:
- `and`
- `or`
- `not`
- `xor`
- `(`, `)`

优先级:
- `(`, `)`
- `not`
- `and`
- `xor`
- `or`

## 注意事项
garland使用的标签系统应该遵循极简主义, 尽可能精简:
如果你不使用这些标签, 就没有理由添加这些标签.
请不要把标签作为一种"笔记"或"注释来使用,
仅添加你会在garland里使用的标签, 避免标签膨胀到无法管理.
