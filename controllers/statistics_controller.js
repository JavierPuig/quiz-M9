var models = require('../models/models.js');

exports.statistics = function(req,res){
	// numPreguntas almacena el TOTAL de preguntas existentes
	models.Quiz.count().then(function(count_quiz){
		var numPreguntas = count_quiz;
	
		// numComentarios almacena el TOTAL de comentarios existentes
		models.Comment.count().then(function(count_comment){ 
			var numComentarios = count_comment;

			// mediaComentarios almacena la Media de comentarios por pregunta
			var mediaComentarios = (numComentarios / numPreguntas).toFixed(2) || 0;	

			// conComentarios almacena el número de las Preguntas que SI tienen comentarios
			models.Quiz.count({distinct: true, include: 
			[{model: models.Comment, required: true}]}).then(function(conComentarios) {
			
				// sinComentarios almacena el número de las Preguntas que NO tienen comentarios
				var sinComentarios = numPreguntas-conComentarios;	

				res.render('statistics', {preguntasQuiz: numPreguntas, comentariosQuiz: numComentarios, mediaComentariosQuiz: mediaComentarios, conComentariosQuiz: conComentarios, sinComentariosQuiz: sinComentarios, errors: []});
			});
		});
	});
};