# Known Gotchas

## Excel support

### Avoiding excel auto-formatting

Excel tries to automatically detect the format of every field (number, date, string, etc.) regardless of whether the field is quoted or not.

This might produce few undesired effects with, for example, serial numbers:

- Large numbers are displayed using scientific notation
- Leading zeros are stripped.

Enabling the `excelString` option produces an Excel-specific CSV file that forces Excel to interpret string fields as strings. Please note that the CSV will look incorrect if viewing it somewhere else than Excel.

### Avoiding CSV injection

As part of Excel automatically format detection, fields regarded as formulas (starting with `=`, `+`, `-` or `@`) are interpreted regardless of whether the field is quoted or not, creating a security risk (see [CSV Injection](https://www.owasp.org/index.php/CSV_Injection).

This issue has nothing to do with the CSV format, since CSV knows nothing about formulas, but with how Excel parses CSV files.

Enabling the `excelString` option produces an Excel-specific CSV file that forces Excel to interpret string fields as strings. Please note that the CSV will look incorrect if viewing it somewhere else than Excel.

### Preserving new lines

Excel only recognizes `\r\n` as valid new line inside a cell.

### Unicode Support

Excel can display Unicode correctly (just setting the `withBOM` option to true). However, Excel can't save unicode so, if you perform any changes to the CSV and save it from Excel, the Unicode characters will not be displayed correctly.

### SYLK error

Excel assumes that the .csv file is a SYLK file type if the first two characters of the .csv file are uppercase `ID`. Avoid using `ID` as the first column name. Or simply use lowercase `id`.

## PowerShell escaping

PowerShell do some estrange double quote escaping escaping which results on each line of the CSV missing the first and last quote if outputting the result directly to stdout. Instead of that, it's advisable that you write the result directly to a file.
