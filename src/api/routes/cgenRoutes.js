module.exports = function(app) {
    var cgenController = require('../controllers/cgenController');
  
    // todoList Routes
    app.route('/api/cgen')
      .get(cgenController.get_columns)
 
  };