let cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: 'duywg0gtu',
    api_key: '755115282856655',
    api_secret: process.env.CLOUDINARY_SECRET
});

/**
 *
 * @param file
 * @param animalID
 * @return Promise of image URL
 */
const uploadAnimalImage = (file, animalID) => {
    const options = {asset_folder: "Animals", use_filename: true, use_filename_as_display_name: true, public_id: animalID}
    return cloudinary.uploader.upload(file, options ).then(d=>d.url);
}

const fetchAnimalImage = (animalID) => {
    //return cloudinary.url(`Animals/${animalID}.jpg`)
    return cloudinary.api.resource("1234").then(d=>d.url)

}

module.exports = {
    uploadAnimalImage,
    fetchAnimalImage
}
