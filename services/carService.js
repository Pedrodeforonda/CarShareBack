import Car from '../models/car.js';

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

export default { registerCar };