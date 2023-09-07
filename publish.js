const ghpages = require("gh-pages");

console.log("dont forget to run 'npx vite build' first.");

ghpages.publish(
  "dist",
  {
    repo: "git@github.com:Berenddeperend/picross.git",
    branch: "dist",
  },
  function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("uploaded succesful.");
    }
  }
);
