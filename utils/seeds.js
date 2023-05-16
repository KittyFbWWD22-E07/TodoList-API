import {faker} from '@faker-js/faker';
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
                password: 'Balooba24!',
                role: faker.helpers.arrayElement(['admin', 'user']),
                // task: [],
            };
            users.push(user);
        }

        // 3. Insert fake users into the database
        await User.create(users);
        console.log('Users seeded successfully!');

        // 4. Generate 3 fake tasks for each user
        let tasks = [];

        const allUsers = await User.find();
        if (allUsers.length > 0) {
            for (let i = 0; i < allUsers.length; i++) {
                // check if user has any tasks already
                const numCurTasks = await Task.countDocuments({user: allUsers[i]._id});

                for (let j = 0; j < (3 - numCurTasks); j++) {
                    let task = {};
                    task.title = faker.lorem.words(3);
                    task.description = faker.lorem.sentence();
                    task.status = faker.helpers.arrayElement(['pending', 'inProgress', 'completed']);
                    task.user = allUsers[i]._id;
                    task.date = faker.date.recent({days: 7});
                    task.deadline = faker.date.future({days: 7});

                    // store task in database
                    const newTask = await Task.create(task);

                    // initialize user's tasks array if it's empty
                    if (!allUsers[i].tasks) {
                        allUsers[i].tasks = [];
                    }
                    
                    // add task to user's tasks array
                    allUsers[i].tasks.push(newTask._id);
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
