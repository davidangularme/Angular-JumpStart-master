"use strict";

global.filenameFromClient = "";
// nodemon ./server.js localhost 3000  ng build --watch
var express     = require('express'),
    bodyParser  = require('body-parser'),
    fs          = require('fs'),
    app         = express(),
    path = require('path'),
    multer = require('multer'),
    customers   =[],//= JSON.parse(fs.readFileSync('data/customers.json', 'utf-8')),
    states      =[];//= JSON.parse(fs.readFileSync('data/states.json', 'utf-8'));





var Database = require('arangojs').Database;
var db = new Database('http://127.0.0.1:8529');
db.useBasicAuth('root', 'admin');

var collection ;
var collectioncustomers ;
var collectionstates ;
var doc = {
  _key: 'userpassDocument',
  a: 'a@a.com',
  b: 'aaaaaa1',
  c: Date()
};


db.listDatabases()
.then((names) => {
    if (names.indexOf('mydavidcredential') > -1){
        db.useDatabase('mydavidcredential');
        db.get().then(
            ()=> {console.log("Using database "+names.indexOf('mydavidcredential'));
             collection = db.collection('userpassCollection');
             if(collection){

            }else{
              collection.create().then(
                () => {
                  console.log('Collection created')
                  collection.save(doc).then(
                  meta => console.log('Document saved:', meta._rev),
                  err => console.error('Failed to save document:', err)
                );
                      },
                err => console.error('Failed to create collection:', err)
              );

            }

             collectioncustomers = db.collection('customers');
             collectionstates = db.collection('states');


             collectioncustomers.count().then(
              value => console.log('customers count '+ value.count),
              err => console.error('counteeeee:', err)
             );

             collectionstates.count().then(
              value => console.log('states count '+ value.count),
              err => console.error('counteeeee:', err)
             );






             collectioncustomers.all().then(
                cursor =>  cursor.map(doc => {customers.push(doc);
                                             /* console.log(doc);*/  } )
              ).then(
                keys => console.log('All keys11111111111111:', keys.join(', ')),
                err => console.error('Failed to fetch all documents:', err)
              );

              collectionstates.all().then(
                cursor => cursor.map(doc => states.push(doc))
              ).then(
                keys => console.log('All keys2222222222222:', keys.join(', ')),
                err => console.error('Failed to fetch all documents:', err)
              );

              collectionstates.get()
            },
            error=> console.error("Error connecting to database: "+error)
        );
    } else {
        db.createDatabase('mydavidcredential').then(
            ()=> db.useDatabase('mydavidcredential'),
            error=> console.error("Error creating database: "+error)
        );
    }
});



var result1;
/*
collectioncustomers.document('userpassDocument').then(
  result1 => {
                 console.log('Documentdav:', JSON.stringify(doc, null, 2));
                 result1 =  JSON.stringify(doc, null, 2);
                 console.log('davdavdav =' + result1 );

              },
  err => console.error('Failed to fetch document:', err)
);
*/








/*
collectionstates.all().then(
  cursor => cursor.map(doc => doc._key)
).then(
  keys => console.log('All keys:', keys.join(', ')),
  err => console.error('Failed to fetch all documents:', err)
);*/



var setDefaultBrowser = require('set-default-browser') ;

setDefaultBrowser("chrome");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//The dist folder has our static resources (index.html, css, images)
app.use(express.static(__dirname + '/dist'));
app.use(express.static(path.join(__dirname, '/uploads')));
app.use('/static', express.static(__dirname + '/uploads'));
app.use(bodyParser({uploadDir:'/dist'}));

app.use(function(req, res, next) { //allow cross origin requests
  res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Origin", "/");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", true);
  console.log('sssssss');
  next();
});

app.get('/api/customers/page/:skip/:top', (req, res) => {
    const topVal = req.params.top,
          skipVal = req.params.skip,
          skip = (isNaN(skipVal)) ? 0 : +skipVal;
    let top = (isNaN(topVal)) ? 10 : skip + (+topVal);

    if (top > customers.length) {
        top = skip + (customers.length - skip);
    }

    console.log(`Skip: ${skip} Top: ${top}`);

    var pagedCustomers = customers.slice(skip, top);
    res.setHeader('X-InlineCount', customers.length);
    res.json(pagedCustomers);
});

app.get('/api/customers', (req, res) => {
    res.json(customers);
});

app.get('/api/customers/:id', (req, res) => {
    let customerId = +req.params.id;
    let selectedCustomer = {};
    for (let customer of customers) {
        if (customer.id === customerId) {

           selectedCustomer = customer;
           console.log('fffff '+selectedCustomer._key);
           break;
        }
    }
    res.json(selectedCustomer);
});

app.post('/getfilename', (req, res) => {
 console.log('dddddd');
console.log(global.filenameFromClient);
console.log('dddddd');

  res.json(global.filenameFromClient);



});

app.post('/api/customers', (req, res) => {
    let postedCustomer = req.body;
    console.log(postedCustomer);
    let maxId = Math.max.apply(Math,customers.map((cust) => cust.id));
    postedCustomer.id = ++maxId;
    postedCustomer.gender = (postedCustomer.id % 2 === 0) ? 'female' : 'male';
    console.log('papapa  '+JSON.stringify(postedCustomer) );

    collectioncustomers.save(postedCustomer).then(
      meta => {console.log('Document saved:', meta._key);
      collectioncustomers.document(meta._key).then(
        result => {
                       console.log('Document:', JSON.stringify(result, null, 2));
                       //result =  JSON.stringify(doc, null, 2);
                       customers.push(result);
                       res.json(result);

                    },
        err => console.error('Failed to fetch document:', err)
      );

              },
      err => console.error('Failed to save document:', err)
    );

});

app.put('/api/customers/:id', (req, res) => {
    let putCustomer = req.body;
    let id = +req.params.id;
    let status = false;

    //Ensure state name is in sync with state abbreviation
    const filteredStates = states.filter((state) => state.abbreviation === putCustomer.state.abbreviation);
    if (filteredStates && filteredStates.length) {
        putCustomer.state.name = filteredStates[0].name;
        console.log('Updated putCustomer state to ' + putCustomer.state.name);
    }

    for (let i=0,len=customers.length;i<len;i++) {
        if (customers[i].id === id) {
            console.log('putCustomer == '+JSON.stringify(putCustomer));
            customers[i] = putCustomer;
            collectioncustomers.update(putCustomer._key,putCustomer).then(
              meta => console.log('Document updated:', meta._rev),
              err => console.error('Failed to update document:', err)
            );


            status = true;
            break;
        }
    }
    res.json({ status: status });
});

app.delete('/api/customers/:id', function(req, res) {
    let customerId = +req.params.id;
    for (let i=0,len=customers.length;i<len;i++) {
        if (customers[i].id === customerId) {
          collectioncustomers.remove(customers[i]).then(
            meta => console.log('Document updated:', meta._rev),
            err => console.error('Failed to update document:', err)
          );

           customers.splice(i,1);
           break;
        }
    }
    res.json({ status: true });
});

app.get('/api/orders/:id', function(req, res) {
    let customerId = +req.params.id;
    for (let cust of customers) {
        if (cust.customerId === customerId) {
            return res.json(cust);
        }
    }
    res.json([]);
});

app.get('/api/states', (req, res) => {
    res.json(states);
});

app.post('/api/auth/login', (req, res) => {
    var userLogin = req.body;
    var userLoginObj =  JSON.stringify(userLogin) ;
    var result;
    collection.document('userpassDocument').then(
      result => {
                     console.log('Document:', JSON.stringify(result, null, 2));
                     //result =  JSON.stringify(doc, null, 2);
                     if((req.body.email == result.a) && (req.body.password == result.b)){
                       res.json(true);
                     }else{
                       res.json(false);
                     }

                  },
      err => console.error('Failed to fetch document:', err)
    );


});

app.post('/api/auth/update', (req, res) => {
  var userLogin = req.body;
  var userLoginObj =  JSON.stringify(userLogin) ;
  console.log('userlogin2qqqq22 =' + req.body.email + " " + req.body.password );

  doc = {
    _key: 'userpassDocument',
    a: req.body.email,
    b: req.body.password,
    c: Date()
  }

  collection.update('userpassDocument',{a:req.body.email,b: req.body.password}).then(
    meta => console.log('Document updated:', meta._rev),
    err => console.error('Failed to update document:', err)
  );



    res.json(true);

});

app.post('/api/auth/logout', (req, res) => {
    res.json(true);
});

var storage = multer.diskStorage({ //multers disk storage settings
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    var datetimestamp = Date.now();
    cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
  }
});

var upload = multer({ //multer settings
  storage: storage
}).single('file');

/** API path that will upload the files */
app.post('/upload', function(req, res) {
  upload(req,res,function(err){
    console.log("papadizi111 = ");
    console.log( req.file.filename);
    global.filenameFromClient = req.file.filename ;
    console.log("papadizi222 = ");
    if(err){
      res.json({error_code:1,err_desc:err});
      return;
    }
    res.json({error_code:0,err_desc:null});
  });
});

/*
app.post('/getimage', function(req, res) {
  res.sendFile('./uploads/file-1520949811913.jpeg');

});
/*
app.post('/getimage', function(req, res){

  console.log('ttttt = ' + fs.existsSync('uploads\\file-1520952905492.jpeg'));

  res.sendFile('uploads\\file-1520952905492.jpeg');
});*/

app.get('/getimage', function(req, res){
  var img = fs.readFileSync(__dirname+'/uploads/file-1520953026821.jpeg');
  res.writeHead(200, {'Content-Type': 'image/gif' });
  res.end(img, 'binary');
  /*
  res.sendFile('file-1520953026821.jpeg', {
    root: path.join(__dirname+'/uploads/')
  }, function (err) {
    if (err) {
      console.log(err);
    }
  });*/
});

/*
app.post('/users/avatar', function(req, res){
  res.sendFile(req.user.avatarName, {
    root: path.join(__dirname+'/../uploads/'),
    headers: {'Content-Type': 'image/png'}
  }, function (err) {
    if (err) {
      console.log(err);
    }
  });
});
*/
// redirect all others to the index (HTML5 history)
app.all('/*', function(req, res) {
    res.sendFile(__dirname + '/dist/index.html');
});

/*
app.post('/api/auth/upload', function (req, res) {
  console.log('/api/auth/upload');
  var tempPath = req.files.file.path,
    targetPath = path.resolve('./uploads/image.png');
  if (path.extname(req.files.file.name).toLowerCase() === '.png') {
    fs.rename(tempPath, targetPath, function(err) {
      if (err) throw err;
      console.log("Upload completed!");
    });
  } else {
    fs.unlink(tempPath, function () {
      if (err) throw err;
      console.error("Only .png files are allowed!");
    });
  }
});
*/
app.listen(3000);

console.log('Express listening on port 3000.');

//Open browser
//var opn = require('opn');

//opn('http://localhost:3000').then(() => {
//    console.log('Browser closed.');
//});


