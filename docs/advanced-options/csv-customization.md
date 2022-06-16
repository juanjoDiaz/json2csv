# CSV customization

The are a number of options to customize the resulting CSV.

* `defaultValue` [&lt;Any&gt;]() value to use when missing data. Defaults to `<empty>` if not specified. (Overridden by `fields[].default`)
* `delimiter` [&lt;String&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)  delimiter of columns. Defaults to `,` if not specified.
* `eol` [&lt;String&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)  overrides the default OS line ending (i.e. `\n` on Unix and `\r\n` on Windows).
* `header` [&lt;Boolean&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)  determines whether or not CSV file will contain a title column. Defaults to `true` if not specified.
* `includeEmptyRows` [&lt;Boolean&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean) includes empty rows. Defaults to `false`.
* `withBOM` [&lt;Boolean&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean) with BOM character. Defaults to `false`.