const PasswordValidator = require('password-validator');

const passwordSchema = new PasswordValidator();

passwordSchema
  .is().min(8)                                   
  .has().uppercase()                             
  .has().symbols()                               
  .has().not().spaces();                         

module.exports = passwordSchema;
