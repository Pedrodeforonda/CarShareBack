import Car from '../models/car.js';
import User from '../models/user.js';

const registerCar = async (carData) => {
    const { model, branch, year, admin, users } = carData;

    const car = new Car({
        model,
        branch,
        year,
        admin,
        users
    });

    await car.save();

    return car;
};

const findUsers = async () => {
    return User.find(undefined, undefined, undefined);
}

export default { registerCar, findUsers };