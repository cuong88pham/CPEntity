var EntityException = function(message, entityName){
  this.message = message;
  this.name    = entityName;
}

var setDefaultExpose = function(expose, HT, object){
  var HT = HT || {};
  var funcs = Object.keys(HT);
  if(funcs.indexOf(expose) == -1){
    var exp = eval("object."+expose);
    if(typeof exp != 'undefined'){
      return exp;
    }else{
      console.log(expose + " is not defined", expose);
      return '';
    }
  }
}

var renderExpose = function(expose, HT, object, data_entities){
  var type_expose = typeof expose;
  switch(type_expose){
    case 'object':
      var keys = Object.keys(expose);
      var using_index = keys.indexOf("using");
      if(using_index >= 0){
        var includeEntity = require('../controllers/entities/'+expose["using"]);
        var entity = eval("includeEntity."+expose["using"]+'()');
        if(typeof entity != 'undefined'){
          data_entities[expose["using"]] = entity
        }else{
          throw new EntityException(expose["using"] + " is not defined ", expose["using"]);
        }
      }else{
        var expose_key = Object.keys(expose)[0];
        data_entities[expose_key] = eval('HT.'+expose_key+"(object)") || expose[expose_key];
      }
      break;
    default:
      var mt = setDefaultExpose(expose, HT, object);
      var funcs = Object.keys(HT);
      if(funcs.indexOf(expose) >= 0){
        mt = eval('HT.'+expose+"(object)");
      }
      data_entities[expose] = mt;
      break;
  }
}

var CPEntity = function(exposes, HT, objects){
  var data = [];
  objects.forEach(function(object){
    var data_entities = {};
    exposes.forEach(function(expose){
      renderExpose(expose, HT, object, data_entities);
    });
    data.push(data_entities);
  });
  if(data.length == 1)
    data = data[0];
  return {count: objects.length, data: data};
}

module.exports.CPEntity = CPEntity;
