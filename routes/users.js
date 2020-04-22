var express = require('express')
var app = express()

// SHOW LIST OF USERS
app.get('/', function(req, res, next) {
	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM users ORDER BY id ASC',function(err, rows, fields) {
			//if(err) throw err
			if (err) {
				req.flash('error', err)
				res.render('user/list', {
					title: 'User List', 
					data: ''
				})
			} else {
				// render to views/user/list.ejs template file
				res.render('user/list', {
					title: 'User List', 
					data: rows
				})
			}
		})
	})
})

// SHOW ADD USER FORM
app.get('/add', function(req, res, next){	
	// render to views/user/add.ejs
	res.render('user/add', {
		title: 'Add New Record',
		name: '',
		surname: '',
		age: '',
		birthday: '',
		email: '',
		address: '',
		identificationNo: '',
		history: '',
		phonenumber: '',
	})
})

// ADD NEW USER POST ACTION
app.post('/add', function(req, res, next){	
	req.assert('name', 'Name is required').notEmpty()           //Validate name
	req.assert('surname', 'Surname is required').notEmpty()           //Validate surname
	req.assert('age', 'Age is required').notEmpty()             //Validate age
	req.assert('birthday', 'Birthday is required').notEmpty()             //Validate birthday
    req.assert('email', 'A valid email is required').isEmail()  //Validate email
    req.assert('address', 'address is required').notEmpty()  //Validate address
    req.assert('identificationNo', 'identificationNo is required').notEmpty()  //Validate identificationNo
    req.assert('history', 'history is required').notEmpty()  //Validate history
    req.assert('phonenumber', 'phonenumber is required').notEmpty()  //Validate phonenumber

    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
		
		/********************************************
		 * Express-validator module
		 
		req.body.comment = 'a <span>comment</span>';
		req.body.username = '   a user    ';

		req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
		req.sanitize('username').trim(); // returns 'a user'
		********************************************/
		var user = {
			name: req.sanitize('name').escape().trim(),
			surname: req.sanitize('surname').escape().trim(),
			age: req.sanitize('age').escape().trim(),
			birthday: req.sanitize('birthday').escape().trim(),
			email: req.sanitize('email').escape().trim(),
			address: req.sanitize('address').escape().trim(),
			identificationNo: req.sanitize('identificationNo').escape().trim(),
			history: req.sanitize('history').escape().trim(),
			phonenumber: req.sanitize('phonenumber').escape().trim()
		}
		
		req.getConnection(function(error, conn) {
			conn.query('INSERT INTO users SET ?', user, function(err, result) {
				//if(err) throw err
				if (err) {
					req.flash('error', err)
					
					// render to views/user/add.ejs
					res.render('user/add', {
						title: 'Add New User',
						name: user.name,
						surname: user.surname,
						age: user.age,
						birthday: user.birthday,
						email: user.email,
						address: user.address,
						identificationNo: user.identificationNo,
						history: user.history,
						phonenumber: user.phonenumber
					})
				} else {				
					req.flash('success', 'Data added successfully!')
					
					// render to views/user/add.ejs
					res.render('user/add', {
						title: 'Add New User',
						name: '',
						surname: '',
						age: '',
						birthday: '',
						email: '',
						address: '',
						identificationNo: '',
						history: '',
						phonenumber: ''
					})
				}
			})
		})
	}
	else {   //Display errors to user
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})				
		req.flash('error', error_msg)		
		
		/**
		 * Using req.body.name 
		 * because req.param('name') is deprecated
		 */ 
        res.render('user/add', { 
            title: 'Add New User',
            name: req.body.name,
            surname: req.body.surname,
            age: req.body.age,
            birthday: req.body.birthday,
            email: req.body.email,
            address: req.body.address,
			identificationNo: req.body.identificationNo,
			history: req.body.history,
			phonenumber: req.body.phonenumber,
        })
    }
})

// SHOW EDIT USER FORM
app.get('/edit/(:id)', function(req, res, next){
	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM users WHERE id = ?', [req.params.id], function(err, rows, fields) {
			if(err) throw err
			
			// if user not found
			if (rows.length <= 0) {
				req.flash('error', 'User not found with id = ' + req.params.id)
				res.redirect('/users')
			}
			else { // if user found
				// render to views/user/edit.ejs template file
				res.render('user/edit', {
					title: 'Edit User', 
					//data: rows[0],
					id: rows[0].id,
					name: rows[0].name,
					surname: rows[0].surname,
					age: rows[0].age,
					birthday: rows[0].birthday,
					email: rows[0].email,
					address: rows[0].address,
					identificationNo: rows[0].identificationNo,
					history: rows[0].history,
					phonenumber: rows[0].phonenumber,
				})
			}			
		})
	})
})

// EDIT USER POST ACTION
app.put('/edit/(:id)', function(req, res, next) {
	req.assert('name', 'Name is required').notEmpty()           //Validate name
	req.assert('surname', 'Surname is required').notEmpty()           //Validate surname
	req.assert('age', 'Age is required').notEmpty()             //Validate age
	req.assert('birthday', 'Birthday is required').notEmpty()             //Validate birthday
    req.assert('email', 'A valid email is required').isEmail()  //Validate email
    req.assert('address', 'A valid address is required').notEmpty()  //Validate address
    req.assert('identificationNo', 'A valid identificationNo is required').notEmpty()  //Validate identificationNo
    req.assert('history', 'A valid history is required').notEmpty()  //Validate history
    req.assert('phonenumber', 'A valid phonenumber is required').notEmpty()  //Validate phonenumber

    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
		
		/********************************************
		 * Express-validator module
		 
		req.body.comment = 'a <span>comment</span>';
		req.body.username = '   a user    ';

		req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
		req.sanitize('username').trim(); // returns 'a user'
		********************************************/
		var user = {
			name: req.sanitize('name').escape().trim(),
			surname: req.sanitize('surname').escape().trim(),
			age: req.sanitize('age').escape().trim(),
			birthday: req.sanitize('birthday').escape().trim(),
			email: req.sanitize('email').escape().trim(),
			address: req.sanitize('address').escape().trim(),
			identificationNo: req.sanitize('identificationNo').escape().trim(),
			history: req.sanitize('history').escape().trim(),
			phonenumber: req.sanitize('phonenumber').escape().trim()
		}
		
		req.getConnection(function(error, conn) {
			conn.query('UPDATE users SET ? WHERE id = ' + req.params.id, user, function(err, result) {
				//if(err) throw err
				if (err) {
					req.flash('error', err)
					
					// render to views/user/add.ejs
					res.render('user/edit', {
						title: 'Edit User',
						id: req.params.id,
						name: req.body.name,
						surname: req.body.surname,
						age: req.body.age,
						birthday: req.body.birthday,
						email: req.body.email,
						address: req.body.address,
						identificationNo: req.body.identificationNo,
						history: req.body.history,
						phonenumber: req.body.phonenumber
					})
				} else {
					req.flash('success', 'Data updated successfully!')
					
					// render to views/user/add.ejs
					res.render('user/edit', {
						title: 'Edit User',
						id: req.params.id,
						name: req.body.name,
						surname: req.body.surname,
						age: req.body.age,
						birthday: req.body.birthday,
						email: req.body.email,
						address: req.body.address,
						identificationNo: req.body.identificationNo,
						history: req.body.history,
						phonenumber: req.body.phonenumber
					})
				}
			})
		})
	}
	else {   //Display errors to user
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})
		req.flash('error', error_msg)
		
		/**
		 * Using req.body.name 
		 * because req.param('name') is deprecated
		 */ 
        res.render('user/edit', { 
            title: 'Edit User',            
			id: req.params.id, 
			name: req.body.name,
			surname: req.body.surname,
			age: req.body.age,
			birthday: req.body.birthday,
			email: req.body.email,
			address: req.body.address,
			identificationNo: req.body.identificationNo,
			history: req.body.history,
			phonenumber: req.body.phonenumber
        })
    }
})

// DELETE USER
app.delete('/delete/(:id)', function(req, res, next) {
	var user = { id: req.params.id }

	req.getConnection(function(error, conn) {
		conn.query('DELETE FROM users WHERE id = ' + req.params.id, user, function(err, result) {
			//if(err) throw err
			if (err) {
				req.flash('error', err)
				// redirect to users list page
				res.redirect('/users')
			} else {
				req.flash('success', 'User deleted successfully! id = ' + req.params.id)
				// redirect to users list page
				res.redirect('/users')
			}
		})
	})
})

module.exports = app
