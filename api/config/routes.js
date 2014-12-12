module.exports.routes = {
  '/': {
    view: 'homepage'
  },
 
  'get /public/images/*': {
    controller: 'FileController',
    action: 'get'
  }
};