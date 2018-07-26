# babel-plugin-flatlist

React Native 0.49以下版本在某些Android机下inverted FlatList失效，表现为页面空白，问题主要集中出现在华为EMUI 5.0、Android 7.0.0等机型上。

官方有一些issue提到了以上问题，例如[#13522](https://github.com/facebook/react-native/issues/13522)、[#14462](https://github.com/facebook/react-native/issues/14462)等。

这有一个[pr](https://github.com/facebook/react-native/commit/b2fe048a0bad7cb29cf2660d20ea9730aa3a5fc7)修复了该问题。

这个pr同时也提出了一个JS端的解决方案，那就是给transform加一个`perspective: 1`属性。

本仓库应运而生，提供了一个自动添加`perspective: 1`的解决方案，避免拷贝`FlatList`源码。

> 由于某些原因，我们现在还在用0.48版本的React Native，暂不能升级到0.49版本;
> 而且我等前端码农没有修改Native端代码的权限，再加上Native端修复周期比较长，无法覆盖已发布版本，所以只好寻求JS端的解决方案。

如果你也有这种需求，可以参考本仓库。
