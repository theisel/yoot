// 🚨 INTERNAL API: DO NOT USE IN APPLICATION CODE
// This module is intended for use only by @yoot/* adapter packages.
// It is not part of the public API, may change without notice, and is unsupported.
// All exports are prefixed with `_` to signal their internal status.
export {
  hasIntrinsicDimensions as _hasIntrinsicDimensions,
  isKeyOf as _isKeyOf,
  invariant as _invariant,
  isEmpty as _isEmpty,
  isNullish as _isNullish,
  isNumber as _isNumber,
  isString as _isString,
} from './core/utils';
