export const hasErrors = (obj, whiteList = []) => {
  let errors = 0;
  for (let key in obj) {
    if (whiteList.includes(key)) continue; //ignore not required field
    if (key.includes("Error")) continue; //ignore non-database field
    if (obj[key] === "") {
      obj[`${key}Error`] = true;
      errors++;
    }
  }
  return errors;
};

export const resetErrors = (obj, whiteList = []) => {
  for (let key in obj) {
    if (whiteList.includes(key)) continue; //ignore not required field
    if (!key.includes("Error")) continue; //ignore non-error field
    obj[key] = false;
  }
};
export const makeFieldsError = (obj, whiteList = []) => {
  for (let key in obj) {
    if (whiteList.includes(key)) continue; //ignore not required field
    if (!key.includes("Error")) continue; //ignore non-error field
    obj[key] = true;
  }
};
export const resetFields = (obj, whiteList = []) => {
  for (let key in obj) {
    if (whiteList.includes(key)) continue; //ignore not required field
    if (key.includes("Error")) continue; //ignore non-database field
    obj[key] = "";
  }
};

export const fullname = (name) => {
  if (!name) return false;
  let fullname = "";
  fullname += name?.firstname + " " || "";
  fullname += name?.middlename ? name?.middlename + " " : "";
  fullname += name?.lastname || "";
  fullname += name?.suffix ? name?.suffix + " " : "";
  return fullname;
};

export const copyFields = (objDest, objSrc, whiteList = []) => {
  for (let key in objSrc) {
    if (whiteList.includes(key)) continue; //ignore not required field
    if (key.includes("Error")) continue; //ignore non-error field
    objDest[key] = objSrc[key];
  }
};
export const formatDate = (date) => {
  //2021-04-25
  return new Date(date).toISOString().slice(0, 10);
};
export const filterArrayObj = (array, key, ...allowed) => {
  let newArrayObj = {
    doc: [],
  };
  array.forEach((obj) => {
    if (allowed.includes(obj[key])) newArrayObj.doc.push(obj);
  });
  return newArrayObj;
};
