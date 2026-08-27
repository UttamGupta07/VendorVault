const Role = require("../models/rolemodel");
const defaultRoles = require("./defaultRoles");

const seedDefaultRoles = async (organizationId) => {
  try {
    const roles = Object.entries(defaultRoles);

    for (const [roleName, roleData] of roles) {
      await Role.findOneAndUpdate(
        {
          organizationId,
          name: roleName,
        },
        {
          organizationId,
          name: roleName,
          displayName: roleData.displayName,
          description: roleData.description,
          permissions: roleData.permissions,
          isSystemRole: true,
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );
    }

    console.log(
      `Default roles seeded for organization ${organizationId}`
    );
  } catch (error) {
    console.error("Role seeding error:", error);
    throw error;
  }
};

module.exports = {seedDefaultRoles};