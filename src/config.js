const config = {
    LOCAL: {
      API_BASE_URL: "http://localhost:5001/api",
    },
    SERVER: {
      API_BASE_URL: "http://ec2-13-48-43-6.eu-north-1.compute.amazonaws.com:5001/api",
    },
  };
  
  // Change this to 'LOCAL' when developing locally and 'SERVER' when deploying
  const ENV = process.env.REACT_APP_ENV || "LOCAL";
  
  export default config[ENV];
  