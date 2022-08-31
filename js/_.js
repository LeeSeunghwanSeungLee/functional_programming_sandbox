/**
 * _curry(function(a) {}) : 파라미터가 한개인 경우, 커링을 통해 b를 입력받아 실행할 수 있는 고차 함수를 리턴
 * _curry(function(a, b) {}) : 파라미터가 2개인 경우 즉시 실행
 */
function _curry(fn) {
    return function(a, b) {
      return arguments.length == 2 ? fn(a, b) : function(b) { return fn(a, b); };
    }
  }
  
/**
 * _curry(fn) 과 유사한 기능, 파라미터 입력 순서가 reverse 되어있다는 것이 차이점
 */
function _curryr(fn) {
  return function(a, b) {
    return arguments.length == 2 ? fn(a, b) : function(b) { return fn(b, a); };
  }
}
  
/**
 * _get(key)(obj) 로 실행하는 함수 표현식
 */
var _get = _curryr(function(obj, key) {
  return obj == null ? undefined : obj[key];
});

var _length = _get('length');

/**
 * list에 대해서 predi가 true가 되는 list만 필터링하는 함수
 * @param {*} predi : filter를 시키고 싶은 boolean 리턴하는 함수
 */
function _filter(list, predi) {
  var new_list = [];
  _each(list, function(val) {
    if (predi(val)) new_list.push(val);
  });
  return new_list;
}
  
/**
 * mapper를 적용시켜서 새로운 value 들을 list에 담아서 리턴하는 함수
 * @param {*} mapper : 함수로써, _each를 적용시킬 수 있는 함수를 의미한다
 */
function _map(list, mapper) {
  var new_list = [];
  _each(list, function(val, key) {
    new_list.push(mapper(val, key));
  });
  return new_list;
}

/**
 * object 타입인지 확인하는 함수
 */
function _is_object(obj) {
  return typeof obj == 'object' && !!obj; // typeof null == 'object' 이기 때문에 !!obj를 적용한다.
}
  
/**
 * Object.keys라는 함수를 실행한다. 다만 _is_object 함수를 이용해 obj타입이 아니라면, 빈 배열을 리턴한다.
 */
function _keys(obj) {
  return _is_object(obj) ? Object.keys(obj) : [];
}
  
  
/**
 * @param {*} iter : 반복해서 적용하고 싶은 함수를 의미
 */
function _each(list, iter) {
  var keys = _keys(list);
  for (var i = 0, len = keys.length; i < len; i++) {
    iter(list[keys[i]], keys[i]);
  }
  return list;
}
  
var _map = _curryr(_map);
  _each = _curryr(_each)
  _filter = _curryr(_filter);

var _pairs = _map(function (val, key) { return [key, val]; });

var slice = Array.prototype.slice;
function _rest(list, num) {
  return slice.call(list, num || 1); // if !(num) return 1;
}
  
function _reduce(list, iter, memo) {
  if (arguments.length == 2) {
    memo = list[0];
    list = _rest(list);
  }
  _each(list, function(val) {
    memo = iter(memo, val);
  });
  return memo;
}
  
  function _pipe() {
    var fns = arguments;
    return function(arg) {
      return _reduce(fns, function(arg, fn) {
        return fn(arg);
      }, arg);
    }
  }
  
  function _go(arg) {
    var fns = _rest(arguments);
    return _pipe.apply(null, fns)(arg);
  }
  
  var _values = _map(_identity);
  
  function _identity(val) {
    return val;
  }
  
  var _pluck = _curryr(function(data, key) {
    return _map(data, _get(key));
  });
  
  function _negate(func) {
    return function(val) {
      return !func(val);
    }
  }
  
  var _reject = _curryr(function(data, predi) {
    return _filter(data, _negate(predi));
  });
  
  var _compact = _filter(_identity);
  
  var _find = _curryr(function(list, predi) {
    var keys = _keys(list);
    for (var i = 0, len = keys.length; i < len; i++) {
      var val = list[keys[i]];
      if (predi(val)) return val;
    }
  });
  
  var _find_index = _curryr(function(list, predi) {
    var keys = _keys(list);
    for (var i = 0, len = keys.length; i < len; i++) {
      if (predi(list[keys[i]])) return i;
    }
    return -1;
  });
  
  function _some(data, predi) {
    return _find_index(data, predi || _identity) != -1;
  }
  
  function _every(data, predi) {
    return _find_index(data, _negate(predi || _identity)) == -1;
  }
  
  
  function _push(obj, key, val) {
    (obj[key] = obj[key] || []).push(val);
    return obj;
  }
  
  var _group_by = _curryr(function(data, iter) {
    return _reduce(data, function(grouped, val) {
      return _push(grouped, iter(val), val);
    }, {});
  });
  
  
  var _inc = function(count, key) {
    count[key] ? count[key]++ : count[key] = 1;
    return count;
  };
  
  var _count_by = _curryr(function(data, iter) {
    return _reduce(data, function(count, val) {
      return _inc(count, iter(val));
    }, {});
  });
  
  var _head = function(list) {
    return list[0];
  };