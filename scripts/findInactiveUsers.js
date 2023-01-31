// 1. replace with the {id: url} copied from the frontend users/pictures fetch request
// 2. Run the script in a js console - idBySize contains the list of user ids with same size of pictures.
// This is a hack possibly working because size 800 or 5757 (or any size key that stores several user ids) should mean the users pictures are missing
// which means the google account user is inactive
// 3. run in sql pod : update users set "isActive"=false  where id in (111, ...);
const pics = {
  2: "https://lh3.googleusercontent.com/a-/xxxxx",
};

idBySize = {};

for (const i in pics) {
  const resp = await fetch(pics[i], {
    referrerPolicy: "strict-origin-when-cross-origin",
    body: null,
    method: "GET",
    mode: "cors",
    credentials: "omit",
  });
  const length = resp.headers.get("Content-Length");
  if (!(length in idBySize)) {
    idBySize[length] = [i];
  } else {
    idBySize[length].push(i);
  }
}
console.log(idBySize);
