const acl = {
  user: ["owner", "superadmin", "admin"],
  createUser: ["superadmin", "admin"]
};

export const roleResolver = (methodName, role) =>
  acl[methodName].indexOf(role) > -1;

export const resolverWithRole = (
  methodName,
  role,
  { userId, targetId },
  resolver
) => {
  const rule = acl[methodName];
  if (rule.indexOf("owner") > -1) {
    //console.log(userId === targetId);
    if ((methodName = "user" && userId === targetId)) {
      return resolver();
    }
  }

  if (!rule || rule.indexOf(role) > -1) {
    return resolver();
  } else {
    return Promise.reject("Unauthorized");
  }
};
