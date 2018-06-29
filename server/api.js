var experss = require('express');
var router = experss.Router();
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
const webpush = require('web-push');

const vapidKeys = {
  publicKey:
    'BDCqREY9G8__-ZRTC5zWAO5ox73t9yUm_l0rR-kXKm0ZBHtB5vjjHhP90dxjTUuzbMUOoocE2tBPDDdbkOJwnO0',
  privateKey: 'h7hheK7ufvrG_MOaF6z-vIa56jcOxOa6xlhRAWniVoc'
};

webpush.setVapidDetails(
  'mailto:web-push-book@gauntface.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

const connection = function(closure) {
  return MongoClient.connect('mongodb://localhost:27017/tracking_system', function(err, db) {
    if(err) {
      return console.log(err);
    }
    closure(db);
  })
};

var response = {
  status: 200,
  message: null,
  data: []
};

var sendError = function(err, res) {
  response.status = 500;
  response.message = typeof err === 'object' ? err.message: err;
  res.setHeader('Content-Type', 'application/json');
  res.status(500).json(response);
};

router.get('/projects', function(req, res) {
  connection(function(db) {
    db.collection('projects').find().toArray()
      .then(function(projects) {
        response.data = projects;
        res.json(response);
      })
      .catch(this.sendError);
  })
});

router.post('/project', function(req, res) {
  connection(function(db) {
    db.collection('projects').insertOne(req.body)
      .then(function(project) {
        response.data = project;
        res.json(response);
      })
      .catch(this.sendError);
  })
});

router.put('/project', function(req, res) {
  connection(function(db) {
    db.collection('projects').updateOne({'projectId': 3}, {$set: req.body})
      .then(function(project) {
        response.data = project;
        res.json(response);
      })
      .catch(this.sendError);
  })
});

router.delete('/project', function(req, res) {
  connection(function(db) {
    db.collection('projects').deleteOne(req.query)
      .then(function(project) {
        response.data = project;
        res.json(response);
      })
      .catch(this.sendError);
  })
});

router.get('/reports', function(req, res) {
  connection(function(db) {
    db.collection('reports').find().toArray()
      .then(function(reports) {
        response.data = reports;
        res.json(response);
      })
      .catch(this.sendError);
  })
});

router.post('/report', function(req, res) {
  connection(function(db) {
    db.collection('reports').insertOne(req.body)
      .then(function(report) {
        response.data = report;
        res.json(response);
      })
      .catch(this.sendError);
  })
});

router.put('/report', function(req, res) {
  connection(function(db) {
    db.collection('reports').updateOne({'reportId': req.body.reportId}, {$set: req.body})
      .then(function(report) {
        response.data = report;
        res.json(response);
      })
      .catch(this.sendError);
  })
});

router.delete('/report', function(req, res) {
  connection(function(db) {
    db.collection('reports').deleteMany({'reportId': {'$in' : Object.values(req.query)}})
      .then(function(report) {
        response.data = report;
        res.json(response);
      })
      .catch(this.sendError);
  })
});

router.get('/employees', function(req, res) {
  connection(function(db) {
    console.log('db: ', db);
    db.collection('employees').find().toArray()
      .then(function(reports) {
        response.data = reports;
        res.json(response);
      })
      .catch(this.sendError);
  })
});

router.post('/employee', function(req, res) {
  console.log('in employee');
  connection(function(db) {
    db.collection('employees').insertOne(req.body)
      .then(function(report) {
        response.data = report;
        res.json(response);
      })
      .catch(this.sendError);
  })
});

router.put('/employee', function(req, res) {
  connection(function(db) {
    db.collection('employees').updateOne({'employeeId': '1'}, {$set: req.body})
      .then(function(report) {
        response.data = report;
        res.json(response);
      })
      .catch(this.sendError);
  })
});

router.delete('/employee', function(req, res) {
  connection(function(db) {
    db.collection('employees').deleteOne(req.query)
      .then(function(report) {
        response.data = report;
        res.json(response);
      })
      .catch(this.sendError);
  })
});

router.post('/subscription', function (req, res) {
  checkSubscription(req, res)
    .then(function (result) {
      if(!result && isValidSaveRequest(req)){
        connection(function (db) {
          db.collection('subscription').insertOne(req.body, function (err) {
            if (err) {
              const message = 'The subscription was received but we were unable to save it to our database';
              res.setHeader('Content-Type', 'application/json');
              return res.status(500).send({message: message});
            }
            response.data = {success: true};
            res.json(response);
          })
        })
      }
    });
});

function checkSubscription(req) {
  return new Promise(function (resolve) {
    connection(function (db) {
      db.collection('subscription').findOne({'keys': req.body.keys}, function (err, result) {
        resolve(result);
      })
    })
  })
}

function isValidSaveRequest(req, res) {
  if (!req.body || !req.body.endpoint) {
    res.status(400);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
      message: 'Subscription must have an endpoint.'
    }));
    return false;
  }
  return true;
}

function getSubscriptionsFromDatabase(req, res) {
  return new Promise(function (resolve, reject) {
    connection(function (db) {
      db.collection('subscription').find().toArray()
        .then(function (reports) {
          resolve(reports);
        }, function (error) {
          reject(error);
        })
    })
  })
}

function deleteSubscriptionFromDatabase(id) {
  return new Promise(function (resolve, reject) {
    connection(function (db) {
      db.collection('subscription').deleteOne({ "_id" : ObjectID(id) })
        .then(function (report) {
          resolve(report);
        }, function (error) {
          reject(error);
        })
    })
  });
}

const triggerPushMsg = function (subscription, dataToSend) {
  return webpush.sendNotification(subscription, dataToSend)
    .catch(function (err) {
      if (err.statusCode === 410) {
        return deleteSubscriptionFromDatabase(subscription._id);
      } else {
        console.log('Subscription is no longer valid: ', err);
      }
    });
};

router.post('/trigger-push-msg', function (req, res) {
  getSubscriptionsFromDatabase(req, res)
    .then(function (subscriptions) {
      var promiseChain = Promise.resolve();

      for (var i = 0; i < subscriptions.length; i++) {
        const subscription = subscriptions[i];
        promiseChain = promiseChain.then(function () {
          return triggerPushMsg(subscription, JSON.stringify(req.body));
        });
      }

      return promiseChain;
    })
    .then(function () {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({data: {success: true}}));
    })
    .catch(function(err) {
      res.status(500);
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({
        error: {
          id: 'unable-to-send-messages',
          message: 'We were unable to send messages to all subscriptions : ' +'${err.message}'
        }
      }));
    });
});

module.exports = router;
