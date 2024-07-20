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
const uploadAnimalImage = (file, animalID, avatar_image= false) => {
    const fileName = avatar_image?`${animalID}-avatar`:animalID
    const folderName = "Animals"// avatar_image?"Avatars":"Animals"
    const options = {asset_folder: folderName, use_filename: true, use_filename_as_display_name: true, public_id: fileName, overwrite: false}
    return cloudinary.uploader.upload(file, options).then(d=> d.url);
}

const fetchAnimalImage = (publicId) => {
    //return cloudinary.url(`Animals/${animalID}.jpg`)
    return cloudinary.api.resource(publicId).then(d=>d.url)

}

module.exports = {
    uploadAnimalImage,
    fetchAnimalImage
}
