const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tickets'
});

connection.connect((err) => {
    if (err) {
        console.log('db connection error');
    } else {
        console.log('DB is connected');
    }
});

app.use(bodyParser.json());

app.use(cors({
    origin: '*'
}));


app.get('/coachInfo', function(req, res) {
    var coachId = 1;
    var output = {};
    connection.query('SELECT * FROM `coachs` WHERE `id` = ?', [coachId], function(err, results, fields) {
        if (err) {
            output = {
                status: 'error',
                msg: 'Query error'
            }
            return res.status(400).json(output);
        } else if (results.length == 0) {
            output = {
                status: 'error',
                msg: 'Coach info not found'
            }
            return res.status(400).json(output);
        }
        var coachInfo = results[0];
        connection.query('SELECT seatNo FROM `booking_details` WHERE `coachId` = ?', [coachId], function(err, results2, fields) {

            var bookedData = results2.map(bookingInfo => bookingInfo.seatNo);
            coachInfo.bookedData = bookedData;
            if (err) {
                output = {
                    status: 'error',
                    msg: 'Query error'
                }
                return res.status(400).json(output);
            }

            output = {
                status: 'success',
                msg: 'Successfully',
                data: {
                    coachInfo: coachInfo
                }
            };
            res.status(200).json(output);
        });
    });
});


app.post('/seatBooks', function(req, res) {
    console.log('Got body:', req.body);
    var requestData = req.body;

    connection.query('SELECT * FROM `booking_details` WHERE `trainId` = ? AND `coachId` = ? AND `seatNo` IN (?) ', [requestData.trainId, requestData.coachId, requestData.seats], function(err, results, fields) {

        if (results.length == 0) {

            var bookingData = [requestData.trainId, requestData.coachId, requestData.userId, requestData.seats.length];
            connection.query('Insert Into `bookings` SET `trainId` = ? , `coachId` = ? , `userId` = ? , `totalSeats` = ? , `createdAt` = now() ', bookingData, function(err, results2, fields) {
                var promises = [];
                const query = "insert into booking_details set ?";
                for (let seatIndex = 0; seatIndex < requestData.seats.length; seatIndex++) {
                    var queryData = {
                        userId: requestData.userId,
                        trainId: requestData.trainId,
                        coachId: requestData.coachId,
                        seatNo: requestData.seats[seatIndex],
                        bookingId: results2.insertId
                    }
                    connection.query(query, queryData, (err, result) => {
                        if (err) {
                            throw (err);
                        }
                        promises.push(null);
                    });
                }

                Promise.all(promises).then(function(data) {
                    output = {
                        status: 'success',
                        msg: 'Successfully',
                        data: []
                    };
                    res.status(200).json(output);
                });
            });
        } else {
            output = {
                status: 'error',
                msg: results.length + ' seat(s) already Booked.'
            };
            res.status(200).json(output);
        }
    });

});

app.listen(3000);
console.log("server connected..!!");