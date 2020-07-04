const express = require("express");
const cors = require("cors");
const { Sequelize, DataTypes } = require("sequelize");
const app = express();

app.use(cors());

/* Sequelize */
// Connecting to a database
const sequelize = new Sequelize("udemy", "root", "root", {
	host: "localhost",
	port: 3306,
	dialect: "mysql",
});

// db model
const Course = sequelize.define("course", {
	// Model attributes are defined here
	id: {
		primaryKey: true,
		type: DataTypes.INTEGER,
		autoIncrement: true,
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	url: {
		type: DataTypes.STRING,
	},
});

const Tutorial = sequelize.define("tutorial", {
	id: {
		allowNull: false,
		primaryKey: true,
		type: DataTypes.UUID,
		defaultValue: Sequelize.UUIDV4, // Or Sequelize.UUIDV1
	},
	label: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	url: {
		type: DataTypes.STRING,
		allowNull: true,
	},
});

const Category = sequelize.define("category", {
	id: {
		primaryKey: true,
		type: DataTypes.INTEGER,
		autoIncrement: true,
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
});

const CourseCategory = sequelize.define("course_category", {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
});

// Model Relationship
Course.belongsToMany(Category, { through: CourseCategory });
Category.belongsToMany(Course, { through: CourseCategory });
Course.hasMany(Tutorial);

// Testing the connection
async function authenticateSequelize() {
	let forceSync = false;
	try {
		// authenticating
		await sequelize.authenticate();

		// if (forceSync) {         // not working
		// 	// drop schema
		// 	await sequelize.dropSchema("udemy");

		// 	// create new schema
		// 	await sequelize.createSchema("udemy");
		// }

		await sequelize.sync({ force: forceSync, logging: console.log }).then(async () => {
			if (forceSync) {
				// inserting bulk records in one go
				let categoryResponses = await Category.bulkCreate([{ name: "Javascript" }, { name: "Angular" }, { name: "Node" }]);
				// inserting multiple courses at once
				let courseResponse = await Course.create({
					name: "AsynchronousJavascript",
					url: "https://pitneybowes.udemy.com/course/asynchronous-javascript/",
				});
				// association
				// console.log(categoryResponses[0].dataValues);
				let courseCategoryResponse = await CourseCategory.create({ courseId: courseResponse.id, categoryId: categoryResponses[0].id });
			}
			// for testing if association between Tutorial and
			// await Tutorial.create({ label: "Test", url: "testurl", courseId: 1 });

			/* for new course */
			let courseResponse = await Course.create({
				name: "Design Patterns in JavaScript",
				url: "https://pitneybowes.udemy.com/course/design-patterns-javascript/learn/quiz/4632006#overview",
			});
			// association
			// console.log(categoryResponses[0].dataValues);
			let courseCategoryResponse = await CourseCategory.create({ courseId: courseResponse.id, categoryId: 1 });

			await Course.sync();
			await CourseCategory.sync();
		});
		console.log("Connection has been established successfully.");
	} catch (error) {
		console.error("Unable to connect to the database:", error);
	}
}

authenticateSequelize();
/* Sequelize End */

app.get("/", async (req, res) => {
	console.log("coming req download url is : " + req.query.name);

	try {
		// considering courseid is 1
		await Tutorial.create({ label: req.query.name, url: req.query.url, courseId: 6 });
		res.send("ok").status(200);
	} catch (err) {
		console.log("Interval server error : ", err);
		res.send("Internal Server Error").status(500);
	}
});

app.listen(4000, function () {
	console.log("app is listening on port 4000");
});
