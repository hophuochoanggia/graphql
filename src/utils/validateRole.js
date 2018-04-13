export default (user, targetRole) => (id, next) => {
  user
    .findById(id)
    .then(data => {
      if (!data) return Promise.reject(new Error('Cannot find user'));
      const { role } = data;
      if (role === targetRole) {
        return next();
      }
      return next(`User is not a ${targetRole}`);
    })
    .catch(e => next(e));
};
