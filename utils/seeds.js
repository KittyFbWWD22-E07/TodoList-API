import {faker} from 'meteor/faker';
import {User} from '../models/user.js';
import {Task} from '../models/task.js';

export const seedDatabase = async (minDocs) => {

    try {
        let users = [];

        // 1. Check the number of users currently in the database
        const numCurUsers = await User.countDocuments();

        if (minDocs <= numCurUsers) {
            return console.log('Skip user seeding!');
        }

        // 2. Generate fake users
        for (let i = 0; i < minDocs - numCurUsers; i++) {
            const user = {
                fullname: faker.person.fullName(),
                email: faker.internet.email(),
                password: faker.internet.password({length: 8, pattern: /(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!$?-_#])[a-zA-Z0-9!$?-_#]{8,}/}),
                role: faker.helpers.arrayElement(['admin', 'user']),
            };
            users.push(user);
        }

        // 3. Insert fake users into the database
        await User.create(users);
        console.log('Users seeded successfully!');
        let tasks = [];
        const numCurTasks = await Task.countDocuments();
        if (minDocs > numCurTasks) {
            return console.log('Skip task seeding!');
        }

        const allUsers = await User.find();
        if (allUsers.length > 0) {
            for (let i = 0; i < allUsers.length; i++) {
                // check if user has any tasks already
                const numCurTasks = await User.countDocuments({task: allUsers[i]._id});

                for (let j = 0; j < (2 - numCurTasks); j++) {
                    let task = {};
                    tasks.title = faker.lorem.sentence(3);
                    tasks.description = faker.lorem.sentence(15);
                    tasks.status = faker.helpers.arrayElement(['pending', 'inProgress', 'completed']);
                    tasks.user = allUsers[i]._id;
                    tasks.date = faker.date.recent({days: 7});
                    tasks.deadline = faker.date.future({days: 7});

                    // tasks.push(task);
                    const newTask = await Task.create(task);
                    allUsers[i].task.push(newTask._id);
                }

                // save user
                await allUsers[i].save();
            }

            console.log('Tasks seeded successfully!');

        }
    } catch (error) {
        console.log(error.message);
    }
};
