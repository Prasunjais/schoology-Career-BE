const BaseController = require('../baseController'); // parent controller
const _ = require('lodash'); // lodash 
const {
  error,
  info
} = require('../../utils').logging; // utils functions to log data on console

// job data 
const {
  jobs
} = require('../../utils/list'); // jobs list 
const pageSize = parseInt(process.env.pageSize || 20); // getting the page size

/**
 * THE DATA SOURCE IS A JSON FILE 
 * WHICH CONTAINS THE LIST OF JOBS AVAILABLE
 */

// getting the model 
class listController extends BaseController {
  // constructor 
  constructor() {
    super();
    this.messageTypes = this.messageTypes.jobs;
  }

  // get job list 
  getList = async (req, res) => {
    try {
      info('Fetching the list of jobs !');

      // getting the basic pagination setup
      let page = req.query.page || 1,
        skip = parseInt(page - 1) * pageSize,
        search = req.query.search || '';

      // get the reduced list
      let reducedList = jobs.map((data) => {
        return {
          id: data.id,
          title: data.title,
          company: data.company,
        }
      })

      // filtering the data 
      if (search && search != '') {
        let re = new RegExp(search, 'i') // creating a new regex expression
        reducedList = reducedList.filter((data) => {
          if (data.title.match(re) || data.company.match(re)) return data;
        })
      }

      // applying pagination using lodash 
      let list = _.chain(reducedList)
        .drop(skip)
        .take(pageSize)
        .value();

      // creating the response body
      let responseBody = {
        results: list,
        pageMeta: {
          pageSize: pageSize,
          skip: skip,
          total: reducedList.length
        }
      }

      // success response 
      return this.success(req, res, this.status.HTTP_OK, responseBody, this.messageTypes.listFetched);

      // catch any runtime error 
    } catch (err) {
      error(err);
      return this.errors(req, res, this.status.HTTP_INTERNAL_SERVER_ERROR, this.exceptions.internalServerErr(req, err));
    }
  }

  // get job details 
  getJobDetails = async (req, res) => {
    try {
      info('Get the job details !');

      // getting the basic pagination setup
      let jobId = req.params.jobId || '';
      let job = [];

      // filtering the data 
      if (jobId && jobId != '') {
        job = jobs.filter((data) => {
          if (data.id == jobId) return data;
        })
      } else {
        error('Job Id not found !');
        return this.errors(req, res, this.status.HTTP_BAD_REQUEST, this.messageTypes.jobIdIsInvalid(jobId));
      }

      // if the jobs details are not fetched 
      if (!job.length) {
        error('Job Id not found !');
        return this.errors(req, res, this.status.HTTP_BAD_REQUEST, this.messageTypes.jobIdIsInvalid(jobId));
      }

      // creating the response body
      let responseBody = {
        ...job.length ? job[0] : {}
      }

      // success response 
      return this.success(req, res, this.status.HTTP_OK, responseBody, this.messageTypes.detailsFetched);

      // catch any runtime error 
    } catch (err) {
      error(err);
      return this.errors(req, res, this.status.HTTP_INTERNAL_SERVER_ERROR, this.exceptions.internalServerErr(req, err));
    }
  }
}

// exporting the modules 
module.exports = new listController();
