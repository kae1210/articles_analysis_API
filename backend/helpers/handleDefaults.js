// デフォルト値を統一的に処理するヘルパー
// 目的: pvやreferrerなどのNULL/空値処理を統一して繰り返しを減らす

const withDefault = (value, defaultValue)  => {
    return value !== undefined && value !== null && value !== '' ? value : defaultValue;
  }
  
  module.exports = { withDefault };
  