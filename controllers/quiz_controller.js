var models = require('../models/models.js');

// Autoload - factoriza el código si la ruta incluye :quizId
exports.load = function(req, res, next, quizId){
		models.Quiz.find({
			where: { id: Number(quizId)},
			include: [{ model: models.Comment}]
		}).then(
				function(quiz){
					if (quiz){
						req.quiz = quiz;
						next();
					} else { next(new Error('No existe quizId=' + quizId));}
				}
		).catch(function(error){next(error);});
};


// GET /quizes
exports.index = function(req, res){
	console.log("busqueda: "+req.query.search);
	if (req.query.search === undefined) {
		models.Quiz.findAll().then(function(quizes){
			res.render('quizes/index', { quizes: quizes, errors: []});
		}).catch(function(error) { next(error); });
	} else {
		models.Quiz.findAll({where: ["pregunta like ?", "%"+req.query.search.replace("+","%")+"%"]}).then(function(quizes){
		res.render('quizes/index', { quizes: quizes, errors: []});
		}).catch(function(error) { next(error); });
	}	
};


// GET /quizes/:id
exports.show = function(req, res){
	models.Quiz.find(req.params.quizId).then(function(quiz) {
		res.render('quizes/show', { quiz: req.quiz, errors: []});
	})
};

//GET /quizes/:id/answer
exports.answer = function(req, res){
	var resultado = 'Incorrecto';
	if (req.query.respuesta === req.quiz.respuesta){
		resultado = 'Correcto';
	}
	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});
};


// GET /quizes/new
exports.new = function(req, res) {
	var quiz = models.Quiz.build (
		{pregunta: "Pregunta", respuesta: "Respuesta"}
	);
	res.render('quizes/new', {quiz: quiz, errors: []});
};

// POST /quizes/create
exports.create = function(req,res){
	var quiz = models.Quiz.build( req.body.quiz );
	quiz.validate().then(function(err){
		if (err) {
			console.log("Error en crear pregunta");
			res.render('quizes/new', {quiz: quiz, errors: err.errors});
		} else {
			quiz.save({fields: ["pregunta", "respuesta", "tema"]}).then(function(){
			console.log("OK en crear pregunta");
			res.redirect('/quizes')})  // Redirección a lista de preguntas
		}
	});
};

// GET /quizes/:id/edit
exports.edit = function(req,res){
	var quiz = req.quiz;
	res.render('quizes/edit', {quiz: quiz, errors: []});
};

// PUT /quizes/:id
exports.update = function(req, res) {
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tema = req.body.quiz.tema;

	req.quiz.validate().then(function(err){
		if (err){
			res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
		} else {
			console.log("Tema: " + req.quiz.tema)
			req.quiz.save({fields: ["pregunta", "respuesta", "tema"]}).then(function(){
			res.redirect('/quizes');});
		}
	}
  );
};


// DELETE /quizes/:id
exports.destroy = function(req, res){
	req.quiz.destroy().then(function(){
		res.redirect('/quizes');
	}).catch(function(err) {next(error)});
};