const roleModel = require("../models/RoleModel")
//roleModel == roles
const getAllRoles = async (req, res) => {
  //await....
  //select * from roleModel

  const roles = await roleModel.find() //[{}]

  res.json({
    message: "role fetched successfully",
    data: roles
  });
};

const addRole = async (req, res) => {

  const saveRole = await roleModel.create(req.body)
  res.json({
    message: "role created..",
    data: saveRole
  })

}
const deleteRole = async (req, res) => {

  //delete from role where id =?
  //req.params
  //console.log(req.paramas.id) 
  const deletedRole = await roleModel.findByIdAndDelete(req.params.id)
  res.json({
    message: "role deleted successfully",
    data: deletedRole
  })
}
const getRoleById = async (req, res) => {
  const FoundRole = await roleModel.findById(req.params.id)
  res.json({
    message: "role fetched",
    data: FoundRole

  })
}


module.exports = {
  getAllRoles, addRole, deleteRole, getRoleById
}