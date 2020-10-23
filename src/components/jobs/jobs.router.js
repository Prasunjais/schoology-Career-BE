// user controller 
const ctrl = require('./jobs.controller');

// custom joi validation
const {
  joiGetList, // get list of data validation
  joiGetJobDetails, // get job details 
} = require('./jobs.validators');

// exporting the user routes 
function jobRoutes() {
  return (open, closed, appOpen, appClosed) => {

    // get the list of jobs 
    closed.route('/jobs').get(
      [joiGetList], // Joi validation
      ctrl.getList // Controller function 
    );

    // get details of the job
    closed.route('/jobs/:jobId').get(
      [joiGetJobDetails], // Joi validation
      ctrl.getJobDetails // Controller function 
    );
  };
}

module.exports = jobRoutes();
