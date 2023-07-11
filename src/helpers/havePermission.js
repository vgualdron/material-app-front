const havePermission = (permission) => {
  const permissions = localStorage.getItem('permissionsMC') ? JSON.parse(localStorage.getItem('permissionsMC')) : [];
  const index = permissions.findIndex((object) => object.name === permission);
  return index !== -1;
};

export { havePermission };
