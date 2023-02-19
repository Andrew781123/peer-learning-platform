var satelize = require("satelize");
var ExternalIP = "173.194.70.100"; // I asume that, you already have external(public)IP

export const getIspFromIp = async (ip: string): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    satelize.satelize({ ip: ExtenalIP }, function (err, geoData) {
      if (err) {
        console.log(" Error in retriving ISP Information");
      } else {
        console.log("ISP Information for " + ExternalIP + " :" + geoData);
      }
    });
  });
};
