/* Ideally, we would have functionality where we can generate an accurate or realistic VIN number.
 * We can do this because our vehicle model has various parameters like manufacturerName, modelName, modelYear, fuelType etc. that are used to generate a VIN.
 * However, for simplicity, we will generate a random 17 digit VIN number.
 */

function generateVin() {
    // Characters: 0-9, A-Z (excluding I, O, Q since they are not used in VINs)
    const characters = "ABCDEFGHJKLMNPRSTUVWXYZ0123456789";
    let result = '';
    let totalCharacters = characters.length;
    let i = 0;

    // a VIN is 17 characters long, so we pick randomly pick 17 characters
    while (i < 17) {
        let randomIndex = Math.floor(Math.random() * totalCharacters);
        result += characters[randomIndex];
        i += 1;
    }

    return result;
}

module.exports = generateVin;