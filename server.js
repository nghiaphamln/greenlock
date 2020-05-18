"use strict";

var apps = require("./app.js");

require("greenlock-express")
  .init({
    packageRoot: __dirname,
    configDir: "./greenlock.d",

    maintainerEmail: "nghiaphamln3@gmail.com",

    cluster: false,
  })
  .serve(apps);

  