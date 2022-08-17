(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));

  // node_modules/@streamparser/json/dist/umd/index.js
  var require_umd = __commonJS({
    "node_modules/@streamparser/json/dist/umd/index.js"(exports, module) {
      (function(global2, factory) {
        typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : (global2 = typeof globalThis !== "undefined" ? globalThis : global2 || self, factory(global2.jsonparse = {}));
      })(exports, function(exports2) {
        "use strict";
        var extendStatics = function(d, b) {
          extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
            d2.__proto__ = b2;
          } || function(d2, b2) {
            for (var p in b2)
              if (Object.prototype.hasOwnProperty.call(b2, p))
                d2[p] = b2[p];
          };
          return extendStatics(d, b);
        };
        function __extends(d, b) {
          if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
          extendStatics(d, b);
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        }
        var __assign = function() {
          __assign = Object.assign || function __assign2(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
              s = arguments[i];
              for (var p in s)
                if (Object.prototype.hasOwnProperty.call(s, p))
                  t[p] = s[p];
            }
            return t;
          };
          return __assign.apply(this, arguments);
        };
        var _a;
        var charset;
        (function(charset2) {
          charset2[charset2["BACKSPACE"] = 8] = "BACKSPACE";
          charset2[charset2["FORM_FEED"] = 12] = "FORM_FEED";
          charset2[charset2["NEWLINE"] = 10] = "NEWLINE";
          charset2[charset2["CARRIAGE_RETURN"] = 13] = "CARRIAGE_RETURN";
          charset2[charset2["TAB"] = 9] = "TAB";
          charset2[charset2["SPACE"] = 32] = "SPACE";
          charset2[charset2["EXCLAMATION_MARK"] = 33] = "EXCLAMATION_MARK";
          charset2[charset2["QUOTATION_MARK"] = 34] = "QUOTATION_MARK";
          charset2[charset2["NUMBER_SIGN"] = 35] = "NUMBER_SIGN";
          charset2[charset2["DOLLAR_SIGN"] = 36] = "DOLLAR_SIGN";
          charset2[charset2["PERCENT_SIGN"] = 37] = "PERCENT_SIGN";
          charset2[charset2["AMPERSAND"] = 38] = "AMPERSAND";
          charset2[charset2["APOSTROPHE"] = 39] = "APOSTROPHE";
          charset2[charset2["LEFT_PARENTHESIS"] = 40] = "LEFT_PARENTHESIS";
          charset2[charset2["RIGHT_PARENTHESIS"] = 41] = "RIGHT_PARENTHESIS";
          charset2[charset2["ASTERISK"] = 42] = "ASTERISK";
          charset2[charset2["PLUS_SIGN"] = 43] = "PLUS_SIGN";
          charset2[charset2["COMMA"] = 44] = "COMMA";
          charset2[charset2["HYPHEN_MINUS"] = 45] = "HYPHEN_MINUS";
          charset2[charset2["FULL_STOP"] = 46] = "FULL_STOP";
          charset2[charset2["SOLIDUS"] = 47] = "SOLIDUS";
          charset2[charset2["DIGIT_ZERO"] = 48] = "DIGIT_ZERO";
          charset2[charset2["DIGIT_ONE"] = 49] = "DIGIT_ONE";
          charset2[charset2["DIGIT_TWO"] = 50] = "DIGIT_TWO";
          charset2[charset2["DIGIT_THREE"] = 51] = "DIGIT_THREE";
          charset2[charset2["DIGIT_FOUR"] = 52] = "DIGIT_FOUR";
          charset2[charset2["DIGIT_FIVE"] = 53] = "DIGIT_FIVE";
          charset2[charset2["DIGIT_SIX"] = 54] = "DIGIT_SIX";
          charset2[charset2["DIGIT_SEVEN"] = 55] = "DIGIT_SEVEN";
          charset2[charset2["DIGIT_EIGHT"] = 56] = "DIGIT_EIGHT";
          charset2[charset2["DIGIT_NINE"] = 57] = "DIGIT_NINE";
          charset2[charset2["COLON"] = 58] = "COLON";
          charset2[charset2["SEMICOLON"] = 59] = "SEMICOLON";
          charset2[charset2["LESS_THAN_SIGN"] = 60] = "LESS_THAN_SIGN";
          charset2[charset2["EQUALS_SIGN"] = 61] = "EQUALS_SIGN";
          charset2[charset2["GREATER_THAN_SIGN"] = 62] = "GREATER_THAN_SIGN";
          charset2[charset2["QUESTION_MARK"] = 63] = "QUESTION_MARK";
          charset2[charset2["COMMERCIAL_AT"] = 64] = "COMMERCIAL_AT";
          charset2[charset2["LATIN_CAPITAL_LETTER_A"] = 65] = "LATIN_CAPITAL_LETTER_A";
          charset2[charset2["LATIN_CAPITAL_LETTER_B"] = 66] = "LATIN_CAPITAL_LETTER_B";
          charset2[charset2["LATIN_CAPITAL_LETTER_C"] = 67] = "LATIN_CAPITAL_LETTER_C";
          charset2[charset2["LATIN_CAPITAL_LETTER_D"] = 68] = "LATIN_CAPITAL_LETTER_D";
          charset2[charset2["LATIN_CAPITAL_LETTER_E"] = 69] = "LATIN_CAPITAL_LETTER_E";
          charset2[charset2["LATIN_CAPITAL_LETTER_F"] = 70] = "LATIN_CAPITAL_LETTER_F";
          charset2[charset2["LATIN_CAPITAL_LETTER_G"] = 71] = "LATIN_CAPITAL_LETTER_G";
          charset2[charset2["LATIN_CAPITAL_LETTER_H"] = 72] = "LATIN_CAPITAL_LETTER_H";
          charset2[charset2["LATIN_CAPITAL_LETTER_I"] = 73] = "LATIN_CAPITAL_LETTER_I";
          charset2[charset2["LATIN_CAPITAL_LETTER_J"] = 74] = "LATIN_CAPITAL_LETTER_J";
          charset2[charset2["LATIN_CAPITAL_LETTER_K"] = 75] = "LATIN_CAPITAL_LETTER_K";
          charset2[charset2["LATIN_CAPITAL_LETTER_L"] = 76] = "LATIN_CAPITAL_LETTER_L";
          charset2[charset2["LATIN_CAPITAL_LETTER_M"] = 77] = "LATIN_CAPITAL_LETTER_M";
          charset2[charset2["LATIN_CAPITAL_LETTER_N"] = 78] = "LATIN_CAPITAL_LETTER_N";
          charset2[charset2["LATIN_CAPITAL_LETTER_O"] = 79] = "LATIN_CAPITAL_LETTER_O";
          charset2[charset2["LATIN_CAPITAL_LETTER_P"] = 80] = "LATIN_CAPITAL_LETTER_P";
          charset2[charset2["LATIN_CAPITAL_LETTER_Q"] = 81] = "LATIN_CAPITAL_LETTER_Q";
          charset2[charset2["LATIN_CAPITAL_LETTER_R"] = 82] = "LATIN_CAPITAL_LETTER_R";
          charset2[charset2["LATIN_CAPITAL_LETTER_S"] = 83] = "LATIN_CAPITAL_LETTER_S";
          charset2[charset2["LATIN_CAPITAL_LETTER_T"] = 84] = "LATIN_CAPITAL_LETTER_T";
          charset2[charset2["LATIN_CAPITAL_LETTER_U"] = 85] = "LATIN_CAPITAL_LETTER_U";
          charset2[charset2["LATIN_CAPITAL_LETTER_V"] = 86] = "LATIN_CAPITAL_LETTER_V";
          charset2[charset2["LATIN_CAPITAL_LETTER_W"] = 87] = "LATIN_CAPITAL_LETTER_W";
          charset2[charset2["LATIN_CAPITAL_LETTER_X"] = 88] = "LATIN_CAPITAL_LETTER_X";
          charset2[charset2["LATIN_CAPITAL_LETTER_Y"] = 89] = "LATIN_CAPITAL_LETTER_Y";
          charset2[charset2["LATIN_CAPITAL_LETTER_Z"] = 90] = "LATIN_CAPITAL_LETTER_Z";
          charset2[charset2["LEFT_SQUARE_BRACKET"] = 91] = "LEFT_SQUARE_BRACKET";
          charset2[charset2["REVERSE_SOLIDUS"] = 92] = "REVERSE_SOLIDUS";
          charset2[charset2["RIGHT_SQUARE_BRACKET"] = 93] = "RIGHT_SQUARE_BRACKET";
          charset2[charset2["CIRCUMFLEX_ACCENT"] = 94] = "CIRCUMFLEX_ACCENT";
          charset2[charset2["LOW_LINE"] = 95] = "LOW_LINE";
          charset2[charset2["GRAVE_ACCENT"] = 96] = "GRAVE_ACCENT";
          charset2[charset2["LATIN_SMALL_LETTER_A"] = 97] = "LATIN_SMALL_LETTER_A";
          charset2[charset2["LATIN_SMALL_LETTER_B"] = 98] = "LATIN_SMALL_LETTER_B";
          charset2[charset2["LATIN_SMALL_LETTER_C"] = 99] = "LATIN_SMALL_LETTER_C";
          charset2[charset2["LATIN_SMALL_LETTER_D"] = 100] = "LATIN_SMALL_LETTER_D";
          charset2[charset2["LATIN_SMALL_LETTER_E"] = 101] = "LATIN_SMALL_LETTER_E";
          charset2[charset2["LATIN_SMALL_LETTER_F"] = 102] = "LATIN_SMALL_LETTER_F";
          charset2[charset2["LATIN_SMALL_LETTER_G"] = 103] = "LATIN_SMALL_LETTER_G";
          charset2[charset2["LATIN_SMALL_LETTER_H"] = 104] = "LATIN_SMALL_LETTER_H";
          charset2[charset2["LATIN_SMALL_LETTER_I"] = 105] = "LATIN_SMALL_LETTER_I";
          charset2[charset2["LATIN_SMALL_LETTER_J"] = 106] = "LATIN_SMALL_LETTER_J";
          charset2[charset2["LATIN_SMALL_LETTER_K"] = 107] = "LATIN_SMALL_LETTER_K";
          charset2[charset2["LATIN_SMALL_LETTER_L"] = 108] = "LATIN_SMALL_LETTER_L";
          charset2[charset2["LATIN_SMALL_LETTER_M"] = 109] = "LATIN_SMALL_LETTER_M";
          charset2[charset2["LATIN_SMALL_LETTER_N"] = 110] = "LATIN_SMALL_LETTER_N";
          charset2[charset2["LATIN_SMALL_LETTER_O"] = 111] = "LATIN_SMALL_LETTER_O";
          charset2[charset2["LATIN_SMALL_LETTER_P"] = 112] = "LATIN_SMALL_LETTER_P";
          charset2[charset2["LATIN_SMALL_LETTER_Q"] = 113] = "LATIN_SMALL_LETTER_Q";
          charset2[charset2["LATIN_SMALL_LETTER_R"] = 114] = "LATIN_SMALL_LETTER_R";
          charset2[charset2["LATIN_SMALL_LETTER_S"] = 115] = "LATIN_SMALL_LETTER_S";
          charset2[charset2["LATIN_SMALL_LETTER_T"] = 116] = "LATIN_SMALL_LETTER_T";
          charset2[charset2["LATIN_SMALL_LETTER_U"] = 117] = "LATIN_SMALL_LETTER_U";
          charset2[charset2["LATIN_SMALL_LETTER_V"] = 118] = "LATIN_SMALL_LETTER_V";
          charset2[charset2["LATIN_SMALL_LETTER_W"] = 119] = "LATIN_SMALL_LETTER_W";
          charset2[charset2["LATIN_SMALL_LETTER_X"] = 120] = "LATIN_SMALL_LETTER_X";
          charset2[charset2["LATIN_SMALL_LETTER_Y"] = 121] = "LATIN_SMALL_LETTER_Y";
          charset2[charset2["LATIN_SMALL_LETTER_Z"] = 122] = "LATIN_SMALL_LETTER_Z";
          charset2[charset2["LEFT_CURLY_BRACKET"] = 123] = "LEFT_CURLY_BRACKET";
          charset2[charset2["VERTICAL_LINE"] = 124] = "VERTICAL_LINE";
          charset2[charset2["RIGHT_CURLY_BRACKET"] = 125] = "RIGHT_CURLY_BRACKET";
          charset2[charset2["TILDE"] = 126] = "TILDE";
        })(charset || (charset = {}));
        var escapedSequences = (_a = {}, _a[charset.QUOTATION_MARK] = charset.QUOTATION_MARK, _a[charset.REVERSE_SOLIDUS] = charset.REVERSE_SOLIDUS, _a[charset.SOLIDUS] = charset.SOLIDUS, _a[charset.LATIN_SMALL_LETTER_B] = charset.BACKSPACE, _a[charset.LATIN_SMALL_LETTER_F] = charset.FORM_FEED, _a[charset.LATIN_SMALL_LETTER_N] = charset.NEWLINE, _a[charset.LATIN_SMALL_LETTER_R] = charset.CARRIAGE_RETURN, _a[charset.LATIN_SMALL_LETTER_T] = charset.TAB, _a);
        var utf8 = /* @__PURE__ */ Object.freeze({
          __proto__: null,
          get charset() {
            return charset;
          },
          escapedSequences
        });
        var NonBufferedString = function() {
          function NonBufferedString2() {
            this.decoder = new TextDecoder("utf-8");
            this.string = "";
            this.byteLength = 0;
          }
          NonBufferedString2.prototype.appendChar = function(char) {
            this.string += String.fromCharCode(char);
            this.byteLength += 1;
          };
          NonBufferedString2.prototype.appendBuf = function(buf, start, end) {
            if (start === void 0) {
              start = 0;
            }
            if (end === void 0) {
              end = buf.length;
            }
            this.string += this.decoder.decode(buf.subarray(start, end));
            this.byteLength += end - start;
          };
          NonBufferedString2.prototype.reset = function() {
            this.string = "";
            this.byteLength = 0;
          };
          NonBufferedString2.prototype.toString = function() {
            return this.string;
          };
          return NonBufferedString2;
        }();
        var BufferedString = function() {
          function BufferedString2(bufferSize) {
            this.decoder = new TextDecoder("utf-8");
            this.bufferOffset = 0;
            this.string = "";
            this.byteLength = 0;
            this.buffer = new Uint8Array(bufferSize);
          }
          BufferedString2.prototype.appendChar = function(char) {
            if (this.bufferOffset >= this.buffer.length)
              this.flushStringBuffer();
            this.buffer[this.bufferOffset++] = char;
            this.byteLength += 1;
          };
          BufferedString2.prototype.appendBuf = function(buf, start, end) {
            if (start === void 0) {
              start = 0;
            }
            if (end === void 0) {
              end = buf.length;
            }
            var size = end - start;
            if (this.bufferOffset + size > this.buffer.length)
              this.flushStringBuffer();
            this.buffer.set(buf.subarray(start, end), this.bufferOffset);
            this.bufferOffset += size;
            this.byteLength += size;
          };
          BufferedString2.prototype.flushStringBuffer = function() {
            this.string += this.decoder.decode(this.buffer.subarray(0, this.bufferOffset));
            this.bufferOffset = 0;
          };
          BufferedString2.prototype.reset = function() {
            this.string = "";
            this.bufferOffset = 0;
            this.byteLength = 0;
          };
          BufferedString2.prototype.toString = function() {
            this.flushStringBuffer();
            return this.string;
          };
          return BufferedString2;
        }();
        exports2.TokenType = void 0;
        (function(TokenType2) {
          TokenType2[TokenType2["LEFT_BRACE"] = 1] = "LEFT_BRACE";
          TokenType2[TokenType2["RIGHT_BRACE"] = 2] = "RIGHT_BRACE";
          TokenType2[TokenType2["LEFT_BRACKET"] = 3] = "LEFT_BRACKET";
          TokenType2[TokenType2["RIGHT_BRACKET"] = 4] = "RIGHT_BRACKET";
          TokenType2[TokenType2["COLON"] = 5] = "COLON";
          TokenType2[TokenType2["COMMA"] = 6] = "COMMA";
          TokenType2[TokenType2["TRUE"] = 7] = "TRUE";
          TokenType2[TokenType2["FALSE"] = 8] = "FALSE";
          TokenType2[TokenType2["NULL"] = 9] = "NULL";
          TokenType2[TokenType2["STRING"] = 10] = "STRING";
          TokenType2[TokenType2["NUMBER"] = 11] = "NUMBER";
          TokenType2[TokenType2["SEPARATOR"] = 12] = "SEPARATOR";
        })(exports2.TokenType || (exports2.TokenType = {}));
        var LEFT_BRACE$1 = exports2.TokenType.LEFT_BRACE, RIGHT_BRACE$1 = exports2.TokenType.RIGHT_BRACE, LEFT_BRACKET$1 = exports2.TokenType.LEFT_BRACKET, RIGHT_BRACKET$1 = exports2.TokenType.RIGHT_BRACKET, COLON$1 = exports2.TokenType.COLON, COMMA$1 = exports2.TokenType.COMMA, TRUE$1 = exports2.TokenType.TRUE, FALSE$1 = exports2.TokenType.FALSE, NULL$1 = exports2.TokenType.NULL, STRING$1 = exports2.TokenType.STRING, NUMBER$1 = exports2.TokenType.NUMBER;
        var TokenizerStates;
        (function(TokenizerStates2) {
          TokenizerStates2[TokenizerStates2["START"] = 0] = "START";
          TokenizerStates2[TokenizerStates2["ENDED"] = 1] = "ENDED";
          TokenizerStates2[TokenizerStates2["ERROR"] = 2] = "ERROR";
          TokenizerStates2[TokenizerStates2["TRUE1"] = 3] = "TRUE1";
          TokenizerStates2[TokenizerStates2["TRUE2"] = 4] = "TRUE2";
          TokenizerStates2[TokenizerStates2["TRUE3"] = 5] = "TRUE3";
          TokenizerStates2[TokenizerStates2["FALSE1"] = 6] = "FALSE1";
          TokenizerStates2[TokenizerStates2["FALSE2"] = 7] = "FALSE2";
          TokenizerStates2[TokenizerStates2["FALSE3"] = 8] = "FALSE3";
          TokenizerStates2[TokenizerStates2["FALSE4"] = 9] = "FALSE4";
          TokenizerStates2[TokenizerStates2["NULL1"] = 10] = "NULL1";
          TokenizerStates2[TokenizerStates2["NULL2"] = 11] = "NULL2";
          TokenizerStates2[TokenizerStates2["NULL3"] = 12] = "NULL3";
          TokenizerStates2[TokenizerStates2["STRING_DEFAULT"] = 13] = "STRING_DEFAULT";
          TokenizerStates2[TokenizerStates2["STRING_AFTER_BACKSLASH"] = 14] = "STRING_AFTER_BACKSLASH";
          TokenizerStates2[TokenizerStates2["STRING_UNICODE_DIGIT_1"] = 15] = "STRING_UNICODE_DIGIT_1";
          TokenizerStates2[TokenizerStates2["STRING_UNICODE_DIGIT_2"] = 16] = "STRING_UNICODE_DIGIT_2";
          TokenizerStates2[TokenizerStates2["STRING_UNICODE_DIGIT_3"] = 17] = "STRING_UNICODE_DIGIT_3";
          TokenizerStates2[TokenizerStates2["STRING_UNICODE_DIGIT_4"] = 18] = "STRING_UNICODE_DIGIT_4";
          TokenizerStates2[TokenizerStates2["STRING_INCOMPLETE_CHAR"] = 19] = "STRING_INCOMPLETE_CHAR";
          TokenizerStates2[TokenizerStates2["NUMBER_AFTER_INITIAL_MINUS"] = 20] = "NUMBER_AFTER_INITIAL_MINUS";
          TokenizerStates2[TokenizerStates2["NUMBER_AFTER_INITIAL_ZERO"] = 21] = "NUMBER_AFTER_INITIAL_ZERO";
          TokenizerStates2[TokenizerStates2["NUMBER_AFTER_INITIAL_NON_ZERO"] = 22] = "NUMBER_AFTER_INITIAL_NON_ZERO";
          TokenizerStates2[TokenizerStates2["NUMBER_AFTER_FULL_STOP"] = 23] = "NUMBER_AFTER_FULL_STOP";
          TokenizerStates2[TokenizerStates2["NUMBER_AFTER_DECIMAL"] = 24] = "NUMBER_AFTER_DECIMAL";
          TokenizerStates2[TokenizerStates2["NUMBER_AFTER_E"] = 25] = "NUMBER_AFTER_E";
          TokenizerStates2[TokenizerStates2["NUMBER_AFTER_E_AND_SIGN"] = 26] = "NUMBER_AFTER_E_AND_SIGN";
          TokenizerStates2[TokenizerStates2["NUMBER_AFTER_E_AND_DIGIT"] = 27] = "NUMBER_AFTER_E_AND_DIGIT";
          TokenizerStates2[TokenizerStates2["SEPARATOR"] = 28] = "SEPARATOR";
        })(TokenizerStates || (TokenizerStates = {}));
        var defaultOpts$1 = {
          stringBufferSize: 0,
          numberBufferSize: 0,
          separator: void 0
        };
        var TokenizerError = function(_super) {
          __extends(TokenizerError2, _super);
          function TokenizerError2(message) {
            var _this = _super.call(this, message) || this;
            Object.setPrototypeOf(_this, TokenizerError2.prototype);
            return _this;
          }
          return TokenizerError2;
        }(Error);
        var Tokenizer2 = function() {
          function Tokenizer3(opts) {
            this.state = TokenizerStates.START;
            this.separatorIndex = 0;
            this.unicode = void 0;
            this.highSurrogate = void 0;
            this.bytes_remaining = 0;
            this.bytes_in_sequence = 0;
            this.char_split_buffer = new Uint8Array(4);
            this.encoder = new TextEncoder();
            this.offset = -1;
            opts = __assign(__assign({}, defaultOpts$1), opts);
            this.bufferedString = opts.stringBufferSize && opts.stringBufferSize > 4 ? new BufferedString(opts.stringBufferSize) : new NonBufferedString();
            this.bufferedNumber = opts.numberBufferSize && opts.numberBufferSize > 0 ? new BufferedString(opts.numberBufferSize) : new NonBufferedString();
            this.separator = opts.separator;
            this.separatorBytes = opts.separator ? this.encoder.encode(opts.separator) : void 0;
          }
          Object.defineProperty(Tokenizer3.prototype, "isEnded", {
            get: function() {
              return this.state === TokenizerStates.ENDED;
            },
            enumerable: false,
            configurable: true
          });
          Tokenizer3.prototype.write = function(input) {
            var buffer;
            if (input instanceof Uint8Array) {
              buffer = input;
            } else if (typeof input === "string") {
              buffer = this.encoder.encode(input);
            } else if (typeof input === "object" && "buffer" in input || Array.isArray(input)) {
              buffer = Uint8Array.from(input);
            } else {
              this.error(new TypeError("Unexpected type. The `write` function only accepts Arrays, TypedArrays and Strings."));
              return;
            }
            for (var i = 0; i < buffer.length; i += 1) {
              var n = buffer[i];
              switch (this.state) {
                case TokenizerStates.START:
                  this.offset += 1;
                  if (this.separatorBytes && n === this.separatorBytes[0]) {
                    if (this.separatorBytes.length === 1) {
                      this.state = TokenizerStates.START;
                      this.onToken(exports2.TokenType.SEPARATOR, this.separator, this.offset + this.separatorBytes.length - 1);
                      continue;
                    }
                    this.state = TokenizerStates.SEPARATOR;
                    continue;
                  }
                  if (n === charset.SPACE || n === charset.NEWLINE || n === charset.CARRIAGE_RETURN || n === charset.TAB) {
                    continue;
                  }
                  if (n === charset.LEFT_CURLY_BRACKET) {
                    this.onToken(LEFT_BRACE$1, "{", this.offset);
                    continue;
                  }
                  if (n === charset.RIGHT_CURLY_BRACKET) {
                    this.onToken(RIGHT_BRACE$1, "}", this.offset);
                    continue;
                  }
                  if (n === charset.LEFT_SQUARE_BRACKET) {
                    this.onToken(LEFT_BRACKET$1, "[", this.offset);
                    continue;
                  }
                  if (n === charset.RIGHT_SQUARE_BRACKET) {
                    this.onToken(RIGHT_BRACKET$1, "]", this.offset);
                    continue;
                  }
                  if (n === charset.COLON) {
                    this.onToken(COLON$1, ":", this.offset);
                    continue;
                  }
                  if (n === charset.COMMA) {
                    this.onToken(COMMA$1, ",", this.offset);
                    continue;
                  }
                  if (n === charset.LATIN_SMALL_LETTER_T) {
                    this.state = TokenizerStates.TRUE1;
                    continue;
                  }
                  if (n === charset.LATIN_SMALL_LETTER_F) {
                    this.state = TokenizerStates.FALSE1;
                    continue;
                  }
                  if (n === charset.LATIN_SMALL_LETTER_N) {
                    this.state = TokenizerStates.NULL1;
                    continue;
                  }
                  if (n === charset.QUOTATION_MARK) {
                    this.bufferedString.reset();
                    this.state = TokenizerStates.STRING_DEFAULT;
                    continue;
                  }
                  if (n >= charset.DIGIT_ONE && n <= charset.DIGIT_NINE) {
                    this.bufferedNumber.reset();
                    this.bufferedNumber.appendChar(n);
                    this.state = TokenizerStates.NUMBER_AFTER_INITIAL_NON_ZERO;
                    continue;
                  }
                  if (n === charset.DIGIT_ZERO) {
                    this.bufferedNumber.reset();
                    this.bufferedNumber.appendChar(n);
                    this.state = TokenizerStates.NUMBER_AFTER_INITIAL_ZERO;
                    continue;
                  }
                  if (n === charset.HYPHEN_MINUS) {
                    this.bufferedNumber.reset();
                    this.bufferedNumber.appendChar(n);
                    this.state = TokenizerStates.NUMBER_AFTER_INITIAL_MINUS;
                    continue;
                  }
                  break;
                case TokenizerStates.STRING_DEFAULT:
                  if (n === charset.QUOTATION_MARK) {
                    var string = this.bufferedString.toString();
                    this.state = TokenizerStates.START;
                    this.onToken(STRING$1, string, this.offset);
                    this.offset += this.bufferedString.byteLength + 1;
                    continue;
                  }
                  if (n === charset.REVERSE_SOLIDUS) {
                    this.state = TokenizerStates.STRING_AFTER_BACKSLASH;
                    continue;
                  }
                  if (n >= 128) {
                    if (n >= 194 && n <= 223) {
                      this.bytes_in_sequence = 2;
                    } else if (n <= 239) {
                      this.bytes_in_sequence = 3;
                    } else {
                      this.bytes_in_sequence = 4;
                    }
                    if (this.bytes_in_sequence <= buffer.length - i) {
                      this.bufferedString.appendBuf(buffer, i, i + this.bytes_in_sequence);
                      i += this.bytes_in_sequence - 1;
                      continue;
                    }
                    this.bytes_remaining = i + this.bytes_in_sequence - buffer.length;
                    this.char_split_buffer.set(buffer.subarray(i));
                    i = buffer.length - 1;
                    this.state = TokenizerStates.STRING_INCOMPLETE_CHAR;
                    continue;
                  }
                  if (n >= charset.SPACE) {
                    this.bufferedString.appendChar(n);
                    continue;
                  }
                  break;
                case TokenizerStates.STRING_INCOMPLETE_CHAR:
                  this.char_split_buffer.set(buffer.subarray(i, i + this.bytes_remaining), this.bytes_in_sequence - this.bytes_remaining);
                  this.bufferedString.appendBuf(this.char_split_buffer, 0, this.bytes_in_sequence);
                  i = this.bytes_remaining - 1;
                  this.state = TokenizerStates.STRING_DEFAULT;
                  continue;
                case TokenizerStates.STRING_AFTER_BACKSLASH:
                  var controlChar = escapedSequences[n];
                  if (controlChar) {
                    this.bufferedString.appendChar(controlChar);
                    this.state = TokenizerStates.STRING_DEFAULT;
                    continue;
                  }
                  if (n === charset.LATIN_SMALL_LETTER_U) {
                    this.unicode = "";
                    this.state = TokenizerStates.STRING_UNICODE_DIGIT_1;
                    continue;
                  }
                  break;
                case TokenizerStates.STRING_UNICODE_DIGIT_1:
                case TokenizerStates.STRING_UNICODE_DIGIT_2:
                case TokenizerStates.STRING_UNICODE_DIGIT_3:
                  if (n >= charset.DIGIT_ZERO && n <= charset.DIGIT_NINE || n >= charset.LATIN_CAPITAL_LETTER_A && n <= charset.LATIN_CAPITAL_LETTER_F || n >= charset.LATIN_SMALL_LETTER_A && n <= charset.LATIN_SMALL_LETTER_F) {
                    this.unicode += String.fromCharCode(n);
                    this.state += 1;
                    continue;
                  }
                  break;
                case TokenizerStates.STRING_UNICODE_DIGIT_4:
                  if (n >= charset.DIGIT_ZERO && n <= charset.DIGIT_NINE || n >= charset.LATIN_CAPITAL_LETTER_A && n <= charset.LATIN_CAPITAL_LETTER_F || n >= charset.LATIN_SMALL_LETTER_A && n <= charset.LATIN_SMALL_LETTER_F) {
                    var intVal = parseInt(this.unicode + String.fromCharCode(n), 16);
                    if (this.highSurrogate === void 0) {
                      if (intVal >= 55296 && intVal <= 56319) {
                        this.highSurrogate = intVal;
                      } else {
                        this.bufferedString.appendBuf(this.encoder.encode(String.fromCharCode(intVal)));
                      }
                    } else {
                      if (intVal >= 56320 && intVal <= 57343) {
                        this.bufferedString.appendBuf(this.encoder.encode(String.fromCharCode(this.highSurrogate, intVal)));
                      } else {
                        this.bufferedString.appendBuf(this.encoder.encode(String.fromCharCode(this.highSurrogate)));
                      }
                      this.highSurrogate = void 0;
                    }
                    this.state = TokenizerStates.STRING_DEFAULT;
                    continue;
                  }
                case TokenizerStates.NUMBER_AFTER_INITIAL_MINUS:
                  if (n === charset.DIGIT_ZERO) {
                    this.bufferedNumber.appendChar(n);
                    this.state = TokenizerStates.NUMBER_AFTER_INITIAL_ZERO;
                    continue;
                  }
                  if (n >= charset.DIGIT_ONE && n <= charset.DIGIT_NINE) {
                    this.bufferedNumber.appendChar(n);
                    this.state = TokenizerStates.NUMBER_AFTER_INITIAL_NON_ZERO;
                    continue;
                  }
                  break;
                case TokenizerStates.NUMBER_AFTER_INITIAL_ZERO:
                  if (n === charset.FULL_STOP) {
                    this.bufferedNumber.appendChar(n);
                    this.state = TokenizerStates.NUMBER_AFTER_FULL_STOP;
                    continue;
                  }
                  if (n === charset.LATIN_SMALL_LETTER_E || n === charset.LATIN_CAPITAL_LETTER_E) {
                    this.bufferedNumber.appendChar(n);
                    this.state = TokenizerStates.NUMBER_AFTER_E;
                    continue;
                  }
                  i -= 1;
                  this.state = TokenizerStates.START;
                  this.emitNumber();
                  continue;
                case TokenizerStates.NUMBER_AFTER_INITIAL_NON_ZERO:
                  if (n >= charset.DIGIT_ZERO && n <= charset.DIGIT_NINE) {
                    this.bufferedNumber.appendChar(n);
                    continue;
                  }
                  if (n === charset.FULL_STOP) {
                    this.bufferedNumber.appendChar(n);
                    this.state = TokenizerStates.NUMBER_AFTER_FULL_STOP;
                    continue;
                  }
                  if (n === charset.LATIN_SMALL_LETTER_E || n === charset.LATIN_CAPITAL_LETTER_E) {
                    this.bufferedNumber.appendChar(n);
                    this.state = TokenizerStates.NUMBER_AFTER_E;
                    continue;
                  }
                  i -= 1;
                  this.state = TokenizerStates.START;
                  this.emitNumber();
                  continue;
                case TokenizerStates.NUMBER_AFTER_FULL_STOP:
                  if (n >= charset.DIGIT_ZERO && n <= charset.DIGIT_NINE) {
                    this.bufferedNumber.appendChar(n);
                    this.state = TokenizerStates.NUMBER_AFTER_DECIMAL;
                    continue;
                  }
                  break;
                case TokenizerStates.NUMBER_AFTER_DECIMAL:
                  if (n >= charset.DIGIT_ZERO && n <= charset.DIGIT_NINE) {
                    this.bufferedNumber.appendChar(n);
                    continue;
                  }
                  if (n === charset.LATIN_SMALL_LETTER_E || n === charset.LATIN_CAPITAL_LETTER_E) {
                    this.bufferedNumber.appendChar(n);
                    this.state = TokenizerStates.NUMBER_AFTER_E;
                    continue;
                  }
                  i -= 1;
                  this.state = TokenizerStates.START;
                  this.emitNumber();
                  continue;
                case TokenizerStates.NUMBER_AFTER_E:
                  if (n === charset.PLUS_SIGN || n === charset.HYPHEN_MINUS) {
                    this.bufferedNumber.appendChar(n);
                    this.state = TokenizerStates.NUMBER_AFTER_E_AND_SIGN;
                    continue;
                  }
                case TokenizerStates.NUMBER_AFTER_E_AND_SIGN:
                  if (n >= charset.DIGIT_ZERO && n <= charset.DIGIT_NINE) {
                    this.bufferedNumber.appendChar(n);
                    this.state = TokenizerStates.NUMBER_AFTER_E_AND_DIGIT;
                    continue;
                  }
                  break;
                case TokenizerStates.NUMBER_AFTER_E_AND_DIGIT:
                  if (n >= charset.DIGIT_ZERO && n <= charset.DIGIT_NINE) {
                    this.bufferedNumber.appendChar(n);
                    continue;
                  }
                  i -= 1;
                  this.state = TokenizerStates.START;
                  this.emitNumber();
                  continue;
                case TokenizerStates.TRUE1:
                  if (n === charset.LATIN_SMALL_LETTER_R) {
                    this.state = TokenizerStates.TRUE2;
                    continue;
                  }
                  break;
                case TokenizerStates.TRUE2:
                  if (n === charset.LATIN_SMALL_LETTER_U) {
                    this.state = TokenizerStates.TRUE3;
                    continue;
                  }
                  break;
                case TokenizerStates.TRUE3:
                  if (n === charset.LATIN_SMALL_LETTER_E) {
                    this.state = TokenizerStates.START;
                    this.onToken(TRUE$1, true, this.offset);
                    this.offset += 3;
                    continue;
                  }
                  break;
                case TokenizerStates.FALSE1:
                  if (n === charset.LATIN_SMALL_LETTER_A) {
                    this.state = TokenizerStates.FALSE2;
                    continue;
                  }
                  break;
                case TokenizerStates.FALSE2:
                  if (n === charset.LATIN_SMALL_LETTER_L) {
                    this.state = TokenizerStates.FALSE3;
                    continue;
                  }
                  break;
                case TokenizerStates.FALSE3:
                  if (n === charset.LATIN_SMALL_LETTER_S) {
                    this.state = TokenizerStates.FALSE4;
                    continue;
                  }
                  break;
                case TokenizerStates.FALSE4:
                  if (n === charset.LATIN_SMALL_LETTER_E) {
                    this.state = TokenizerStates.START;
                    this.onToken(FALSE$1, false, this.offset);
                    this.offset += 4;
                    continue;
                  }
                  break;
                case TokenizerStates.NULL1:
                  if (n === charset.LATIN_SMALL_LETTER_U) {
                    this.state = TokenizerStates.NULL2;
                    continue;
                  }
                  break;
                case TokenizerStates.NULL2:
                  if (n === charset.LATIN_SMALL_LETTER_L) {
                    this.state = TokenizerStates.NULL3;
                    continue;
                  }
                  break;
                case TokenizerStates.NULL3:
                  if (n === charset.LATIN_SMALL_LETTER_L) {
                    this.state = TokenizerStates.START;
                    this.onToken(NULL$1, null, this.offset);
                    this.offset += 3;
                    continue;
                  }
                  break;
                case TokenizerStates.SEPARATOR:
                  this.separatorIndex += 1;
                  if (!this.separatorBytes || n !== this.separatorBytes[this.separatorIndex]) {
                    break;
                  }
                  if (this.separatorIndex === this.separatorBytes.length - 1) {
                    this.state = TokenizerStates.START;
                    this.onToken(exports2.TokenType.SEPARATOR, this.separator, this.offset + this.separatorIndex);
                    this.separatorIndex = 0;
                  }
                  continue;
                case TokenizerStates.ENDED:
                  if (n === charset.SPACE || n === charset.NEWLINE || n === charset.CARRIAGE_RETURN || n === charset.TAB) {
                    continue;
                  }
              }
              this.error(new TokenizerError('Unexpected "'.concat(String.fromCharCode(n), '" at position "').concat(i, '" in state ').concat(TokenizerStates[this.state])));
              return;
            }
          };
          Tokenizer3.prototype.emitNumber = function() {
            this.onToken(NUMBER$1, this.parseNumber(this.bufferedNumber.toString()), this.offset);
            this.offset += this.bufferedNumber.byteLength - 1;
          };
          Tokenizer3.prototype.parseNumber = function(numberStr) {
            return Number(numberStr);
          };
          Tokenizer3.prototype.error = function(err) {
            if (this.state !== TokenizerStates.ENDED) {
              this.state = TokenizerStates.ERROR;
            }
            this.onError(err);
          };
          Tokenizer3.prototype.end = function() {
            switch (this.state) {
              case TokenizerStates.NUMBER_AFTER_INITIAL_ZERO:
              case TokenizerStates.NUMBER_AFTER_INITIAL_NON_ZERO:
              case TokenizerStates.NUMBER_AFTER_DECIMAL:
              case TokenizerStates.NUMBER_AFTER_E_AND_DIGIT:
                this.state = TokenizerStates.ENDED;
                this.emitNumber();
                this.onEnd();
                break;
              case TokenizerStates.START:
              case TokenizerStates.ERROR:
              case TokenizerStates.SEPARATOR:
                this.state = TokenizerStates.ENDED;
                this.onEnd();
                break;
              default:
                this.error(new TokenizerError("Tokenizer ended in the middle of a token (state: ".concat(TokenizerStates[this.state], "). Either not all the data was received or the data was invalid.")));
            }
          };
          Tokenizer3.prototype.onToken = function(token, value, offset) {
            throw new TokenizerError(`Can't emit tokens before the "onToken" callback has been set up.`);
          };
          Tokenizer3.prototype.onError = function(err) {
            throw err;
          };
          Tokenizer3.prototype.onEnd = function() {
          };
          return Tokenizer3;
        }();
        var LEFT_BRACE = exports2.TokenType.LEFT_BRACE, RIGHT_BRACE = exports2.TokenType.RIGHT_BRACE, LEFT_BRACKET = exports2.TokenType.LEFT_BRACKET, RIGHT_BRACKET = exports2.TokenType.RIGHT_BRACKET, COLON = exports2.TokenType.COLON, COMMA = exports2.TokenType.COMMA, TRUE = exports2.TokenType.TRUE, FALSE = exports2.TokenType.FALSE, NULL = exports2.TokenType.NULL, STRING = exports2.TokenType.STRING, NUMBER = exports2.TokenType.NUMBER, SEPARATOR = exports2.TokenType.SEPARATOR;
        var TokenParserState;
        (function(TokenParserState2) {
          TokenParserState2[TokenParserState2["VALUE"] = 0] = "VALUE";
          TokenParserState2[TokenParserState2["KEY"] = 1] = "KEY";
          TokenParserState2[TokenParserState2["COLON"] = 2] = "COLON";
          TokenParserState2[TokenParserState2["COMMA"] = 3] = "COMMA";
          TokenParserState2[TokenParserState2["ENDED"] = 4] = "ENDED";
          TokenParserState2[TokenParserState2["ERROR"] = 5] = "ERROR";
          TokenParserState2[TokenParserState2["SEPARATOR"] = 6] = "SEPARATOR";
        })(TokenParserState || (TokenParserState = {}));
        var TokenParserMode;
        (function(TokenParserMode2) {
          TokenParserMode2[TokenParserMode2["OBJECT"] = 0] = "OBJECT";
          TokenParserMode2[TokenParserMode2["ARRAY"] = 1] = "ARRAY";
        })(TokenParserMode || (TokenParserMode = {}));
        var defaultOpts = {
          paths: void 0,
          keepStack: true,
          separator: void 0
        };
        var TokenParserError = function(_super) {
          __extends(TokenParserError2, _super);
          function TokenParserError2(message) {
            var _this = _super.call(this, message) || this;
            Object.setPrototypeOf(_this, TokenParserError2.prototype);
            return _this;
          }
          return TokenParserError2;
        }(Error);
        var TokenParser2 = function() {
          function TokenParser3(opts) {
            this.state = TokenParserState.VALUE;
            this.mode = void 0;
            this.key = void 0;
            this.value = void 0;
            this.stack = [];
            opts = __assign(__assign({}, defaultOpts), opts);
            if (opts.paths) {
              this.paths = opts.paths.map(function(path) {
                if (path === void 0 || path === "$*")
                  return void 0;
                if (!path.startsWith("$"))
                  throw new TokenParserError('Invalid selector "'.concat(path, '". Should start with "$".'));
                var pathParts = path.split(".").slice(1);
                if (pathParts.includes(""))
                  throw new TokenParserError('Invalid selector "'.concat(path, '". ".." syntax not supported.'));
                return pathParts;
              });
            }
            this.keepStack = opts.keepStack;
            this.separator = opts.separator;
          }
          TokenParser3.prototype.shouldEmit = function() {
            var _this = this;
            if (!this.paths)
              return true;
            return this.paths.some(function(path) {
              var _a2;
              if (path === void 0)
                return true;
              if (path.length !== _this.stack.length)
                return false;
              for (var i = 0; i < path.length - 1; i++) {
                var selector_1 = path[i];
                var key = _this.stack[i + 1].key;
                if (selector_1 === "*")
                  continue;
                if (selector_1 !== key)
                  return false;
              }
              var selector = path[path.length - 1];
              if (selector === "*")
                return true;
              return selector === ((_a2 = _this.key) === null || _a2 === void 0 ? void 0 : _a2.toString());
            });
          };
          TokenParser3.prototype.push = function() {
            this.stack.push({
              key: this.key,
              value: this.value,
              mode: this.mode,
              emit: this.shouldEmit()
            });
          };
          TokenParser3.prototype.pop = function() {
            var _a2;
            var value = this.value;
            var emit;
            _a2 = this.stack.pop(), this.key = _a2.key, this.value = _a2.value, this.mode = _a2.mode, emit = _a2.emit;
            this.state = this.mode !== void 0 ? TokenParserState.COMMA : TokenParserState.VALUE;
            this.emit(value, emit);
          };
          TokenParser3.prototype.emit = function(value, emit) {
            if (!this.keepStack && this.value && this.stack.every(function(item) {
              return !item.emit;
            })) {
              delete this.value[this.key];
            }
            if (emit) {
              this.onValue(value, this.key, this.value, this.stack);
            }
            if (this.stack.length === 0) {
              if (this.separator) {
                this.state = TokenParserState.SEPARATOR;
              } else if (this.separator === void 0) {
                this.end();
              }
            }
          };
          Object.defineProperty(TokenParser3.prototype, "isEnded", {
            get: function() {
              return this.state === TokenParserState.ENDED;
            },
            enumerable: false,
            configurable: true
          });
          TokenParser3.prototype.write = function(token, value) {
            if (this.state === TokenParserState.VALUE) {
              if (token === STRING || token === NUMBER || token === TRUE || token === FALSE || token === NULL) {
                if (this.mode === TokenParserMode.OBJECT) {
                  this.value[this.key] = value;
                  this.state = TokenParserState.COMMA;
                } else if (this.mode === TokenParserMode.ARRAY) {
                  this.value.push(value);
                  this.state = TokenParserState.COMMA;
                }
                this.emit(value, this.shouldEmit());
                return;
              }
              if (token === LEFT_BRACE) {
                this.push();
                if (this.mode === TokenParserMode.OBJECT) {
                  this.value = this.value[this.key] = {};
                } else if (this.mode === TokenParserMode.ARRAY) {
                  var val = {};
                  this.value.push(val);
                  this.value = val;
                } else {
                  this.value = {};
                }
                this.mode = TokenParserMode.OBJECT;
                this.state = TokenParserState.KEY;
                this.key = void 0;
                return;
              }
              if (token === LEFT_BRACKET) {
                this.push();
                if (this.mode === TokenParserMode.OBJECT) {
                  this.value = this.value[this.key] = [];
                } else if (this.mode === TokenParserMode.ARRAY) {
                  var val = [];
                  this.value.push(val);
                  this.value = val;
                } else {
                  this.value = [];
                }
                this.mode = TokenParserMode.ARRAY;
                this.state = TokenParserState.VALUE;
                this.key = 0;
                return;
              }
              if (this.mode === TokenParserMode.ARRAY && token === RIGHT_BRACKET && this.value.length === 0) {
                this.pop();
                return;
              }
            }
            if (this.state === TokenParserState.KEY) {
              if (token === STRING) {
                this.key = value;
                this.state = TokenParserState.COLON;
                return;
              }
              if (token === RIGHT_BRACE && Object.keys(this.value).length === 0) {
                this.pop();
                return;
              }
            }
            if (this.state === TokenParserState.COLON) {
              if (token === COLON) {
                this.state = TokenParserState.VALUE;
                return;
              }
            }
            if (this.state === TokenParserState.COMMA) {
              if (token === COMMA) {
                if (this.mode === TokenParserMode.ARRAY) {
                  this.state = TokenParserState.VALUE;
                  this.key += 1;
                  return;
                }
                if (this.mode === TokenParserMode.OBJECT) {
                  this.state = TokenParserState.KEY;
                  return;
                }
              }
              if (token === RIGHT_BRACE && this.mode === TokenParserMode.OBJECT || token === RIGHT_BRACKET && this.mode === TokenParserMode.ARRAY) {
                this.pop();
                return;
              }
            }
            if (this.state === TokenParserState.SEPARATOR) {
              if (token === SEPARATOR && value === this.separator) {
                this.state = TokenParserState.VALUE;
                return;
              }
            }
            this.error(new TokenParserError("Unexpected ".concat(exports2.TokenType[token], " (").concat(JSON.stringify(value), ") in state ").concat(TokenParserState[this.state])));
          };
          TokenParser3.prototype.error = function(err) {
            if (this.state !== TokenParserState.ENDED) {
              this.state = TokenParserState.ERROR;
            }
            this.onError(err);
          };
          TokenParser3.prototype.end = function() {
            if (this.state !== TokenParserState.VALUE && this.state !== TokenParserState.SEPARATOR || this.stack.length > 0) {
              this.error(new Error("Parser ended in mid-parsing (state: ".concat(TokenParserState[this.state], "). Either not all the data was received or the data was invalid.")));
            } else {
              this.state = TokenParserState.ENDED;
              this.onEnd();
            }
          };
          TokenParser3.prototype.onValue = function(value, key, parent, stack) {
            throw new TokenParserError(`Can't emit data before the "onValue" callback has been set up.`);
          };
          TokenParser3.prototype.onError = function(err) {
            throw err;
          };
          TokenParser3.prototype.onEnd = function() {
          };
          return TokenParser3;
        }();
        var JSONParser = function() {
          function JSONParser2(opts) {
            if (opts === void 0) {
              opts = {};
            }
            var _this = this;
            this.tokenizer = new Tokenizer2(opts);
            this.tokenParser = new TokenParser2(opts);
            this.tokenizer.onToken = this.tokenParser.write.bind(this.tokenParser);
            this.tokenizer.onEnd = function() {
              if (!_this.tokenParser.isEnded)
                _this.tokenParser.end();
            };
            this.tokenParser.onError = this.tokenizer.error.bind(this.tokenizer);
            this.tokenParser.onEnd = function() {
              if (!_this.tokenizer.isEnded)
                _this.tokenizer.end();
            };
          }
          Object.defineProperty(JSONParser2.prototype, "isEnded", {
            get: function() {
              return this.tokenizer.isEnded && this.tokenParser.isEnded;
            },
            enumerable: false,
            configurable: true
          });
          JSONParser2.prototype.write = function(input) {
            this.tokenizer.write(input);
          };
          JSONParser2.prototype.end = function() {
            this.tokenizer.end();
          };
          Object.defineProperty(JSONParser2.prototype, "onToken", {
            set: function(cb) {
              this.tokenizer.onToken = cb;
            },
            enumerable: false,
            configurable: true
          });
          Object.defineProperty(JSONParser2.prototype, "onValue", {
            set: function(cb) {
              this.tokenParser.onValue = cb;
            },
            enumerable: false,
            configurable: true
          });
          Object.defineProperty(JSONParser2.prototype, "onError", {
            set: function(cb) {
              this.tokenizer.onError = cb;
            },
            enumerable: false,
            configurable: true
          });
          Object.defineProperty(JSONParser2.prototype, "onEnd", {
            set: function(cb) {
              var _this = this;
              this.tokenParser.onEnd = function() {
                if (!_this.tokenizer.isEnded)
                  _this.tokenizer.end();
                cb.call(_this.tokenParser);
              };
            },
            enumerable: false,
            configurable: true
          });
          return JSONParser2;
        }();
        exports2.JSONParser = JSONParser;
        exports2.TokenParser = TokenParser2;
        exports2.Tokenizer = Tokenizer2;
        exports2.utf8 = utf8;
        Object.defineProperty(exports2, "__esModule", { value: true });
      });
    }
  });

  // node_modules/lodash.get/index.js
  var require_lodash = __commonJS({
    "node_modules/lodash.get/index.js"(exports, module) {
      var FUNC_ERROR_TEXT = "Expected a function";
      var HASH_UNDEFINED = "__lodash_hash_undefined__";
      var INFINITY = 1 / 0;
      var funcTag = "[object Function]";
      var genTag = "[object GeneratorFunction]";
      var symbolTag = "[object Symbol]";
      var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
      var reIsPlainProp = /^\w*$/;
      var reLeadingDot = /^\./;
      var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
      var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
      var reEscapeChar = /\\(\\)?/g;
      var reIsHostCtor = /^\[object .+?Constructor\]$/;
      var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
      var freeSelf = typeof self == "object" && self && self.Object === Object && self;
      var root = freeGlobal || freeSelf || Function("return this")();
      function getValue(object, key) {
        return object == null ? void 0 : object[key];
      }
      function isHostObject(value) {
        var result = false;
        if (value != null && typeof value.toString != "function") {
          try {
            result = !!(value + "");
          } catch (e) {
          }
        }
        return result;
      }
      var arrayProto = Array.prototype;
      var funcProto = Function.prototype;
      var objectProto = Object.prototype;
      var coreJsData = root["__core-js_shared__"];
      var maskSrcKey = function() {
        var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
        return uid ? "Symbol(src)_1." + uid : "";
      }();
      var funcToString = funcProto.toString;
      var hasOwnProperty = objectProto.hasOwnProperty;
      var objectToString = objectProto.toString;
      var reIsNative = RegExp("^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
      var Symbol = root.Symbol;
      var splice = arrayProto.splice;
      var Map = getNative(root, "Map");
      var nativeCreate = getNative(Object, "create");
      var symbolProto = Symbol ? Symbol.prototype : void 0;
      var symbolToString = symbolProto ? symbolProto.toString : void 0;
      function Hash(entries) {
        var index = -1, length = entries ? entries.length : 0;
        this.clear();
        while (++index < length) {
          var entry = entries[index];
          this.set(entry[0], entry[1]);
        }
      }
      function hashClear() {
        this.__data__ = nativeCreate ? nativeCreate(null) : {};
      }
      function hashDelete(key) {
        return this.has(key) && delete this.__data__[key];
      }
      function hashGet(key) {
        var data = this.__data__;
        if (nativeCreate) {
          var result = data[key];
          return result === HASH_UNDEFINED ? void 0 : result;
        }
        return hasOwnProperty.call(data, key) ? data[key] : void 0;
      }
      function hashHas(key) {
        var data = this.__data__;
        return nativeCreate ? data[key] !== void 0 : hasOwnProperty.call(data, key);
      }
      function hashSet(key, value) {
        var data = this.__data__;
        data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED : value;
        return this;
      }
      Hash.prototype.clear = hashClear;
      Hash.prototype["delete"] = hashDelete;
      Hash.prototype.get = hashGet;
      Hash.prototype.has = hashHas;
      Hash.prototype.set = hashSet;
      function ListCache(entries) {
        var index = -1, length = entries ? entries.length : 0;
        this.clear();
        while (++index < length) {
          var entry = entries[index];
          this.set(entry[0], entry[1]);
        }
      }
      function listCacheClear() {
        this.__data__ = [];
      }
      function listCacheDelete(key) {
        var data = this.__data__, index = assocIndexOf(data, key);
        if (index < 0) {
          return false;
        }
        var lastIndex = data.length - 1;
        if (index == lastIndex) {
          data.pop();
        } else {
          splice.call(data, index, 1);
        }
        return true;
      }
      function listCacheGet(key) {
        var data = this.__data__, index = assocIndexOf(data, key);
        return index < 0 ? void 0 : data[index][1];
      }
      function listCacheHas(key) {
        return assocIndexOf(this.__data__, key) > -1;
      }
      function listCacheSet(key, value) {
        var data = this.__data__, index = assocIndexOf(data, key);
        if (index < 0) {
          data.push([key, value]);
        } else {
          data[index][1] = value;
        }
        return this;
      }
      ListCache.prototype.clear = listCacheClear;
      ListCache.prototype["delete"] = listCacheDelete;
      ListCache.prototype.get = listCacheGet;
      ListCache.prototype.has = listCacheHas;
      ListCache.prototype.set = listCacheSet;
      function MapCache(entries) {
        var index = -1, length = entries ? entries.length : 0;
        this.clear();
        while (++index < length) {
          var entry = entries[index];
          this.set(entry[0], entry[1]);
        }
      }
      function mapCacheClear() {
        this.__data__ = {
          "hash": new Hash(),
          "map": new (Map || ListCache)(),
          "string": new Hash()
        };
      }
      function mapCacheDelete(key) {
        return getMapData(this, key)["delete"](key);
      }
      function mapCacheGet(key) {
        return getMapData(this, key).get(key);
      }
      function mapCacheHas(key) {
        return getMapData(this, key).has(key);
      }
      function mapCacheSet(key, value) {
        getMapData(this, key).set(key, value);
        return this;
      }
      MapCache.prototype.clear = mapCacheClear;
      MapCache.prototype["delete"] = mapCacheDelete;
      MapCache.prototype.get = mapCacheGet;
      MapCache.prototype.has = mapCacheHas;
      MapCache.prototype.set = mapCacheSet;
      function assocIndexOf(array, key) {
        var length = array.length;
        while (length--) {
          if (eq(array[length][0], key)) {
            return length;
          }
        }
        return -1;
      }
      function baseGet(object, path) {
        path = isKey(path, object) ? [path] : castPath(path);
        var index = 0, length = path.length;
        while (object != null && index < length) {
          object = object[toKey(path[index++])];
        }
        return index && index == length ? object : void 0;
      }
      function baseIsNative(value) {
        if (!isObject(value) || isMasked(value)) {
          return false;
        }
        var pattern = isFunction(value) || isHostObject(value) ? reIsNative : reIsHostCtor;
        return pattern.test(toSource(value));
      }
      function baseToString(value) {
        if (typeof value == "string") {
          return value;
        }
        if (isSymbol(value)) {
          return symbolToString ? symbolToString.call(value) : "";
        }
        var result = value + "";
        return result == "0" && 1 / value == -INFINITY ? "-0" : result;
      }
      function castPath(value) {
        return isArray(value) ? value : stringToPath(value);
      }
      function getMapData(map, key) {
        var data = map.__data__;
        return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
      }
      function getNative(object, key) {
        var value = getValue(object, key);
        return baseIsNative(value) ? value : void 0;
      }
      function isKey(value, object) {
        if (isArray(value)) {
          return false;
        }
        var type = typeof value;
        if (type == "number" || type == "symbol" || type == "boolean" || value == null || isSymbol(value)) {
          return true;
        }
        return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
      }
      function isKeyable(value) {
        var type = typeof value;
        return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
      }
      function isMasked(func) {
        return !!maskSrcKey && maskSrcKey in func;
      }
      var stringToPath = memoize(function(string) {
        string = toString(string);
        var result = [];
        if (reLeadingDot.test(string)) {
          result.push("");
        }
        string.replace(rePropName, function(match, number, quote, string2) {
          result.push(quote ? string2.replace(reEscapeChar, "$1") : number || match);
        });
        return result;
      });
      function toKey(value) {
        if (typeof value == "string" || isSymbol(value)) {
          return value;
        }
        var result = value + "";
        return result == "0" && 1 / value == -INFINITY ? "-0" : result;
      }
      function toSource(func) {
        if (func != null) {
          try {
            return funcToString.call(func);
          } catch (e) {
          }
          try {
            return func + "";
          } catch (e) {
          }
        }
        return "";
      }
      function memoize(func, resolver) {
        if (typeof func != "function" || resolver && typeof resolver != "function") {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
        var memoized = function() {
          var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
          if (cache.has(key)) {
            return cache.get(key);
          }
          var result = func.apply(this, args);
          memoized.cache = cache.set(key, result);
          return result;
        };
        memoized.cache = new (memoize.Cache || MapCache)();
        return memoized;
      }
      memoize.Cache = MapCache;
      function eq(value, other) {
        return value === other || value !== value && other !== other;
      }
      var isArray = Array.isArray;
      function isFunction(value) {
        var tag = isObject(value) ? objectToString.call(value) : "";
        return tag == funcTag || tag == genTag;
      }
      function isObject(value) {
        var type = typeof value;
        return !!value && (type == "object" || type == "function");
      }
      function isObjectLike(value) {
        return !!value && typeof value == "object";
      }
      function isSymbol(value) {
        return typeof value == "symbol" || isObjectLike(value) && objectToString.call(value) == symbolTag;
      }
      function toString(value) {
        return value == null ? "" : baseToString(value);
      }
      function get(object, path, defaultValue) {
        var result = object == null ? void 0 : baseGet(object, path);
        return result === void 0 ? defaultValue : result;
      }
      module.exports = get;
    }
  });

  // packages/plainjs/src/StreamParser.js
  var import_json = __toESM(require_umd(), 1);

  // packages/plainjs/src/BaseParser.js
  var import_lodash = __toESM(require_lodash(), 1);

  // packages/formatters/src/default.js
  function defaultFormatter(value) {
    if (value === null || value === void 0)
      return "";
    return `${value}`;
  }

  // packages/formatters/src/number.js
  function numberFormatter(opts = {}) {
    if (opts.separator) {
      if (opts.decimals) {
        return (value) => value.toFixed(opts.decimals).replace(".", opts.separator);
      }
      return (value) => `${value}`.replace(".", opts.separator);
    }
    if (opts.decimals) {
      return (value) => value.toFixed(opts.decimals);
    }
    return (value) => `${value}`;
  }

  // packages/formatters/src/string.js
  function stringFormatter(opts = {}) {
    const quote = typeof opts.quote === "string" ? opts.quote : '"';
    const escapedQuote = typeof opts.escapedQuote === "string" ? opts.escapedQuote : `${quote}${quote}`;
    if (!quote || quote === escapedQuote) {
      return (value) => value;
    }
    return (value) => {
      if (value.includes(quote)) {
        value = value.replace(new RegExp(quote, "g"), escapedQuote);
      }
      return `${quote}${value}${quote}`;
    };
  }

  // packages/formatters/src/symbol.js
  function symbolFormatter(opts = { stringFormatter: stringFormatter() }) {
    return (value) => opts.stringFormatter(value.toString().slice(7, -1));
  }

  // packages/formatters/src/object.js
  function objectFormatter(opts = { stringFormatter: stringFormatter() }) {
    return (value) => {
      if (value === null)
        return "";
      value = JSON.stringify(value);
      if (value === void 0)
        return "";
      if (value[0] === '"')
        value = value.replace(/^"(.+)"$/, "$1");
      return opts.stringFormatter(value);
    };
  }

  // packages/plainjs/src/utils.js
  function getProp(obj, path, defaultValue) {
    const value = obj[path];
    return value === void 0 ? defaultValue : value;
  }
  function flattenReducer(acc, arr) {
    try {
      acc.push(...arr);
      return acc;
    } catch (err) {
      return acc.concat(arr);
    }
  }
  function fastJoin(arr, separator) {
    let isFirst = true;
    return arr.reduce((acc, elem) => {
      if (elem === null || elem === void 0) {
        elem = "";
      }
      if (isFirst) {
        isFirst = false;
        return `${elem}`;
      }
      return `${acc}${separator}${elem}`;
    }, "");
  }

  // packages/plainjs/src/BaseParser.js
  var JSON2CSVBase = class {
    constructor(opts) {
      this.opts = this.preprocessOpts(opts);
    }
    preprocessOpts(opts) {
      const processedOpts = Object.assign({}, opts);
      if (processedOpts.fields) {
        processedOpts.fields = this.preprocessFieldsInfo(processedOpts.fields, processedOpts.defaultValue);
      }
      processedOpts.transforms = processedOpts.transforms || [];
      const stringFormatter2 = processedOpts.formatters && processedOpts.formatters["string"] || stringFormatter();
      const objectFormatter2 = objectFormatter({ stringFormatter: stringFormatter2 });
      const defaultFormatters = {
        header: stringFormatter2,
        undefined: defaultFormatter,
        boolean: defaultFormatter,
        number: numberFormatter(),
        bigint: defaultFormatter,
        string: stringFormatter2,
        symbol: symbolFormatter({ stringFormatter: stringFormatter2 }),
        function: objectFormatter2,
        object: objectFormatter2
      };
      processedOpts.formatters = {
        ...defaultFormatters,
        ...processedOpts.formatters
      };
      processedOpts.delimiter = processedOpts.delimiter || ",";
      processedOpts.eol = processedOpts.eol || "\n";
      processedOpts.header = processedOpts.header !== false;
      processedOpts.includeEmptyRows = processedOpts.includeEmptyRows || false;
      processedOpts.withBOM = processedOpts.withBOM || false;
      return processedOpts;
    }
    preprocessFieldsInfo(fields, globalDefaultValue) {
      return fields.map((fieldInfo) => {
        if (typeof fieldInfo === "string") {
          return {
            label: fieldInfo,
            value: fieldInfo.includes(".") || fieldInfo.includes("[") ? (row) => (0, import_lodash.default)(row, fieldInfo, globalDefaultValue) : (row) => getProp(row, fieldInfo, globalDefaultValue)
          };
        }
        if (typeof fieldInfo === "object") {
          const defaultValue = "default" in fieldInfo ? fieldInfo.default : globalDefaultValue;
          if (typeof fieldInfo.value === "string") {
            return {
              label: fieldInfo.label || fieldInfo.value,
              value: fieldInfo.value.includes(".") || fieldInfo.value.includes("[") ? (row) => (0, import_lodash.default)(row, fieldInfo.value, defaultValue) : (row) => getProp(row, fieldInfo.value, defaultValue)
            };
          }
          if (typeof fieldInfo.value === "function") {
            const label = fieldInfo.label || fieldInfo.value.name || "";
            const field = { label, default: defaultValue };
            return {
              label,
              value(row) {
                const value = fieldInfo.value(row, field);
                return value === null || value === void 0 ? defaultValue : value;
              }
            };
          }
        }
        throw new Error("Invalid field info option. " + JSON.stringify(fieldInfo));
      });
    }
    getHeader() {
      return fastJoin(this.opts.fields.map((fieldInfo) => this.opts.formatters.header(fieldInfo.label)), this.opts.delimiter);
    }
    preprocessRow(row) {
      return this.opts.transforms.reduce((rows, transform) => rows.map((row2) => transform(row2)).reduce(flattenReducer, []), [row]);
    }
    processRow(row) {
      if (!row) {
        return void 0;
      }
      const processedRow = this.opts.fields.map((fieldInfo) => this.processCell(row, fieldInfo));
      if (!this.opts.includeEmptyRows && processedRow.every((field) => field === "")) {
        return void 0;
      }
      return fastJoin(processedRow, this.opts.delimiter);
    }
    processCell(row, fieldInfo) {
      return this.processValue(fieldInfo.value(row));
    }
    processValue(value) {
      return this.opts.formatters[typeof value](value);
    }
  };

  // packages/plainjs/src/StreamParser.js
  var JSON2CSVStreamParser = class extends JSON2CSVBase {
    constructor(opts, asyncOpts) {
      super(opts);
      this.opts = this.preprocessOpts(opts);
      this.initTokenizer(opts, asyncOpts);
      if (this.opts.fields)
        this.preprocessFieldsInfo(this.opts.fields);
    }
    initTokenizer(opts = {}, asyncOpts = {}) {
      if (asyncOpts.objectMode) {
        this.tokenizer = this.getObjectModeTokenizer();
        return;
      }
      if (opts.ndjson) {
        this.tokenizer = this.getNdJsonTokenizer(asyncOpts);
        return;
      }
      this.tokenizer = this.getBinaryModeTokenizer(asyncOpts);
      return;
    }
    getObjectModeTokenizer() {
      return {
        write: (data) => this.pushLine(data),
        end: () => {
          this.pushHeaderIfNotWritten();
          this.onEnd();
        }
      };
    }
    configureCallbacks(tokenizer, tokenParser) {
      tokenizer.onToken = tokenParser.write.bind(this.tokenParser);
      tokenizer.onError = (err) => this.onError(err);
      tokenizer.onEnd = () => {
        if (!this.tokenParser.isEnded)
          this.tokenParser.end();
      };
      tokenParser.onValue = (value) => this.pushLine(value);
      tokenParser.onError = (err) => this.onError(err);
      tokenParser.onEnd = () => {
        this.pushHeaderIfNotWritten();
        this.onEnd();
      };
    }
    getNdJsonTokenizer(asyncOpts) {
      const tokenizer = new import_json.Tokenizer({ ...asyncOpts, separator: this.opts.eol });
      this.tokenParser = new import_json.TokenParser({
        paths: ["$"],
        keepStack: false,
        separator: this.opts.eol
      });
      this.configureCallbacks(tokenizer, this.tokenParser);
      return tokenizer;
    }
    getBinaryModeTokenizer(asyncOpts) {
      const tokenizer = new import_json.Tokenizer(asyncOpts);
      tokenizer.onToken = (token, value, offset) => {
        if (token === import_json.TokenType.LEFT_BRACKET) {
          this.tokenParser = new import_json.TokenParser({
            paths: ["$.*"],
            keepStack: false
          });
        } else if (token === import_json.TokenType.LEFT_BRACE) {
          this.tokenParser = new import_json.TokenParser({ paths: ["$"], keepStack: false });
        } else {
          this.onError(new Error("Data should be a JSON object or array"));
          return;
        }
        this.configureCallbacks(tokenizer, this.tokenParser);
        this.tokenParser.write(token, value, offset);
      };
      tokenizer.onError = () => this.onError(new Error("Data should be a JSON object or array"));
      tokenizer.onEnd = () => {
        this.onError(new Error('Data should not be empty or the "fields" option should be included'));
        this.onEnd();
      };
      return tokenizer;
    }
    write(data) {
      this.tokenizer.write(data);
    }
    end() {
      if (this.tokenizer && !this.tokenizer.isEnded)
        this.tokenizer.end();
    }
    pushHeaderIfNotWritten() {
      if (this._hasWritten)
        return;
      if (!this.opts.fields) {
        this.onError(new Error('Data should not be empty or the "fields" option should be included'));
        return;
      }
      this.pushHeader();
    }
    pushHeader() {
      if (this.opts.withBOM) {
        this.onData("\uFEFF");
      }
      if (this.opts.header) {
        const header = this.getHeader();
        this.onHeader(header);
        this.onData(header);
        this._hasWritten = true;
      }
    }
    pushLine(data) {
      const processedData = this.preprocessRow(data);
      if (!this._hasWritten) {
        this.opts.fields = this.preprocessFieldsInfo(this.opts.fields || Object.keys(processedData[0]));
        this.pushHeader(this.opts.fields);
      }
      processedData.forEach((row) => {
        const line = this.processRow(row);
        if (line === void 0)
          return;
        this.onLine(line);
        this.onData(this._hasWritten ? this.opts.eol + line : line);
        this._hasWritten = true;
      });
    }
    onHeader(header) {
    }
    onLine(line) {
    }
    onData(data) {
    }
    onError() {
    }
    onEnd() {
    }
  };

  // packages/transforms/src/flatten.js
  function flatten({
    objects = true,
    arrays = false,
    separator = "."
  } = {}) {
    function step(obj, flatDataRow, currentPath) {
      Object.keys(obj).forEach((key) => {
        const newPath = currentPath ? `${currentPath}${separator}${key}` : key;
        const value = obj[key];
        if (objects && typeof value === "object" && value !== null && !Array.isArray(value) && Object.prototype.toString.call(value.toJSON) !== "[object Function]" && Object.keys(value).length) {
          step(value, flatDataRow, newPath);
          return;
        }
        if (arrays && Array.isArray(value)) {
          step(value, flatDataRow, newPath);
          return;
        }
        flatDataRow[newPath] = value;
      });
      return flatDataRow;
    }
    return (dataRow) => step(dataRow, {});
  }

  // packages/transforms/src/unwind.js
  var import_lodash2 = __toESM(require_lodash(), 1);

  // packages/transforms/src/utils.js
  function setProp(obj, path, value) {
    const pathArray = Array.isArray(path) ? path : path.split(".");
    const [key, ...restPath] = pathArray;
    return {
      ...obj,
      [key]: pathArray.length > 1 ? setProp(obj[key] || {}, restPath, value) : value
    };
  }
  function unsetProp(obj, path) {
    const pathArray = Array.isArray(path) ? path : path.split(".");
    const [key, ...restPath] = pathArray;
    if (typeof obj[key] !== "object") {
      return obj;
    }
    if (pathArray.length === 1) {
      return Object.keys(obj).filter((prop) => prop !== key).reduce((acc, prop) => ({ ...acc, [prop]: obj[prop] }), {});
    }
    return Object.keys(obj).reduce((acc, prop) => ({
      ...acc,
      [prop]: prop !== key ? obj[prop] : unsetProp(obj[key], restPath)
    }), {});
  }
  function flattenReducer2(acc, arr) {
    try {
      acc.push(...arr);
      return acc;
    } catch (err) {
      return acc.concat(arr);
    }
  }

  // packages/transforms/src/unwind.js
  function getUnwindablePaths(obj, currentPath) {
    return Object.keys(obj).reduce((unwindablePaths, key) => {
      const newPath = currentPath ? `${currentPath}.${key}` : key;
      const value = obj[key];
      if (typeof value === "object" && value !== null && !Array.isArray(value) && Object.prototype.toString.call(value.toJSON) !== "[object Function]" && Object.keys(value).length) {
        unwindablePaths = unwindablePaths.concat(getUnwindablePaths(value, newPath));
      } else if (Array.isArray(value)) {
        unwindablePaths.push(newPath);
        unwindablePaths = unwindablePaths.concat(value.map((arrObj) => getUnwindablePaths(arrObj, newPath)).reduce(flattenReducer2, []).filter((item, index, arr) => arr.indexOf(item) !== index));
      }
      return unwindablePaths;
    }, []);
  }
  function unwind({ paths = void 0, blankOut = false } = {}) {
    function unwindReducer(rows, unwindPath) {
      return rows.flatMap((row) => {
        const unwindArray = (0, import_lodash2.default)(row, unwindPath);
        if (!Array.isArray(unwindArray)) {
          return row;
        }
        if (!unwindArray.length) {
          return unsetProp(row, unwindPath);
        }
        const baseNewRow = blankOut ? {} : row;
        const [firstRow, ...restRows] = unwindArray;
        return [
          setProp(row, unwindPath, firstRow),
          ...restRows.map((unwindRow) => setProp(baseNewRow, unwindPath, unwindRow))
        ];
      });
    }
    paths = Array.isArray(paths) ? paths : paths ? [paths] : void 0;
    return (dataRow) => (paths || getUnwindablePaths(dataRow)).reduce(unwindReducer, [dataRow]);
  }

  // docs/docs-export.js
  window.Json2csvStreamParser = JSON2CSVStreamParser;
  window.Json2csvTransforms = { unwind, flatten };
})();
